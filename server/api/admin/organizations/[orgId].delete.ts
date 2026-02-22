import { auth } from '~~/lib/auth';

export default defineEventHandler(async (event) => {
  await requireRole(event, 'admin');

  const orgId = getRouterParam(event, 'orgId');

  await auth.api.deleteOrganization({
    body: { organizationId: orgId! },
    headers: event.headers,
  });

  return { success: true };
});
