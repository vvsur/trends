import { randomUUID } from 'node:crypto';
import { afterEach, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildApp } from '../../app.js';
import { createPrismaClient, type AppPrismaClient } from '../../shared/database/prisma-client.js';

let app: FastifyInstance | undefined;
let prisma: AppPrismaClient | undefined;
const createdTrendIds: string[] = [];

afterEach(async () => {
  if (prisma && createdTrendIds.length > 0) {
    await prisma.auditEvent.deleteMany({
      where: {
        entityId: { in: createdTrendIds },
        entityType: 'trend',
      },
    });
    await prisma.trend.deleteMany({
      where: {
        id: { in: createdTrendIds },
      },
    });
    createdTrendIds.length = 0;
  }

  await app?.close();
  await prisma?.$disconnect();
  app = undefined;
  prisma = undefined;
});

describe('trend routes', () => {
  it('requires an actor for creating trend cards', async () => {
    app = await buildApp();

    const response = await app.inject({
      method: 'POST',
      payload: {
        description: 'A trend card must be protected by RBAC.',
        domainCode: 'technology',
        horizon: '2026',
        maturityRingCode: 'assess',
        ownerId: 'user-local-admin',
        recommendationCode: 'watch',
        reviewDate: '2026-12-31',
        statusCode: 'draft',
        title: 'Unauthorized trend',
      },
      url: '/api/v1/trends',
    });

    expect(response.statusCode).toBe(401);
    expect(response.json()).toMatchObject({
      error: {
        code: 'unauthorized',
      },
    });
  });

  it('rejects trend card creation without a primary domain', async () => {
    app = await buildApp();

    const response = await app.inject({
      headers: {
        'x-trends-actor-email': 'admin@trends.local',
      },
      method: 'POST',
      payload: {
        description: 'A trend must always belong to a primary domain.',
        horizon: '2026',
        maturityRingCode: 'assess',
        ownerId: 'user-local-admin',
        recommendationCode: 'watch',
        reviewDate: '2026-12-31',
        statusCode: 'draft',
        title: 'Trend without domain',
      },
      url: '/api/v1/trends',
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      error: {
        code: 'validation_error',
      },
    });
  });

  it('lets admin create, read and update a trend card with audit trail', async () => {
    prisma = createPrismaClient();
    app = await buildApp({ prisma });
    const title = `Корпоративная AI-платформа для безопасного внедрения GenAI ${randomUUID().slice(0, 8)}`;

    const createResponse = await app.inject({
      headers: {
        'x-trends-actor-email': 'admin@trends.local',
      },
      method: 'POST',
      payload: {
        description: 'Tracks reusable AI services, governance, model access and production adoption for the MVP trend registry.',
        domainCode: 'technology',
        horizon: '2026',
        maturityRingCode: 'assess',
        ownerId: 'user-local-admin',
        recommendationCode: 'watch',
        relevanceScore: 42,
        reviewDate: '2026-12-31',
        secondaryDomainCodes: [],
        statusCode: 'draft',
        title,
      },
      url: '/api/v1/trends',
    });

    expect(createResponse.statusCode).toBe(201);
    const created = createResponse.json().data;
    createdTrendIds.push(created.id);
    expect(created).toMatchObject({
      description: 'Tracks reusable AI services, governance, model access and production adoption for the MVP trend registry.',
      domain: {
        code: 'technology',
      },
      maturityRing: {
        code: 'assess',
      },
      owner: {
        id: 'user-local-admin',
      },
      recommendation: {
        code: 'watch',
      },
      status: {
        code: 'draft',
      },
      title,
      version: 1,
    });

    const getResponse = await app.inject({
      method: 'GET',
      url: `/api/v1/trends/${created.id}`,
    });

    expect(getResponse.statusCode).toBe(200);
    expect(getResponse.json().data).toMatchObject({
      id: created.id,
      title,
    });

    const matchingListResponse = await app.inject({
      method: 'GET',
      url: `/api/v1/trends?domainCode=technology&statusCode=draft&ownerId=user-local-admin&departmentId=department-itg`,
    });

    expect(matchingListResponse.statusCode).toBe(200);
    expect(matchingListResponse.json().data).toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: created.id,
        title,
      }),
    ]));

    const nonMatchingListResponse = await app.inject({
      method: 'GET',
      url: `/api/v1/trends?domainCode=technology&statusCode=archived&ownerId=user-local-admin&departmentId=department-itg`,
    });

    expect(nonMatchingListResponse.statusCode).toBe(200);
    expect(nonMatchingListResponse.json().data).not.toEqual(expect.arrayContaining([
      expect.objectContaining({
        id: created.id,
      }),
    ]));

    const updateResponse = await app.inject({
      headers: {
        'x-trends-actor-email': 'admin@trends.local',
      },
      method: 'PATCH',
      payload: {
        recommendationCode: 'assess',
        reason: 'Refine recommendation after owner review.',
        statusCode: 'in_review',
      },
      url: `/api/v1/trends/${created.id}`,
    });

    expect(updateResponse.statusCode).toBe(200);
    expect(updateResponse.json().data).toMatchObject({
      id: created.id,
      recommendation: {
        code: 'assess',
      },
      status: {
        code: 'in_review',
      },
      version: 2,
    });

    const auditEvents = await prisma.auditEvent.findMany({
      orderBy: { createdAt: 'asc' },
      where: {
        entityId: created.id,
        entityType: 'trend',
      },
    });

    expect(auditEvents).toHaveLength(2);
    expect(auditEvents.map((event) => event.eventType)).toEqual(['create', 'correction']);
    expect(auditEvents.map((event) => event.source)).toEqual(['manual', 'manual']);
    expect(auditEvents[1]?.reason).toBe('Refine recommendation after owner review.');
  });
});
