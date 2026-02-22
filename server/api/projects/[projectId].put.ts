import db from "~~/lib/db";
import { auth } from "~~/lib/auth";
import { project } from "~~/lib/db/schema";
import { eq } from "drizzle-orm";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });
  const user = session?.user;

  if (!user?.org_id && !user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' });
  }

  const projectId = getRouterParam(event, "projectId");
  const body = await readBody(event);

  if (!projectId) {
    throw createError({
      statusCode: 400,
      message: "Project ID is required",
    });
  }

  const updated = await db
    .update(project)
    .set({
      name: body.name,
      slug: body.slug,
      description: body.description,
      status: body.status,
      updated_at: Date.now(),
    })
    .where(eq(project.id, projectId))
    .returning();

  return updated[0];
});
