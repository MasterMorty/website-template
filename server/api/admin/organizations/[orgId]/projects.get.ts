import db from '~~/lib/db';
import { project } from '~~/lib/db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  await requireRole(event, 'admin');

  const orgId = getRouterParam(event, 'orgId');

  const projects = await db
    .select()
    .from(project)
    .where(eq(project.org_id, orgId!))
    .orderBy(project.created_at);

  return projects;
});
