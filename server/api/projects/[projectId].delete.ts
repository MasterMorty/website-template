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

  if (!projectId) {
    throw createError({
      statusCode: 400,
      message: "Project ID is required",
    });
  }

  await db.delete(project).where(eq(project.id, projectId));

  return { success: true };
});
