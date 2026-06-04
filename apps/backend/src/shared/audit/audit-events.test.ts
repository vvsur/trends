import { describe, expect, it } from 'vitest';
import { buildAuditEventRecord, ReasonRequiredError, writeAuditEvent, type AuditEventRecord } from './audit-events.js';

describe('audit events', () => {
  it('builds a create event with actor and after snapshot', () => {
    const record = buildAuditEventRecord({
      actorId: 'user-1',
      actorRole: 'admin',
      actorScope: { scopeType: 'global' },
      actorType: 'user',
      after: { code: 'technology' },
      changedFields: ['code'],
      entityId: 'domain-technology',
      entityType: 'reference_data',
      entityVersionAfter: 1,
      eventType: 'create',
      source: 'manual',
    });

    expect(record).toMatchObject({
      actorId: 'user-1',
      actorRole: 'admin',
      actorScopeJson: '{"scopeType":"global"}',
      afterJson: '{"code":"technology"}',
      beforeJson: null,
      changedFieldsJson: '["code"]',
      entityVersionBefore: null,
      entityVersionAfter: 1,
      eventType: 'create',
    });
  });

  it('builds an update event with before/after versions and reason', () => {
    const record = buildAuditEventRecord({
      actorId: 'owner-1',
      actorType: 'user',
      before: { status: 'draft' },
      after: { status: 'published' },
      changedFields: ['status'],
      entityId: 'trend-1',
      entityType: 'trend',
      entityVersionBefore: 2,
      entityVersionAfter: 3,
      eventType: 'status_change',
      reason: 'Reviewed by domain expert',
      source: 'manual',
    });

    expect(record.reason).toBe('Reviewed by domain expert');
    expect(record.beforeJson).toBe('{"status":"draft"}');
    expect(record.afterJson).toBe('{"status":"published"}');
  });

  it('requires reason for manual correction events', () => {
    expect(() => buildAuditEventRecord({
      actorId: 'owner-1',
      actorType: 'user',
      entityId: 'trend-1',
      entityType: 'trend',
      eventType: 'correction',
      source: 'manual',
    })).toThrow(ReasonRequiredError);
  });

  it('normalizes reason text for reason-required events', () => {
    const record = buildAuditEventRecord({
      actorId: 'executive-1',
      actorType: 'user',
      entityId: 'pilot-1',
      entityType: 'pilot',
      eventType: 'decision',
      reason: '  Scale after successful pilot  ',
      source: 'manual',
    });

    expect(record.reason).toBe('Scale after successful pilot');
  });

  it('writes through the provided transaction-scoped writer', async () => {
    const written: AuditEventRecord[] = [];

    await writeAuditEvent({
      create: async ({ data }) => {
        written.push(data);
      },
    }, {
      actorId: 'seed-loader',
      actorType: 'seed',
      entityId: 'pdf-row-1',
      entityType: 'innovation',
      eventType: 'seed',
      source: 'seed',
    });

    expect(written).toHaveLength(1);
    expect(written[0]).toMatchObject({
      actorId: 'seed-loader',
      actorType: 'seed',
      eventType: 'seed',
      source: 'seed',
    });
  });
});
