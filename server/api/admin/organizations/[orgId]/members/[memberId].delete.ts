import { auth } from '~~/lib/auth';

export default defineEventHandler(async (event) => {
  await requireRole(event, 'admin');

  const orgId = getRouterParam(event, 'orgId')!;
  const memberId = getRouterParam(event, 'memberId')!;

  await auth.api.removeMember({
    body: {
      memberIdOrEmail: memberId,
      organizationId: orgId,
    },
    headers: event.headers,
  });

  return { success: true };
});
