import { describe, expect, it } from 'vitest';
import Fastify from 'fastify';
import { can, type Actor } from './policies.js';
import { createRbacPreHandler } from './fastify-rbac.js';
import { registerApiErrorHandlers } from '../api-errors.js';

describe('rbac policies', () => {
  it('allows admin to manage reference data', () => {
    const actor: Actor = {
      userId: 'admin-1',
      roles: [{ role: 'admin', active: true }],
    };

    expect(can(actor, 'manage_reference_data')).toBe(true);
  });

  it('limits trend owner permissions by department scope', () => {
    const actor: Actor = {
      userId: 'owner-1',
      roles: [{ role: 'trend_owner', active: true, scopeType: 'department', scopeId: 'department-itg' }],
    };

    expect(can(actor, 'create_edit_trend', { departmentId: 'department-itg' })).toBe(true);
    expect(can(actor, 'create_edit_trend', { departmentId: 'department-kss' })).toBe(false);
  });

  it('distinguishes expert, executive and employee capabilities', () => {
    const expert: Actor = {
      userId: 'expert-1',
      roles: [{ role: 'expert', active: true }],
    };
    const executive: Actor = {
      userId: 'executive-1',
      roles: [{ role: 'executive', active: true }],
    };
    const employee: Actor = {
      userId: 'employee-1',
      roles: [{ role: 'employee', active: true }],
    };

    expect(can(expert, 'score_innovation')).toBe(true);
    expect(can(executive, 'record_management_decision')).toBe(true);
    expect(can(employee, 'score_innovation')).toBe(false);
  });

  it('allows employee self-service only for own idea status', () => {
    const actor: Actor = {
      userId: 'employee-1',
      roles: [{ role: 'employee', active: true }],
    };

    expect(can(actor, 'view_own_idea_status', { authorId: 'employee-1' })).toBe(true);
    expect(can(actor, 'view_own_idea_status', { authorId: 'employee-2' })).toBe(false);
  });

  it('returns shared API errors from the Fastify preHandler', async () => {
    const app = Fastify({ logger: false });
    registerApiErrorHandlers(app);
    app.get('/admin-only', {
      preHandler: createRbacPreHandler({
        capability: 'manage_reference_data',
        getActor: () => ({
          userId: 'employee-1',
          roles: [{ role: 'employee', active: true }],
        }),
      }),
    }, async () => ({ ok: true }));

    const response = await app.inject({
      method: 'GET',
      url: '/admin-only',
    });

    await app.close();

    expect(response.statusCode).toBe(403);
    expect(response.json()).toMatchObject({
      error: {
        code: 'forbidden',
        statusCode: 403,
      },
    });
  });
});
