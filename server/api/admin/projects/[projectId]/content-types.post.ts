import db from '~~/lib/db'
import { content_type } from '~~/lib/db/schema/content_type'
import { requireRole } from '~~/server/utils/requireRole'

export default defineEventHandler(async (event) => {
  await requireRole(event, 'admin')

  const projectId = getRouterParam(event, 'projectId')
  if (!projectId) throw createError({ statusCode: 400, message: 'Project ID required' })

  const body = await readBody(event)
  const { name, slug, description, schema } = body

  if (!name || !slug) throw createError({ statusCode: 400, message: 'Name and slug are required' })

  let parsedSchema = schema
  if (typeof schema === 'string') {
    try { parsedSchema = JSON.parse(schema) } catch {
      throw createError({ statusCode: 400, message: 'Invalid JSON in schema field' })
    }
  }

  const [row] = await db
    .insert(content_type)
    .values({ project_id: projectId, name, slug, description: description || null, schema: parsedSchema ?? {} })
    .returning()

  return row
})
