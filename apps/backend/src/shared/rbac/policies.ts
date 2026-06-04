export const roles = ['employee', 'trend_owner', 'expert', 'executive', 'admin'] as const;

export type Role = typeof roles[number];
export type ScopeType = 'global' | 'domain' | 'department' | 'entity';

export const capabilities = [
  'view_published',
  'view_own_idea_status',
  'create_idea_proposal',
  'edit_own_draft_idea',
  'create_edit_trend',
  'publish_trend',
  'create_edit_hypothesis',
  'score_innovation',
  'add_expert_comment_or_constraint',
  'create_edit_pilot',
  'record_management_decision',
  'view_kpi_dashboard',
  'manage_reference_data',
  'manage_sources',
  'manage_users_roles',
  'manual_correction',
] as const;

export type Capability = typeof capabilities[number];

export type RoleAssignment = {
  role: Role;
  active: boolean;
  scopeType?: ScopeType;
  scopeId?: string;
};

export type Actor = {
  userId: string;
  roles: RoleAssignment[];
};

export type ResourceScope = {
  authorId?: string;
  ownerId?: string;
  domainId?: string;
  departmentId?: string;
  entityType?: string;
  entityId?: string;
};

const roleCapabilities: Record<Role, ReadonlySet<Capability>> = {
  employee: new Set([
    'view_published',
    'view_own_idea_status',
    'create_idea_proposal',
    'edit_own_draft_idea',
  ]),
  trend_owner: new Set([
    'view_published',
    'view_own_idea_status',
    'create_idea_proposal',
    'edit_own_draft_idea',
    'create_edit_trend',
    'publish_trend',
    'create_edit_hypothesis',
    'create_edit_pilot',
    'manual_correction',
  ]),
  expert: new Set([
    'view_published',
    'view_own_idea_status',
    'create_idea_proposal',
    'score_innovation',
    'add_expert_comment_or_constraint',
    'create_edit_hypothesis',
    'publish_trend',
    'manual_correction',
  ]),
  executive: new Set([
    'view_published',
    'view_own_idea_status',
    'create_idea_proposal',
    'record_management_decision',
    'view_kpi_dashboard',
    'manual_correction',
  ]),
  admin: new Set(capabilities),
};

function isOwnResource(actor: Actor, resource?: ResourceScope): boolean {
  return resource?.authorId === actor.userId || resource?.ownerId === actor.userId;
}

function matchesScope(assignment: RoleAssignment, resource?: ResourceScope): boolean {
  if (!assignment.scopeType || assignment.scopeType === 'global') {
    return true;
  }

  if (!assignment.scopeId || !resource) {
    return false;
  }

  if (assignment.scopeType === 'domain') {
    return assignment.scopeId === resource.domainId;
  }

  if (assignment.scopeType === 'department') {
    return assignment.scopeId === resource.departmentId;
  }

  return assignment.scopeId === resource.entityId;
}

export function can(actor: Actor, capability: Capability, resource?: ResourceScope): boolean {
  return actor.roles.some((assignment) => {
    if (!assignment.active || !roleCapabilities[assignment.role].has(capability)) {
      return false;
    }

    if (assignment.role === 'employee' && ['view_own_idea_status', 'edit_own_draft_idea'].includes(capability)) {
      return isOwnResource(actor, resource);
    }

    return matchesScope(assignment, resource);
  });
}

export function requireCapability(actor: Actor, capability: Capability, resource?: ResourceScope): void {
  if (!can(actor, capability, resource)) {
    throw new PermissionDeniedError(capability);
  }
}

export class PermissionDeniedError extends Error {
  statusCode = 403;

  constructor(capability: Capability) {
    super(`Required capability is missing: ${capability}`);
    this.name = 'PermissionDeniedError';
  }
}
