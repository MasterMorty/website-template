import db from '~~/lib/db'
import { media } from '~~/lib/db/schema/media'
import { and, eq, like, sql } from 'drizzle-orm'

/**
 * Public media API — authenticated via API key.
 *
 * GET /api/v1/media/[projectId]
 *   ?tag=<tag>            filter by a single tag (exact match inside JSON array)
 *   ?mime=<type>          filter by MIME type, prefix match  (e.g. "image" or "image/jpeg")
 *   ?name=<search>        search by media name (case-insensitive contains)
 *   ?limit=<n>            max results to return (default 100)
 *   ?offset=<n>           pagination offset (default 0)
 */
export default defineEventHandler(async (event) => {
  const projectId = getRouterParam(event, 'projectId')
  if (!projectId) throw createError({ statusCode: 400, message: 'Project ID required' })

  await verifyProjectApiKey(event, projectId)

  const query = getQuery(event)
  const tag = query.tag as string | undefined
  const mime = query.mime as string | undefined
  const name = query.name as string | undefined
  const limit = Math.min(Number(query.limit ?? 100), 500)
  const offset = Number(query.offset ?? 0)

  const conditions = [
    eq(media.project_id, projectId),
    ...(tag
      ? [sql`EXISTS (SELECT 1 FROM json_each(${media.tags}) WHERE value = ${tag})`]
      : []),
    ...(mime
      ? [like(media.mime_type, `${mime}%`)]
      : []),
    ...(name
      ? [like(media.name, `%${name}%`)]
      : []),
  ]

  const rows = await db
    .select({
      id: media.id,
      name: media.name,
      file_name: media.file_name,
      mime_type: media.mime_type,
      file_size: media.file_size,
      public_url: media.public_url,
      width: media.width,
      height: media.height,
      tags: media.tags,
      alt_text: media.alt_text,
      created_at: media.created_at,
    })
    .from(media)
    .where(and(...conditions))
    .orderBy(media.created_at)
    .limit(limit)
    .offset(offset)

  return rows
})
