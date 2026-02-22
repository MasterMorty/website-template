import db from '~~/lib/db'
import { apikey } from '~~/lib/db/schema/auth'
import { sql } from 'drizzle-orm'
import { requireRole } from '~~/server/utils/requireRole'

export default defineEventHandler(async (event) => {
  await requireRole(event, 'admin')

  const projectId = getRouterParam(event, 'projectId')
  if (!projectId) throw createError({ statusCode: 400, message: 'Project ID required' })

  const keys = await db
    .select({
      id: apikey.id,
      name: apikey.name,
      start: apikey.start,
      prefix: apikey.prefix,
      enabled: apikey.enabled,
      expiresAt: apikey.expiresAt,
      createdAt: apikey.createdAt,
      lastRequest: apikey.lastRequest,
      requestCount: apikey.requestCount,
      metadata: apikey.metadata,
    })
    .from(apikey)
    .where(
      sql`json_extract(${apikey.metadata}, '$.projectId') = ${projectId}`
    )

  return keys
})
