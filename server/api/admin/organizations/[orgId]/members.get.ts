import db from '~~/lib/db';
import { member, user } from '~~/lib/db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  await requireRole(event, 'admin');

  const orgId = getRouterParam(event, 'orgId');

  const members = await db
    .select({
      memberId: member.id,
      memberRole: member.role,
      memberCreatedAt: member.createdAt,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      userImage: user.image,
      userBanned: user.banned,
    })
    .from(member)
    .innerJoin(user, eq(user.id, member.userId))
    .where(eq(member.organizationId, orgId!))
    .orderBy(member.createdAt);

  return members;
});
