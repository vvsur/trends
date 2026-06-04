import type { AppPrismaClient } from '../../shared/database/prisma-client.js';
import type {
  TrendGetPayload,
  TrendUncheckedCreateInput,
  TrendUncheckedUpdateInput,
  TrendWhereInput,
} from '../../shared/database/generated/client/models/Trend.js';
import type { Actor } from '../../shared/rbac/policies.js';
import { actorRoleForAudit, writeAuditEvent } from '../../shared/audit/audit-events.js';

export type TrendCreateInput = {
  title: string;
  description: string;
  domainCode: string;
  secondaryDomainCodes?: string[];
  maturityRingCode: string;
  recommendationCode: string;
  ownerId: string;
  reviewDate: string;
  statusCode: string;
  horizon: string;
  relevanceScore?: number | null;
  sourceTrace?: unknown;
};

export type TrendUpdateInput = Partial<TrendCreateInput>;

export type TrendListFilters = {
  domainCode?: string;
  statusCode?: string;
  ownerId?: string;
  departmentId?: string;
};

export type TrendItem = {
  id: string;
  title: string;
  description: string;
  domain: TrendReference;
  secondaryDomainCodes: string[];
  maturityRing: TrendReference;
  recommendation: TrendReference;
  owner: {
    id: string;
    displayName: string;
    email: string;
    status: string;
  };
  reviewDate: string;
  status: TrendReference;
  horizon: string;
  relevanceScore: number | null;
  sourceTrace: unknown;
  version: number;
  createdAt: string;
  updatedAt: string;
};

type TrendReference = {
  id: string;
  code: string;
  name: string;
};

const trendInclude = {
  domain: true,
  maturityRing: true,
  owner: {
    select: {
      displayName: true,
      email: true,
      id: true,
      status: true,
    },
  },
  recommendation: true,
  status: true,
} as const;

type TrendWithRelations = TrendGetPayload<{ include: typeof trendInclude }>;

function requireNonEmpty(value: string | undefined, field: string): string {
  const normalized = value?.trim();

  if (!normalized) {
    throw new TrendValidationError(`${field} is required.`);
  }

  return normalized;
}

function parseReviewDate(value: string | undefined): Date {
  const normalized = requireNonEmpty(value, 'reviewDate');
  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) {
    throw new TrendValidationError('reviewDate must be a valid date.');
  }

  return date;
}

function validateRelevanceScore(value: number | null | undefined): number | null | undefined {
  if (value === undefined || value === null) {
    return value;
  }

  if (!Number.isInteger(value) || value < 0 || value > 100) {
    throw new TrendValidationError('relevanceScore must be an integer from 0 to 100.');
  }

  return value;
}

function parseJsonArray(value: string): string[] {
  const parsed = JSON.parse(value) as unknown;
  return Array.isArray(parsed) && parsed.every((item) => typeof item === 'string') ? parsed : [];
}

function parseJsonValue(value: string | null): unknown {
  return value ? JSON.parse(value) : null;
}

function mapReference(input: { id: string; code: string; name: string }): TrendReference {
  return {
    code: input.code,
    id: input.id,
    name: input.name,
  };
}

function mapTrend(trend: TrendWithRelations): TrendItem {
  return {
    createdAt: trend.createdAt.toISOString(),
    description: trend.description,
    domain: mapReference(trend.domain),
    horizon: trend.horizon,
    id: trend.id,
    maturityRing: mapReference(trend.maturityRing),
    owner: trend.owner,
    recommendation: mapReference(trend.recommendation),
    relevanceScore: trend.relevanceScore,
    reviewDate: trend.reviewDate.toISOString(),
    secondaryDomainCodes: parseJsonArray(trend.secondaryDomainsJson),
    sourceTrace: parseJsonValue(trend.sourceTraceJson),
    status: mapReference(trend.status),
    title: trend.title,
    updatedAt: trend.updatedAt.toISOString(),
    version: trend.version,
  };
}

async function requireDomain(prisma: AppPrismaClient, code: string) {
  const domain = await prisma.trendDomain.findUnique({ where: { code } });

  if (!domain || !domain.active) {
    throw new TrendValidationError(`Active trend domain was not found: ${code}`);
  }

  return domain;
}

