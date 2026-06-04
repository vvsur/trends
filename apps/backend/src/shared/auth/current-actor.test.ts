import { describe, expect, it } from 'vitest';
import type { FastifyRequest } from 'fastify';
import { createPrismaClient } from '../database/prisma-client.js';
import { createCurrentActorRepository, readActorEmail, resolveCurrentActor } from './current-actor.js';

function requestWithHeaders(headers: Record<string, string>): FastifyRequest {
  return { headers } as FastifyRequest;
}

describe('current actor resolver', () => {
  it('reads normalized actor email from request header', async () => {
    expect(readActorEmail(requestWithHeaders({
      'x-trends-actor-email': ' ADMIN@TRENDS.LOCAL ',
    }))).toBe('admin@trends.local');
  });

  it('returns undefined without an actor header', async () => {
    await expect(resolveCurrentActor(requestWithHeaders({}), {
      async findUserByEmail() {
        throw new Error('should not query without header');
      },
    })).resolves.toBeUndefined();
  });

  it('resolves the seeded local admin actor from SQLite', async () => {
    const prisma = createPrismaClient();

    try {
      await expect(resolveCurrentActor(
        requestWithHeaders({ 'x-trends-actor-email': 'admin@trends.local' }),
        createCurrentActorRepository(prisma),
      )).resolves.toEqual({
        roles: [{
          active: true,
          role: 'admin',
          scopeType: 'global',
        }],
        userId: 'user-local-admin',
      });
    } finally {
      await prisma.$disconnect();
    }
  });
});
