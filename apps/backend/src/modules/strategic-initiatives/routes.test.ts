import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildApp } from '../../app.js';
import { createPrismaClient, type AppPrismaClient } from '../../shared/database/prisma-client.js';
import { runSeedLoader } from '../seed/seed-loader.js';
import { publishSeedPlan } from '../seed/seed-publisher.js';

const moduleDir = dirname(fileURLToPath(import.meta.url));
const repositoryRoot = resolve(moduleDir, '../../../../..');

let app: FastifyInstance | undefined;
let prisma: AppPrismaClient | undefined;

beforeEach(async () => {
  prisma = createPrismaClient();
  const seedLoaderResult = await runSeedLoader(repositoryRoot);
  await publishSeedPlan(prisma, seedLoaderResult.plan);
  app = await buildApp({ prisma });
});

afterEach(async () => {
  await app?.close();
  await prisma?.$disconnect();
  app = undefined;
  prisma = undefined;
});

describe('strategic initiative routes', () => {
  it('lists PDF-seeded strategic initiatives with source traceability', async () => {
    const response = await app!.inject({
      method: 'GET',
      url: '/api/v1/strategic-initiatives',
    });

    expect(response.statusCode).toBe(200);
    const data = response.json().data;
    expect(data).toHaveLength(7);
    expect(data).toEqual(expect.arrayContaining([
      expect.objectContaining({
        department: expect.objectContaining({ code: 'ITG' }),
        seedKey: 'pdf-task-2-strategic-initiative-1',
        sourceTrace: expect.objectContaining({
          source_number: 1,
          source_pdf: 'source-materials/trends-portal-task-2.pdf',
        }),
        title: 'FastTrack инноваций',
      }),
    ]));

    const seedAuditEvents = await prisma!.auditEvent.count({
      where: {
        entityType: 'strategic_initiative',
        eventType: 'seed',
        source: 'seed',
      },
    });
    expect(seedAuditEvents).toBe(7);
  });
});
