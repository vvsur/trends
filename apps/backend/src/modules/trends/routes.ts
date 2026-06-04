import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { AppPrismaClient } from '../../shared/database/prisma-client.js';
import type { TrendCreateInput, TrendListFilters, TrendUpdateInput } from './service.js';
import { AuthenticationRequiredError } from '../../shared/rbac/fastify-rbac.js';
import { can } from '../../shared/rbac/policies.js';
import { PermissionDeniedError } from '../../shared/rbac/policies.js';
import { createCurrentActorRepository, resolveCurrentActor } from '../../shared/auth/current-actor.js';
import { createTrend, getTrend, listTrends, updateTrend } from './service.js';

export type TrendRoutesOptions = {
  prisma: AppPrismaClient;
};

type TrendParams = {
  id: string;
};

type TrendUpdateBody = TrendUpdateInput & {
  reason?: string;
};

type TrendListQuery = TrendListFilters;

const trendParamSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string' },
  },
} as const;

const trendCreateBodySchema = {
  type: 'object',
  required: [
    'description',
    'domainCode',
    'horizon',
    'maturityRingCode',
    'ownerId',
    'recommendationCode',
    'reviewDate',
    'statusCode',
    'title',
  ],
  additionalProperties: false,
  properties: {
    description: { type: 'string' },
    domainCode: { type: 'string' },
    horizon: { type: 'string' },
    maturityRingCode: { type: 'string' },
    ownerId: { type: 'string' },
    recommendationCode: { type: 'string' },
    relevanceScore: { type: ['integer', 'null'], minimum: 0, maximum: 100 },
    reviewDate: { type: 'string' },
    secondaryDomainCodes: {
      type: 'array',
      items: { type: 'string' },
    },
    sourceTrace: {},
    statusCode: { type: 'string' },
    title: { type: 'string' },
  },
} as const;

const trendListQuerySchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    departmentId: { type: 'string' },
    domainCode: { type: 'string' },
    ownerId: { type: 'string' },
    statusCode: { type: 'string' },
  },
} as const;

const trendUpdateBodySchema = {
  type: 'object',
  required: ['reason'],
  additionalProperties: false,
  properties: {
    description: { type: 'string' },
    domainCode: { type: 'string' },
    horizon: { type: 'string' },
    maturityRingCode: { type: 'string' },
    ownerId: { type: 'string' },
    reason: { type: 'string', minLength: 1 },
    recommendationCode: { type: 'string' },
    relevanceScore: { type: ['integer', 'null'], minimum: 0, maximum: 100 },
    reviewDate: { type: 'string' },
    secondaryDomainCodes: {
      type: 'array',
      items: { type: 'string' },
    },
    sourceTrace: {},
    statusCode: { type: 'string' },
    title: { type: 'string' },
  },
} as const;

async function requireTrendEditor(request: FastifyRequest, prisma: AppPrismaClient) {
  const actor = await resolveCurrentActor(request, createCurrentActorRepository(prisma));

  if (!actor) {
    throw new AuthenticationRequiredError();
  }

  if (!can(actor, 'create_edit_trend')) {
    throw new PermissionDeniedError('create_edit_trend');
  }

  return actor;
}

export async function registerTrendRoutes(app: FastifyInstance, options: TrendRoutesOptions) {
  app.get<{ Querystring: TrendListQuery }>('/trends', {
    schema: {
      querystring: trendListQuerySchema,
    },
  }, async (request) => ({
    data: await listTrends(options.prisma, request.query),
  }));

  app.get<{ Params: TrendParams }>('/trends/:id', {
    schema: {
      params: trendParamSchema,
    },
  }, async (request) => ({
    data: await getTrend(options.prisma, request.params.id),
  }));

  app.post<{ Body: TrendCreateInput }>('/trends', {
    schema: {
      body: trendCreateBodySchema,
    },
  }, async (request, reply) => {
    const actor = await requireTrendEditor(request, options.prisma);
    const item = await createTrend(options.prisma, request.body, actor);

    reply.status(201);
    return { data: item };
  });

  app.patch<{ Body: TrendUpdateBody; Params: TrendParams }>('/trends/:id', {
    schema: {
      body: trendUpdateBodySchema,
      params: trendParamSchema,
    },
  }, async (request) => {
    const actor = await requireTrendEditor(request, options.prisma);
    const { reason, ...input } = request.body;

    return {
      data: await updateTrend(options.prisma, request.params.id, input, actor, reason ?? ''),
    };
  });
}