async function requireMaturityRing(prisma: AppPrismaClient, code: string) {
  const maturityRing = await prisma.maturityRing.findUnique({ where: { code } });

  if (!maturityRing || !maturityRing.active) {
    throw new TrendValidationError(`Active maturity ring was not found: ${code}`);
  }

  return maturityRing;
}

async function requireRecommendation(prisma: AppPrismaClient, code: string) {
  const recommendation = await prisma.trendRecommendation.findUnique({ where: { code } });

  if (!recommendation || !recommendation.active) {
    throw new TrendValidationError(`Active trend recommendation was not found: ${code}`);
  }

  return recommendation;
}

async function requireStatus(prisma: AppPrismaClient, code: string) {
  const status = await prisma.trendStatus.findUnique({ where: { code } });

  if (!status || !status.active) {
    throw new TrendValidationError(`Active trend status was not found: ${code}`);
  }

  return status;
}

async function requireOwner(prisma: AppPrismaClient, ownerId: string) {
  const owner = await prisma.user.findUnique({ where: { id: ownerId } });

  if (!owner || owner.status !== 'active') {
    throw new TrendValidationError(`Active owner was not found: ${ownerId}`);
  }

  return owner;
}

async function resolveSecondaryDomainCodes(prisma: AppPrismaClient, codes: string[] | undefined): Promise<string[]> {
  const normalizedCodes = [...new Set((codes ?? []).map((code) => code.trim()).filter(Boolean))];

  for (const code of normalizedCodes) {
    await requireDomain(prisma, code);
  }

  return normalizedCodes;
}

function buildTrendWhere(filters: TrendListFilters): TrendWhereInput {
  const where: TrendWhereInput = {};

  if (filters.domainCode) {
    where.domain = { code: filters.domainCode };
  }

  if (filters.statusCode) {
    where.status = { code: filters.statusCode };
  }

  if (filters.ownerId) {
    where.ownerId = filters.ownerId;
  }

  if (filters.departmentId) {
    where.owner = { departmentId: filters.departmentId };
  }

  return where;
}

export async function listTrends(prisma: AppPrismaClient, filters: TrendListFilters = {}): Promise<TrendItem[]> {
  const trends = await prisma.trend.findMany({
    include: trendInclude,
    orderBy: [
      { updatedAt: 'desc' },
      { title: 'asc' },
    ],
    where: buildTrendWhere(filters),
  });

  return trends.map(mapTrend);
}

export async function getTrend(prisma: AppPrismaClient, id: string): Promise<TrendItem> {
  const trend = await prisma.trend.findUnique({
    include: trendInclude,
    where: { id },
  });

  if (!trend) {
    throw new TrendNotFoundError();
  }

  return mapTrend(trend);
}

export async function createTrend(
  prisma: AppPrismaClient,
  input: TrendCreateInput,
  actor: Actor,
): Promise<TrendItem> {
  const title = requireNonEmpty(input.title, 'title');
  const description = requireNonEmpty(input.description, 'description');
  const horizon = requireNonEmpty(input.horizon, 'horizon');
  const reviewDate = parseReviewDate(input.reviewDate);
  const relevanceScore = validateRelevanceScore(input.relevanceScore);

  return prisma.$transaction(async (tx) => {
    const transaction = tx as AppPrismaClient;
    const domain = await requireDomain(transaction, requireNonEmpty(input.domainCode, 'domainCode'));
    const maturityRing = await requireMaturityRing(transaction, requireNonEmpty(input.maturityRingCode, 'maturityRingCode'));
    const recommendation = await requireRecommendation(transaction, requireNonEmpty(input.recommendationCode, 'recommendationCode'));
    const status = await requireStatus(transaction, requireNonEmpty(input.statusCode, 'statusCode'));
    await requireOwner(transaction, requireNonEmpty(input.ownerId, 'ownerId'));
    const secondaryDomainCodes = await resolveSecondaryDomainCodes(transaction, input.secondaryDomainCodes);

    const data: TrendUncheckedCreateInput = {
      description,
      domainId: domain.id,
      horizon,
      maturityRingId: maturityRing.id,
      ownerId: input.ownerId,
      recommendationId: recommendation.id,
      relevanceScore: relevanceScore ?? null,
      reviewDate,
      secondaryDomainsJson: JSON.stringify(secondaryDomainCodes),
      sourceTraceJson: input.sourceTrace === undefined ? null : JSON.stringify(input.sourceTrace),
      statusId: status.id,
      title,
      updatedAt: new Date(),
    };

    const created = await transaction.trend.create({
      data,
      include: trendInclude,
    });
    const mapped = mapTrend(created);
    const auditRole = actorRoleForAudit(actor, 'trend_owner') ?? actorRoleForAudit(actor, 'admin');

    await writeAuditEvent(transaction.auditEvent, {
      actorId: actor.userId,
      actorType: 'user',
      after: mapped,
      changedFields: Object.keys(input),
      entityId: created.id,
      entityType: 'trend',
      entityVersionAfter: created.version,
      eventType: 'create',
      source: 'manual',
      ...(auditRole ? { actorRole: auditRole } : {}),
    });

    return mapped;
  });
}

