import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { AppPrismaClient } from '../../shared/database/prisma-client.js';
import type { ReferenceDataInput } from './service.js';
import { can } from '../../shared/rbac/policies.js';
import { AuthenticationRequiredError } from '../../shared/rbac/fastify-rbac.js';
import { PermissionDeniedError } from '../../shared/rbac/policies.js';
import { createCurrentActorRepository, resolveCurrentActor } from '../../shared/auth/current-actor.js';
import {
  createReferenceData,
  deactivateReferenceData,
  listReferenceData,
  updateReferenceData,
} from './service.js';
import { isDictionaryName } from './dictionaries.js';

export type ReferenceDataRoutesOptions = {
  prisma: AppPrismaClient;
};

type DictionaryParams = {
  dictionary: string;
};

type DictionaryItemParams = DictionaryParams & {
  id: string;
};

type UpdateBody = Partial<ReferenceDataInput> & {
  reason?: string;
};

const dictionaryParamSchema = {
  type: 'object',
  required: ['dictionary'],
  properties: {
    dictionary: { type: 'string' },
  },
} as const;

const dictionaryItemParamSchema = {
  type: 'object',
  required: ['dictionary', 'id'],
  properties: {
    dictionary: { type: 'string' },
    id: { type: 'string' },
  },
} as const;

const referenceDataBodySchema = {
  type: 'object',
  required: ['code', 'name', 'description', 'sortOrder'],
  additionalProperties: false,
  properties: {
    active: { type: 'boolean' },
    code: { type: 'string' },
    description: { type: 'string' },
    name: { type: 'string' },
    sortOrder: { type: 'integer' },
    visibleInMvp: { type: 'boolean' },
  },
} as const;

const updateReferenceDataBodySchema = {
  type: 'object',
  required: ['reason'],
  additionalProperties: false,
  properties: {
    active: { type: 'boolean' },
    code: { type: 'string' },
    description: { type: 'string' },
    name: { type: 'string' },
    reason: { type: 'string', minLength: 1 },
    sortOrder: { type: 'integer' },
    visibleInMvp: { type: 'boolean' },
  },
} as const;

const deactivateBodySchema = {
  type: 'object',
  required: ['reason'],
  additionalProperties: false,
  properties: {
    reason: { type: 'string', minLength: 1 },
  },
} as const;

function requireDictionary(value: string) {
  if (!isDictionaryName(value)) {
    throw new UnknownDictionaryError(value);
  }

  return value;
}

async function requireAdminActor(request: FastifyRequest, prisma: AppPrismaClient) {
  const actor = await resolveCurrentActor(request, createCurrentActorRepository(prisma));

  if (!actor) {
    throw new AuthenticationRequiredError();
  }

  if (!can(actor, 'manage_reference_data')) {
    throw new PermissionDeniedError('manage_reference_data');
  }

  return actor;
}

export async function registerReferenceDataRoutes(app: FastifyInstance, options: ReferenceDataRoutesOptions) {
  app.get<{ Params: DictionaryParams }>('/reference-data/:dictionary', {
    schema: {
      params: dictionaryParamSchema,
    },
  }, async (request) => {
    const dictionary = requireDictionary(request.params.dictionary);
    return {
      data: await listReferenceData(options.prisma, dictionary),
    };
  });

  app.post<{ Body: ReferenceDataInput; Params: DictionaryParams }>('/reference-data/:dictionary', {
    schema: {
      body: referenceDataBodySchema,
      params: dictionaryParamSchema,
    },
  }, async (request, reply) => {
    const dictionary = requireDictionary(request.params.dictionary);
    const actor = await requireAdminActor(request, options.prisma);
    const item = await createReferenceData(options.prisma, dictionary, request.body, actor);

    reply.status(201);
    return { data: item };
  });

  app.patch<{ Body: UpdateBody; Params: DictionaryItemParams }>('/reference-data/:dictionary/:id', {
    schema: {
      body: updateReferenceDataBodySchema,
      params: dictionaryItemParamSchema,
    },
  }, async (request) => {
    const dictionary = requireDictionary(request.params.dictionary);
    const actor = await requireAdminActor(request, options.prisma);
    const { reason, ...input } = request.body;

    return {
      data: await updateReferenceData(options.prisma, dictionary, request.params.id, input, actor, reason ?? ''),
    };
  });

  app.post<{ Body: { reason: string }; Params: DictionaryItemParams }>('/reference-data/:dictionary/:id/deactivate', {
    schema: {
      body: deactivateBodySchema,
      params: dictionaryItemParamSchema,
    },
  }, async (request) => {
    const dictionary = requireDictionary(request.params.dictionary);
    const actor = await requireAdminActor(request, options.prisma);

    return {
      data: await deactivateReferenceData(options.prisma, dictionary, request.params.id, actor, request.body.reason),
    };
  });
}

class UnknownDictionaryError extends Error {
  statusCode = 404;

  constructor(dictionary: string) {
    super(`Unknown reference data dictionary: ${dictionary}`);
    this.name = 'UnknownDictionaryError';
  }
}
