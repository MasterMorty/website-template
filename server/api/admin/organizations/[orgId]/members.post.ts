import { auth } from '~~/lib/auth';
import db from '~~/lib/db';
import { user } from '~~/lib/db/schema';
import { eq, isNull, and } from 'drizzle-orm';

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

  await db.update(user)
    .set({ org_id: orgId! })
    .where(and(eq(user.id, userId), isNull(user.org_id)));

  return data;
});