export async function updateTrend(
  prisma: AppPrismaClient,
  id: string,
  input: TrendUpdateInput,
  actor: Actor,
  reason: string,
): Promise<TrendItem> {
  return prisma.$transaction(async (tx) => {
    const transaction = tx as AppPrismaClient;
    const before = await transaction.trend.findUnique({
      include: trendInclude,
      where: { id },
    });

    if (!before) {
      throw new TrendNotFoundError();
    }

    const domain = input.domainCode ? await requireDomain(transaction, requireNonEmpty(input.domainCode, 'domainCode')) : before.domain;
    const maturityRing = input.maturityRingCode
      ? await requireMaturityRing(transaction, requireNonEmpty(input.maturityRingCode, 'maturityRingCode'))
      : before.maturityRing;
    const recommendation = input.recommendationCode
      ? await requireRecommendation(transaction, requireNonEmpty(input.recommendationCode, 'recommendationCode'))
      : before.recommendation;
    const status = input.statusCode ? await requireStatus(transaction, requireNonEmpty(input.statusCode, 'statusCode')) : before.status;
    const ownerId = input.ownerId ? requireNonEmpty(input.ownerId, 'ownerId') : before.ownerId;
    await requireOwner(transaction, ownerId);
    const secondaryDomainCodes = input.secondaryDomainCodes
      ? await resolveSecondaryDomainCodes(transaction, input.secondaryDomainCodes)
      : parseJsonArray(before.secondaryDomainsJson);

    const data: TrendUncheckedUpdateInput = {
      domainId: domain.id,
      maturityRingId: maturityRing.id,
      ownerId,
      recommendationId: recommendation.id,
      secondaryDomainsJson: JSON.stringify(secondaryDomainCodes),
      statusId: status.id,
      version: { increment: 1 },
    };

    if (input.description !== undefined) {
      data.description = requireNonEmpty(input.description, 'description');
    }

    if (input.horizon !== undefined) {
      data.horizon = requireNonEmpty(input.horizon, 'horizon');
    }

    if (input.relevanceScore !== undefined) {
      data.relevanceScore = validateRelevanceScore(input.relevanceScore) ?? null;
    }

    if (input.reviewDate !== undefined) {
      data.reviewDate = parseReviewDate(input.reviewDate);
    }

    if (input.sourceTrace !== undefined) {
      data.sourceTraceJson = JSON.stringify(input.sourceTrace);
    }

    if (input.title !== undefined) {
      data.title = requireNonEmpty(input.title, 'title');
    }

    const updated = await transaction.trend.update({
      data,
      include: trendInclude,
      where: { id },
    });
    const mappedBefore = mapTrend(before);
    const mappedAfter = mapTrend(updated);
    const auditRole = actorRoleForAudit(actor, 'trend_owner') ?? actorRoleForAudit(actor, 'admin');

    await writeAuditEvent(transaction.auditEvent, {
      actorId: actor.userId,
      actorType: 'user',
      before: mappedBefore,
      after: mappedAfter,
      changedFields: Object.keys(input),
      entityId: id,
      entityType: 'trend',
      entityVersionAfter: updated.version,
      entityVersionBefore: before.version,
      eventType: 'correction',
      reason,
      source: 'manual',
      ...(auditRole ? { actorRole: auditRole } : {}),
    });

    return mappedAfter;
  });
}

export class TrendValidationError extends Error {
  statusCode = 400;

  constructor(message: string) {
    super(message);
    this.name = 'TrendValidationError';
  }
}

export class TrendNotFoundError extends Error {
  statusCode = 404;

  constructor() {
    super('Trend was not found.');
    this.name = 'TrendNotFoundError';
  }
}
