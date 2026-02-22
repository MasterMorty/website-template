import { auth } from "~~/lib/auth";
import db from "~~/lib/db";
import { eq, and, sql } from "drizzle-orm";
import { media } from "~~/lib/db/schema";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });
  const user = session?.user;

  if (!user?.org_id && !user) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const projectId = getRouterParam(event, "id");

  if (!projectId) {
    throw createError({
      statusCode: 400,
      message: "Project ID is required",
    });
  }

  try {
    const query = getQuery(event);
    const tagsParam = query.tags as string | string[] | undefined;

    // Convert to array if single string
    const tags = Array.isArray(tagsParam) ? tagsParam : tagsParam ? [tagsParam] : [];

    if (tags.length === 0) {
      throw createError({
        statusCode: 400,
        message: "At least one tag is required",
      });
    }

    // Query media where tags array contains any of the requested tags
    const mediaItems = await db
      .select()
      .from(media)
      .where(
        and(
          eq(media.project_id, projectId),
          // Check if the tags JSON array contains any of the requested tags
          sql`EXISTS (
            SELECT 1 FROM json_each(${media.tags}) 
            WHERE json_each.value IN (${sql.join(tags.map(tag => sql`${tag}`), sql`, `)})
          )`
        )
      )
      .orderBy(media.created_at);

    return mediaItems;
  } catch (error: any) {
    if (error?.statusCode) throw error;

    console.error("Failed to fetch media by tags:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch media by tags",
    });
  }
});
