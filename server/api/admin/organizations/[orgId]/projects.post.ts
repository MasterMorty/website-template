import db from '~~/lib/db';
import { project } from '~~/lib/db/schema';
import { uuidv7 } from 'uuidv7';

export default defineEventHandler(async (event) => {
  await requireRole(event, 'admin');

  const orgId = getRouterParam(event, 'orgId');
  const body = await readBody(event);
  const { name, slug, description, domain, git_repo } = body;

  if (!name || !slug) {
    throw createError({ statusCode: 400, statusMessage: 'name and slug are required' });
  }

  const currentUser = event.context.user as { id: string };

  const [created] = await db
    .insert(project)
    .values({
      id: uuidv7(),
      org_id: orgId!,
      name,
      slug,
      description: description || null,
      domain: domain || null,
      git_repo: git_repo || null,
      created_by_id: currentUser.id,
      created_at: Date.now(),
      updated_at: Date.now(),
    })
    .returning();

  return created;
});
