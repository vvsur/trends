import type { FastifyRequest } from 'fastify';
import type { Actor, Role, ScopeType } from '../rbac/policies.js';
import { roles } from '../rbac/policies.js';

export const actorEmailHeader = 'x-trends-actor-email';

export type CurrentActorRoleAssignmentRecord = {
  active: boolean;
  role: string;
  scopeId: string | null;
  scopeType: string | null;
};

export type CurrentActorUserRecord = {
  id: string;
  status: string;
  roleAssignments: CurrentActorRoleAssignmentRecord[];
};

export type CurrentActorRepository = {
  findUserByEmail(email: string): Promise<CurrentActorUserRecord | null>;
};

function normalizeEmail(value: string | string[] | undefined): string | undefined {
  const email = Array.isArray(value) ? value[0] : value;
  const normalized = email?.trim().toLowerCase();
  return normalized ? normalized : undefined;
}

function isRole(value: string): value is Role {
  return roles.includes(value as Role);
}

function isScopeType(value: string | null): value is ScopeType {
  return value === 'global' || value === 'domain' || value === 'department' || value === 'entity';
}

export function readActorEmail(request: FastifyRequest): string | undefined {
  return normalizeEmail(request.headers[actorEmailHeader]);
}

export async function resolveCurrentActor(
  request: FastifyRequest,
  repository: CurrentActorRepository,
): Promise<Actor | undefined> {
  const email = readActorEmail(request);

  if (!email) {
    return undefined;
  }

  const user = await repository.findUserByEmail(email);

  if (!user || user.status !== 'active') {
    return undefined;
  }

  const actorRoles = user.roleAssignments
    .filter((assignment) => isRole(assignment.role))
    .map((assignment) => ({
      active: assignment.active,
      role: assignment.role as Role,
      ...(isScopeType(assignment.scopeType) ? { scopeType: assignment.scopeType } : {}),
      ...(assignment.scopeId ? { scopeId: assignment.scopeId } : {}),
    }));

  return {
    roles: actorRoles,
    userId: user.id,
  };
}

export function createCurrentActorRepository(prisma: {
  user: {
    findUnique(args: {
      include: { roleAssignments: true };
      where: { email: string };
    }): Promise<CurrentActorUserRecord | null>;
  };
}): CurrentActorRepository {
  return {
    async findUserByEmail(email) {
      return prisma.user.findUnique({
        include: { roleAssignments: true },
        where: { email },
      });
    },
  };
}
