import db from '~~/lib/db'
import { content_type } from '~~/lib/db/schema/content_type'
import { and, eq } from 'drizzle-orm'
import { requireRole } from '~~/server/utils/requireRole'

export default defineEventHandler(async (event) => {
  await requireRole(event, 'admin')

  const projectId = getRouterParam(event, 'projectId')
  const typeId = getRouterParam(event, 'typeId')
  if (!projectId || !typeId) throw createError({ statusCode: 400, message: 'Project ID and Type ID required' })

  const [existing] = await db
    .select({ id: content_type.id })
    .from(content_type)
    .where(and(eq(content_type.id, typeId), eq(content_type.project_id, projectId)))

  if (!existing) throw createError({ statusCode: 404, message: 'Content type not found' })

  await db.delete(content_type).where(eq(content_type.id, typeId))

  return { success: true }
})
