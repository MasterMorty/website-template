import { auth } from '~~/lib/auth';

export default defineEventHandler(async (event) => {
  await requireRole(event, 'admin');

  const orgId = getRouterParam(event, 'orgId');
  const body = await readBody(event);
  const { userId, role = 'member' } = body;

  if (!userId) {
    throw createError({ statusCode: 400, statusMessage: 'userId is required' });
  }

  const data = await auth.api.addMember({
    body: {
      userId,
      organizationId: orgId,
      role,
    },
  });

  return data;
});
