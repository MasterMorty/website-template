import { auth } from "~~/lib/auth";
import db from "~~/lib/db";
import { eq, and } from "drizzle-orm";
import { media } from "~~/lib/db/schema";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });
  const user = session?.user;

  if (!user?.org_id && !user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' });
  }

  const mediaId = getRouterParam(event, "mediaId")
  const { projectId, tags, altText, name } = await readBody(event)

  if (!projectId || !mediaId) {
    throw createError({
      statusCode: 400,
      message: "Project ID and Media ID are required",
    });
  }

  try {
    const updateData: any = {}
    
    if (tags !== undefined) {
      updateData.tags = tags
    }
    
    if (altText !== undefined) {
      updateData.alt_text = altText
    }
    
    if (name !== undefined) {
      updateData.name = name
    }

    const [updated] = await db
      .update(media)
      .set(updateData)
      .where(and(eq(media.id, mediaId), eq(media.project_id, projectId)))
      .returning()

    if (!updated) {
      throw createError({
        statusCode: 404,
        message: "Media not found",
      });
    }

    return updated
  } catch (error: any) {
    if (error?.statusCode) throw error;

    console.error("Failed to update media:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to update media",
    });
  }
})
