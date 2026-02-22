import type { H3Event } from 'h3';

type Role = 'user' | 'viewer' | 'admin' | 'superadmin';

const ROLE_HIERARCHY: Role[] = ['viewer', 'user', 'admin', 'superadmin'];

export async function requireRole(event: H3Event, minimumRole: Role): Promise<void> {
  const user = event.context.user as { role?: string } | null;

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' });
  }

  const userRoleIndex = ROLE_HIERARCHY.indexOf((user.role ?? 'viewer') as Role);
  const requiredRoleIndex = ROLE_HIERARCHY.indexOf(minimumRole);

  if (userRoleIndex < requiredRoleIndex) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
  }
}
