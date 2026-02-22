import db from '~~/lib/db'
import { content_type } from '~~/lib/db/schema/content_type'
import { and, eq } from 'drizzle-orm'
import { requireRole } from '~~/server/utils/requireRole'

export default defineEventHandler(async (event) => {
  await requireRole(event, 'admin')

  const projectId = getRouterParam(event, 'projectId')
  const typeId = getRouterParam(event, 'typeId')
  if (!projectId || !typeId) throw createError({ statusCode: 400, message: 'Project ID and Type ID required' })

  const body = await readBody(event)
  const { name, slug, description, schema } = body

  let parsedSchema = schema
  if (typeof schema === 'string') {
    try { parsedSchema = JSON.parse(schema) } catch {
      throw createError({ statusCode: 400, message: 'Invalid JSON in schema field' })
    }
  }

  const updates: Record<string, unknown> = {}
  if (name !== undefined) updates.name = name
  if (slug !== undefined) updates.slug = slug
  if (description !== undefined) updates.description = description || null
  if (schema !== undefined) updates.schema = parsedSchema

  const [row] = await db
    .update(content_type)
    .set(updates)
    .where(and(eq(content_type.id, typeId), eq(content_type.project_id, projectId)))
    .returning()

  if (!row) throw createError({ statusCode: 404, message: 'Content type not found' })
  return row
})
