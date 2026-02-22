import { auth } from '~~/lib/auth';

export default defineEventHandler(async (event) => {
  await requireRole(event, 'admin');

  const body = await readBody(event);
  const { name, slug } = body;

  if (!name || !slug) {
    throw createError({ statusCode: 400, statusMessage: 'name and slug are required' });
  }

  const currentUser = event.context.user as { id: string };

  const data = await auth.api.createOrganization({
    body: {
      name,
      slug,
      userId: currentUser.id,
    },
  });

  return data;
});
