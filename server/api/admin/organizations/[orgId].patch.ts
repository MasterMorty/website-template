import { auth } from '~~/lib/auth';

export default defineEventHandler(async (event) => {
  await requireRole(event, 'admin');

  const orgId = getRouterParam(event, 'orgId');
  const body = await readBody(event);
  const { name, slug } = body;

  const data = await auth.api.updateOrganization({
    body: {
      organizationId: orgId,
      data: { name, slug },
    },
    headers: event.headers,
  });

  return data;
});
