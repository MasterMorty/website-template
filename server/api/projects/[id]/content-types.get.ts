import { auth } from "~~/lib/auth";
import db from "~~/lib/db";
import { eq } from "drizzle-orm";
import { content_type } from "~~/lib/db/schema";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });
  const user = session?.user;

  if (!user?.org_id && !user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' });
  }

  const projectId = getRouterParam(event, "id")

  if (!projectId) {
    throw createError({
      statusCode: 400,
      message: "Project ID is required",
    });
  }

  try {
    const contentTypes = await db
      .select()
      .from(content_type)
      .where(eq(content_type.project_id, projectId))

    return contentTypes
  } catch (error: any) {
    if (error?.statusCode) throw error;

    console.error("Failed to fetch content types:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch content types",
    });
  }
})
