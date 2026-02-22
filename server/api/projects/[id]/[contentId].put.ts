import { auth } from "~~/lib/auth"
import db from "~~/lib/db"
import { and, eq } from "drizzle-orm"
import { content } from "~~/lib/db/schema"

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers })
  const user = session?.user

  if (!user?.org_id || !user) {
    throw createError({ statusCode: 401, message: "Unauthorized" })
  }

  const projectId = getRouterParam(event, "id")
  const contentId = getRouterParam(event, "contentId")

  if (!projectId || !contentId) {
    throw createError({
      statusCode: 400,
      message: "Project ID and content ID are required",
    })
  }

  const body = await readBody(event)

  try {
    const [updated] = await db
      .update(content)
      .set({
        title: body.title,
        slug: body.slug,
        data: body.data ?? {},
        status: body.status,
        updated_by_id: user.id,
      })
      .where(
        and(
          eq(content.id, contentId),
          eq(content.project_id, projectId)
        )
      )
      .returning()

    if (!updated) {
      throw createError({
        statusCode: 404,
        message: "Content not found",
      })
    }

    return updated
  } catch (error: any) {
    if (error?.statusCode) throw error

    console.error("Failed to update content:", error)

    throw createError({
      statusCode: 500,
      message: "Failed to update content",
    })
  }
})