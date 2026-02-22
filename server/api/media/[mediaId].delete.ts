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
  const { projectId } = await readBody(event)

  if (!projectId || !mediaId) {
    throw createError({
      statusCode: 400,
      message: "Project ID and Media ID are required",
    });
  }

  try {
    const storage = useStorage('r2')
    
    // Get media item to get storage path
    const [mediaItem] = await db
      .select()
      .from(media)
      .where(and(eq(media.id, mediaId), eq(media.project_id, projectId)))
      .limit(1)

    if (!mediaItem) {
      throw createError({
        statusCode: 404,
        message: "Media not found",
      });
    }

    // Delete from R2
    await storage.removeItem(mediaItem.storage_path)

    // Delete from database
    await db
      .delete(media)
      .where(and(eq(media.id, mediaId), eq(media.project_id, projectId)))

    return { success: true }
  } catch (error: any) {
    if (error?.statusCode) throw error;

    console.error("Failed to delete media:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to delete media",
    });
  }
})
