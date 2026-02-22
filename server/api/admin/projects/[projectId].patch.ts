import db from '~~/lib/db';
import { project } from '~~/lib/db/schema';
import { eq } from 'drizzle-orm';

export default defineEventHandler(async (event) => {
  await requireRole(event, 'admin');

  const projectId = getRouterParam(event, 'projectId');
  const body = await readBody(event);

  const [updated] = await db
    .update(project)
    .set({
      name: body.name,
      slug: body.slug,
      description: body.description ?? null,
      status: body.status ?? 'active',
      domain: body.domain ?? null,
      git_repo: body.git_repo ?? null,
      updated_at: Date.now(),
    })
    .where(eq(project.id, projectId!))
    .returning();

  return updated;
});
