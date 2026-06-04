import { randomUUID } from 'node:crypto';
import { afterEach, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildApp } from '../../app.js';
import { createPrismaClient, type AppPrismaClient } from '../../shared/database/prisma-client.js';

let app: FastifyInstance | undefined;
let prisma: AppPrismaClient | undefined;

afterEach(async () => {
  await app?.close();
  await prisma?.$disconnect();
  app = undefined;
  prisma = undefined;
});

describe('reference data routes', () => {
  it('lists reference data dictionaries without mutation rights', async () => {
    app = await buildApp();

    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/reference-data/trend-domains',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().data).toEqual(expect.arrayContaining([
      expect.objectContaining({
        active: true,
        code: 'technology',
        visibleInMvp: true,
      }),
    ]));
  });

  it('requires an actor for reference data mutations', async () => {
    app = await buildApp();

    const response = await app.inject({
      method: 'POST',
      payload: {
        code: 'blocked_without_actor',
        description: 'Should not be created without actor.',
        name: 'Blocked without actor',
        sortOrder: 999,
      },
      url: '/api/v1/reference-data/trend-statuses',
    });

    expect(response.statusCode).toBe(401);
    expect(response.json()).toMatchObject({
      error: {
        code: 'unauthorized',
      },
    });
  });

  it('returns validation errors for invalid reference data payloads', async () => {
    app = await buildApp();

    const response = await app.inject({
      headers: {
        'x-trends-actor-email': 'admin@trends.local',
      },
      method: 'POST',
      payload: {
        code: '   ',
        description: 'Invalid payload should be rejected.',
        name: 'Invalid payload',
        sortOrder: 999,
      },
      url: '/api/v1/reference-data/trend-statuses',
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      error: {
        code: 'validation_error',
      },
    });
  });

  it('lets admin create, update and deactivate reference data with audit trail', async () => {
    prisma = createPrismaClient();
    app = await buildApp({ prisma });
    const code = `test_status_${randomUUID().slice(0, 8)}`;

    const createResponse = await app.inject({
      headers: {
        'x-trends-actor-email': 'admin@trends.local',
      },
      method: 'POST',
      payload: {
        code,
        description: 'Temporary status created by route test.',
        name: 'Temporary status',
        sortOrder: 900,
      },
      url: '/api/v1/reference-data/trend-statuses',
    });

    expect(createResponse.statusCode).toBe(201);
    const created = createResponse.json().data;
    expect(created).toMatchObject({
      active: true,
      code,
      name: 'Temporary status',
    });

    const updateResponse = await app.inject({
      headers: {
        'x-trends-actor-email': 'admin@trends.local',
      },
      method: 'PATCH',
      payload: {
        name: 'Updated temporary status',
        reason: 'Test update of managed reference data.',
      },
      url: `/api/v1/reference-data/trend-statuses/${created.id}`,
    });

    expect(updateResponse.statusCode).toBe(200);
    expect(updateResponse.json().data).toMatchObject({
      id: created.id,
      name: 'Updated temporary status',
    });

    const deactivateResponse = await app.inject({
      headers: {
        'x-trends-actor-email': 'admin@trends.local',
      },
      method: 'POST',
      payload: {
        reason: 'Test deactivate of managed reference data.',
      },
      url: `/api/v1/reference-data/trend-statuses/${created.id}/deactivate`,
    });

    expect(deactivateResponse.statusCode).toBe(200);
    expect(deactivateResponse.json().data).toMatchObject({
      active: false,
      id: created.id,
    });

    const auditCount = await prisma.auditEvent.count({
      where: {
        entityId: created.id,
        entityType: 'trend_status',
      },
    });
    expect(auditCount).toBeGreaterThanOrEqual(3);
  });
});
