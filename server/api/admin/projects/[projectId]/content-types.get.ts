import db from '~~/lib/db'
import { content_type } from '~~/lib/db/schema/content_type'
import { eq } from 'drizzle-orm'
import { requireRole } from '~~/server/utils/requireRole'

export default defineEventHandler(async (event) => {
  await requireRole(event, 'admin')

  const projectId = getRouterParam(event, 'projectId')
  if (!projectId) throw createError({ statusCode: 400, message: 'Project ID required' })

  return db
    .select()
    .from(content_type)
    .where(eq(content_type.project_id, projectId))
    .orderBy(content_type.created_at)
})
