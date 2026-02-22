import db from '~~/lib/db';
import { project } from '~~/lib/db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  await requireRole(event, 'admin');

  const projectId = getRouterParam(event, 'projectId');

  await db.delete(project).where(eq(project.id, projectId!));

  return { success: true };
});
