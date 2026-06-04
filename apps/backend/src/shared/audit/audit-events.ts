export const auditEventTypes = [
  'create',
  'update',
  'delete',
  'status_change',
  'review',
  'publish',
  'import',
  'seed',
  'correction',
  'decision',
  'admin_override',
] as const;

export type AuditEventType = typeof auditEventTypes[number];
export type AuditActorType = 'user' | 'system' | 'import' | 'seed';
export type AuditSource = 'manual' | 'import' | 'seed' | 'system' | 'admin';

export type AuditEventInput = {
  eventType: AuditEventType;
  entityType: string;
  entityId: string;
  entityVersionBefore?: number;
  entityVersionAfter?: number;
  actorId: string;
  actorType: AuditActorType;
  actorRole?: string;
  actorScope?: unknown;
  source: AuditSource;
  reason?: string;
  before?: unknown;
  after?: unknown;
  changedFields?: string[];
  correlationId?: string;
};

export type AuditEventRecord = {
  eventType: AuditEventType;
  entityType: string;
  entityId: string;
  entityVersionBefore: number | null;
  entityVersionAfter: number | null;
  actorId: string;
  actorType: AuditActorType;
  actorRole: string | null;
  actorScopeJson: string | null;
  source: AuditSource;
  reason: string | null;
  beforeJson: string | null;
  afterJson: string | null;
  changedFieldsJson: string | null;
  correlationId: string | null;
};

export type AuditEventWriter = {
  create(args: { data: AuditEventRecord }): Promise<unknown>;
};

export function actorRoleForAudit(input: { roles: Array<{ active: boolean; role: string }> }, preferredRole?: string): string | undefined {
  if (preferredRole && input.roles.some((role) => role.active && role.role === preferredRole)) {
    return preferredRole;
  }

  return input.roles.find((role) => role.active)?.role;
}

const reasonRequiredEventTypes = new Set<AuditEventType>([
  'admin_override',
  'correction',
  'decision',
  'delete',
  'status_change',
]);

function toJsonText(value: unknown): string | null {
  return value === undefined ? null : JSON.stringify(value);
}

function normalizeReason(reason: string | undefined): string | null {
  const normalized = reason?.trim();
  return normalized ? normalized : null;
}

export class ReasonRequiredError extends Error {
  statusCode = 400;

  constructor(eventType: AuditEventType) {
    super(`Reason is required for audit event type: ${eventType}`);
    this.name = 'ReasonRequiredError';
  }
}

export function assertReasonAllowed(input: Pick<AuditEventInput, 'eventType' | 'reason'>): void {
  if (reasonRequiredEventTypes.has(input.eventType) && !normalizeReason(input.reason)) {
    throw new ReasonRequiredError(input.eventType);
  }
}

export function buildAuditEventRecord(input: AuditEventInput): AuditEventRecord {
  assertReasonAllowed(input);

  return {
    eventType: input.eventType,
    entityType: input.entityType,
    entityId: input.entityId,
    entityVersionBefore: input.entityVersionBefore ?? null,
    entityVersionAfter: input.entityVersionAfter ?? null,
    actorId: input.actorId,
    actorType: input.actorType,
    actorRole: input.actorRole ?? null,
    actorScopeJson: toJsonText(input.actorScope),
    source: input.source,
    reason: normalizeReason(input.reason),
    beforeJson: toJsonText(input.before),
    afterJson: toJsonText(input.after),
    changedFieldsJson: toJsonText(input.changedFields),
    correlationId: input.correlationId ?? null,
  };
}

export async function writeAuditEvent(writer: AuditEventWriter, input: AuditEventInput): Promise<void> {
  await writer.create({
    data: buildAuditEventRecord(input),
  });
}
