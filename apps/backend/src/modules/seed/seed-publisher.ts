import type { AppPrismaClient } from '../../shared/database/prisma-client.js';
import { writeAuditEvent } from '../../shared/audit/audit-events.js';
import type { SeedLoadPlan, SeedLoadRecord } from './seed-loader.js';

export type SeedPublishResult = {
  strategicInitiatives: number;
  trends: number;
  users: number;
};

const sourceReviewDate = new Date('2026-12-31T00:00:00.000Z');

function ownerUserId(owner: string) {
  return `seed-owner-${owner.normalize('NFKD').replace(/[^\p{Letter}\p{Number}]+/gu, '-').replace(/^-|-$/g, '').toLowerCase()}`;
}

function ownerEmail(record: SeedLoadRecord) {
  return `${record.seed_key}@seed.trends.local`;
}

function trendDescription(record: SeedLoadRecord) {
  return record.comment
    ? `${record.comment}\n\nИсточник PDF: ${record.source_trace.source_section}, позиция ${record.source_trace.source_number}.`
    : `Источник PDF: ${record.source_trace.source_section}, позиция ${record.source_trace.source_number}.`;
}

async function ensureSeedAuditEvent(
  prisma: AppPrismaClient,
  input: {
    after: Record<string, unknown>;
    changedFields: string[];
    entityId: string;
    entityType: string;
    version: number;
  },
) {
  const existing = await prisma.auditEvent.findFirst({
    where: {
      entityId: input.entityId,
      entityType: input.entityType,
      eventType: 'seed',
      source: 'seed',
    },
  });

  if (existing) {
    return;
  }

  await writeAuditEvent(prisma.auditEvent, {
    actorId: 'seed-publisher',
    actorType: 'seed',
    after: input.after,
    changedFields: input.changedFields,
    entityId: input.entityId,
    entityType: input.entityType,
    entityVersionAfter: input.version,
    eventType: 'seed',
    source: 'seed',
  });
}

async function requireReferenceData(prisma: AppPrismaClient) {
  const [
    domain,
    maturityRing,
    recommendation,
    status,
  ] = await Promise.all([
    prisma.trendDomain.findUnique({ where: { code: 'technology' } }),
    prisma.maturityRing.findUnique({ where: { code: 'assess' } }),
    prisma.trendRecommendation.findUnique({ where: { code: 'assess' } }),
    prisma.trendStatus.findUnique({ where: { code: 'in_review' } }),
  ]);

  if (!domain || !maturityRing || !recommendation || !status) {
    throw new Error('Required trend reference data is missing.');
  }

  return {
    domain,
    maturityRing,
    recommendation,
    status,
  };
}

async function requireDepartment(prisma: AppPrismaClient, code: string) {
  const department = await prisma.department.findUnique({ where: { code } });

  if (!department) {
    throw new Error(`Required seed department is missing: ${code}`);
  }

  return department;
}

async function publishTechnologyTrend(
  prisma: AppPrismaClient,
  record: SeedLoadRecord,
  refs: Awaited<ReturnType<typeof requireReferenceData>>,
) {
  const department = await requireDepartment(prisma, record.department_code);
  const userId = ownerUserId(record.owner);

  await prisma.user.upsert({
    create: {
      departmentId: department.id,
      displayName: record.owner,
      email: ownerEmail(record),
      id: userId,
      status: 'active',
    },
    update: {
      departmentId: department.id,
      displayName: record.owner,
      status: 'active',
    },
    where: { id: userId },
  });

  const trend = await prisma.trend.upsert({
    create: {
      description: trendDescription(record),
      domainId: refs.domain.id,
      horizon: record.year ?? '2026',
      id: record.seed_key,
      maturityRingId: refs.maturityRing.id,
      ownerId: userId,
      recommendationId: refs.recommendation.id,
      reviewDate: sourceReviewDate,
      secondaryDomainsJson: JSON.stringify([]),
      sourceTraceJson: JSON.stringify(record.source_trace),
      statusId: refs.status.id,
      title: record.title,
      updatedAt: new Date(),
      version: 1,
    },
    update: {
      description: trendDescription(record),
      horizon: record.year ?? '2026',
      maturityRingId: refs.maturityRing.id,
      ownerId: userId,
      recommendationId: refs.recommendation.id,
      reviewDate: sourceReviewDate,
      sourceTraceJson: JSON.stringify(record.source_trace),
      statusId: refs.status.id,
      title: record.title,
    },
    where: { id: record.seed_key },
  });

  await ensureSeedAuditEvent(prisma, {
    after: {
      description: trend.description,
      horizon: trend.horizon,
      sourceTrace: record.source_trace,
      title: trend.title,
    },
    changedFields: ['title', 'description', 'horizon', 'sourceTrace'],
    entityId: trend.id,
    entityType: 'trend',
    version: trend.version,
  });

  return userId;
}

async function publishStrategicInitiative(prisma: AppPrismaClient, record: SeedLoadRecord) {
  const department = await requireDepartment(prisma, record.department_code);

  const initiative = await prisma.strategicInitiative.upsert({
    create: {
      comment: record.comment,
      createdQuarter: record.created_quarter,
      departmentId: department.id,
      id: record.seed_key,
      ownerName: record.owner,
      seedKey: record.seed_key,
      sourceTraceJson: JSON.stringify(record.source_trace),
      title: record.title,
      updatedAt: new Date(),
      version: 1,
      year: record.year ?? '',
    },
    update: {
      comment: record.comment,
      createdQuarter: record.created_quarter,
      departmentId: department.id,
      ownerName: record.owner,
      sourceTraceJson: JSON.stringify(record.source_trace),
      title: record.title,
      year: record.year ?? '',
    },
    where: { seedKey: record.seed_key },
  });

  await ensureSeedAuditEvent(prisma, {
    after: {
      comment: initiative.comment,
      createdQuarter: initiative.createdQuarter,
      ownerName: initiative.ownerName,
      sourceTrace: record.source_trace,
      title: initiative.title,
      year: initiative.year,
    },
    changedFields: ['title', 'comment', 'createdQuarter', 'ownerName', 'year', 'sourceTrace'],
    entityId: initiative.id,
    entityType: 'strategic_initiative',
    version: initiative.version,
  });
}

export async function publishSeedPlan(prisma: AppPrismaClient, plan: SeedLoadPlan): Promise<SeedPublishResult> {
  const refs = await requireReferenceData(prisma);
  const userIds = new Set<string>();
  let strategicInitiatives = 0;
  let trends = 0;

  for (const record of plan.records) {
    if (record.entity_kind === 'technology_trend') {
      userIds.add(await publishTechnologyTrend(prisma, record, refs));
      trends += 1;
      continue;
    }

    await publishStrategicInitiative(prisma, record);
    strategicInitiatives += 1;
  }

  return {
    strategicInitiatives,
    trends,
    users: userIds.size,
  };
}
