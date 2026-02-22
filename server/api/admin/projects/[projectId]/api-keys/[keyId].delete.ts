import db from '~~/lib/db'
import { apikey } from '~~/lib/db/schema/auth'
import { and, eq, sql } from 'drizzle-orm'
import { auth } from '~~/lib/auth'
import { requireRole } from '~~/server/utils/requireRole'

export default defineEventHandler(async (event) => {
  await requireRole(event, 'admin')

  const projectId = getRouterParam(event, 'projectId')
  const keyId = getRouterParam(event, 'keyId')
  if (!projectId || !keyId) throw createError({ statusCode: 400, message: 'Project ID and Key ID required' })

  // Verify key belongs to this project before deleting
  const [existing] = await db
    .select({ id: apikey.id })
    .from(apikey)
    .where(
      and(
        eq(apikey.id, keyId),
        sql`json_extract(${apikey.metadata}, '$.projectId') = ${projectId}`
      )
    )

  if (!existing) throw createError({ statusCode: 404, message: 'API key not found' })

  const result = await auth.api.deleteApiKey({
    body: { keyId },
    headers: event.headers,
  })

  return result
})
