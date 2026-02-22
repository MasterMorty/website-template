import db from '~~/lib/db'
import { content } from '~~/lib/db/schema'
import { auth } from '~~/lib/auth'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers })
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized'
    })
  }

  const contentId = getRouterParam(event, 'contentId')
  const { coverImageId } = await readBody(event)

  if (!contentId) {
    throw createError({
      statusCode: 400,
      message: 'Content ID is required'
    })
  }

  const [updated] = await db
    .update(content)
    .set({
      cover_image_id: coverImageId,
      updated_at: Date.now(),
      updated_by_id: session.user.id
    })
    .where(eq(content.id, contentId))
    .returning()

  return updated
})
