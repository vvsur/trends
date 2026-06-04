import type { AppPrismaClient } from '../../shared/database/prisma-client.js';
import type { Actor } from '../../shared/rbac/policies.js';
import { actorRoleForAudit, writeAuditEvent } from '../../shared/audit/audit-events.js';
import { dictionaryConfigs, type DictionaryName } from './dictionaries.js';

export type ReferenceDataItem = {
  id: string;
  code: string;
  name: string;
  description: string;
  active: boolean;
  sortOrder: number;
  visibleInMvp?: boolean;
};

export type ReferenceDataInput = {
  code: string;
  name: string;
  description: string;
  active?: boolean;
  sortOrder: number;
  visibleInMvp?: boolean;
};

type RawReferenceDataRow = {
  active: number | boolean;
  code: string;
  description: string;
  id: string;
  name: string;
  sort_order: number;
  visible_in_mvp?: number | boolean | null;
};

function mapRow(row: RawReferenceDataRow): ReferenceDataItem {
  return {
    active: Boolean(row.active),
    code: row.code,
    description: row.description,
    id: row.id,
    name: row.name,
    sortOrder: row.sort_order,
    ...(row.visible_in_mvp === undefined ? {} : { visibleInMvp: Boolean(row.visible_in_mvp) }),
  };
}

function validateInput(input: ReferenceDataInput): void {
  if (!input.code.trim()) {
    throw new ReferenceDataValidationError('Reference data code is required.');
  }

  if (!input.name.trim()) {
    throw new ReferenceDataValidationError('Reference data name is required.');
  }

  if (!input.description.trim()) {
    throw new ReferenceDataValidationError('Reference data description is required.');
  }
}

export async function listReferenceData(prisma: AppPrismaClient, dictionary: DictionaryName): Promise<ReferenceDataItem[]> {
  const config = dictionaryConfigs[dictionary];
  const visibleColumn = config.supportsVisibleInMvp ? ', visible_in_mvp' : '';
  const rows = await prisma.$queryRawUnsafe<RawReferenceDataRow[]>(
    `SELECT id, code, name, description, active, sort_order${visibleColumn} FROM ${config.table} ORDER BY sort_order ASC, code ASC`,
  );

  return rows.map(mapRow);
}

export async function createReferenceData(
  prisma: AppPrismaClient,
  dictionary: DictionaryName,
  input: ReferenceDataInput,
  actor: Actor,
): Promise<ReferenceDataItem> {
  validateInput(input);

  const config = dictionaryConfigs[dictionary];
  const id = `${dictionary}-${input.code.trim().toLowerCase().replaceAll('_', '-').replaceAll(' ', '-')}`;
  const active = input.active ?? true;
  const visibleInMvp = input.visibleInMvp ?? false;

  return prisma.$transaction(async (tx) => {
    if (config.supportsVisibleInMvp) {
      await tx.$executeRawUnsafe(
        `INSERT INTO ${config.table} (id, code, name, description, active, visible_in_mvp, sort_order, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        id,
        input.code,
        input.name,
        input.description,
        active,
        visibleInMvp,
        input.sortOrder,
      );
    } else {
      await tx.$executeRawUnsafe(
        `INSERT INTO ${config.table} (id, code, name, description, active, sort_order, updated_at) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
        id,
        input.code,
        input.name,
        input.description,
        active,
        input.sortOrder,
      );
    }

    const [created] = await listReferenceData(tx as AppPrismaClient, dictionary).then((items) => items.filter((item) => item.id === id));

    if (!created) {
      throw new Error('Created reference data item was not found.');
    }

    const auditRole = actorRoleForAudit(actor, 'admin');

    await writeAuditEvent(tx.auditEvent, {
      actorId: actor.userId,
      actorType: 'user',
      after: created,
      changedFields: Object.keys(created),
      entityId: id,
      entityType: config.entityType,
      entityVersionAfter: 1,
      eventType: 'create',
      source: 'manual',
      ...(auditRole ? { actorRole: auditRole } : {}),
    });

    return created;
  });
}

export async function updateReferenceData(
  prisma: AppPrismaClient,
  dictionary: DictionaryName,
  id: string,
  input: Partial<ReferenceDataInput>,
  actor: Actor,
  reason: string,
): Promise<ReferenceDataItem> {
  const config = dictionaryConfigs[dictionary];

  return prisma.$transaction(async (tx) => {
    const [before] = await listReferenceData(tx as AppPrismaClient, dictionary).then((items) => items.filter((item) => item.id === id));

    if (!before) {
      throw new ReferenceDataNotFoundError();
    }

    const visibleInMvp = input.visibleInMvp ?? before.visibleInMvp;
    const updatedInput: ReferenceDataInput = {
      active: input.active ?? before.active,
      code: input.code ?? before.code,
      description: input.description ?? before.description,
      name: input.name ?? before.name,
      sortOrder: input.sortOrder ?? before.sortOrder,
      ...(visibleInMvp === undefined ? {} : { visibleInMvp }),
    };

    validateInput(updatedInput);

    if (config.supportsVisibleInMvp) {
      await tx.$executeRawUnsafe(
        `UPDATE ${config.table} SET code = ?, name = ?, description = ?, active = ?, visible_in_mvp = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        updatedInput.code,
        updatedInput.name,
        updatedInput.description,
        updatedInput.active,
        updatedInput.visibleInMvp ?? false,
        updatedInput.sortOrder,
        id,
      );
    } else {
      await tx.$executeRawUnsafe(
        `UPDATE ${config.table} SET code = ?, name = ?, description = ?, active = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        updatedInput.code,
        updatedInput.name,
        updatedInput.description,
        updatedInput.active,
        updatedInput.sortOrder,
        id,
      );
    }

    const [after] = await listReferenceData(tx as AppPrismaClient, dictionary).then((items) => items.filter((item) => item.id === id));

    if (!after) {
      throw new ReferenceDataNotFoundError();
    }

    const auditRole = actorRoleForAudit(actor, 'admin');

    await writeAuditEvent(tx.auditEvent, {
      actorId: actor.userId,
      actorType: 'user',
      before,
      after,
      changedFields: Object.keys(input),
      entityId: id,
      entityType: config.entityType,
      eventType: 'correction',
      reason,
      source: 'manual',
      ...(auditRole ? { actorRole: auditRole } : {}),
    });

    return after;
  });
}

export async function deactivateReferenceData(
  prisma: AppPrismaClient,
  dictionary: DictionaryName,
  id: string,
  actor: Actor,
  reason: string,
): Promise<ReferenceDataItem> {
  return updateReferenceData(prisma, dictionary, id, { active: false }, actor, reason);
}

export class ReferenceDataNotFoundError extends Error {
  statusCode = 404;

  constructor() {
    super('Reference data item not found.');
    this.name = 'ReferenceDataNotFoundError';
  }
}

export class ReferenceDataValidationError extends Error {
  statusCode = 400;

  constructor(message: string) {
    super(message);
    this.name = 'ReferenceDataValidationError';
  }
}
