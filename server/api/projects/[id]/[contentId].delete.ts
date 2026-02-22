import { auth } from "~~/lib/auth"
import db from "~~/lib/db"
import { eq } from "drizzle-orm"
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

  try {
    await db
    .delete(content)
    .where(eq(content.id, contentId))
    return { success: true }
  } catch (error: any) {
    if (error?.statusCode) throw error

    console.error("Failed to delete content:", error)

    throw createError({
      statusCode: 500,
      message: "Failed to delete content",
    })
  }
})