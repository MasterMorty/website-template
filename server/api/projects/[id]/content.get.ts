import { auth } from "~~/lib/auth";
import db from "~~/lib/db";
import { eq } from "drizzle-orm";
import { content, media, content_type } from "~~/lib/db/schema";



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

  const contents = await db
    .select({
      id: content.id,
      project_id: content.project_id,
      content_type_id: content.content_type_id,
      title: content.title,
      slug: content.slug,
      data: content.data,
      status: content.status,
      cover_image_id: content.cover_image_id,
      created_by_id: content.created_by_id,
      updated_by_id: content.updated_by_id,
      published_at: content.published_at,
      created_at: content.created_at,
      updated_at: content.updated_at,
      content_type: {
        id: content_type.id,
        name: content_type.name,
        slug: content_type.slug,
        description: content_type.description,
      },
      cover_image: {
        id: media.id,
        name: media.name,
        public_url: media.public_url,
        width: media.width,
        height: media.height,
        alt_text: media.alt_text,
      }
    })
    .from(content)
    .leftJoin(content_type, eq(content.content_type_id, content_type.id))
    .leftJoin(media, eq(content.cover_image_id, media.id))
    .where(eq(content.project_id, projectId))

  return contents
  } catch (error: any) {
    if (error?.statusCode) throw error;

    console.error("Failed to fetch content:", error);
    throw createError({
      statusCode: 500,
      message: "Failed to fetch content",
    });
  }
})