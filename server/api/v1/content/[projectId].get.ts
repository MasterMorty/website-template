import db from '~~/lib/db'
import { content } from '~~/lib/db/schema/content'
import { content_type } from '~~/lib/db/schema/content_type'
import { media } from '~~/lib/db/schema/media'
import { aliasedTable, and, eq } from 'drizzle-orm'
import { parseMarkdown } from '@nuxtjs/mdc/runtime'

const coverImage = aliasedTable(media, 'cover_image')

/**
 * Public content API — authenticated via API key in the `Authorization: Bearer <key>` or `x-api-key: <key>` header.
 *
 * GET /api/v1/content/[projectId]
 *   ?type=<content-type-slug>   (optional filter)
 *   ?status=published           (default: published)
 *   ?slug=<slug>                (optional: return single item)
 */
export default defineEventHandler(async (event) => {
  const projectId = getRouterParam(event, 'projectId')
  if (!projectId) throw createError({ statusCode: 400, message: 'Project ID required' })

  await verifyProjectApiKey(event, projectId)

  const query = getQuery(event)
  const typeSlug = query.type as string | undefined
  const status = (query.status as string | undefined) ?? 'published'
  const slug = query.slug as string | undefined

  const conditions = [
    eq(content.project_id, projectId),
    eq(content.status, status),
    ...(slug ? [eq(content.slug, slug)] : []),
  ]

  const rows = await db
    .select({
      id: content.id,
      title: content.title,
      slug: content.slug,
      data: content.data,
      status: content.status,
      published_at: content.published_at,
      created_at: content.created_at,
      updated_at: content.updated_at,
      cover_image_url: coverImage.public_url,
      content_type: {
        id: content_type.id,
        name: content_type.name,
        slug: content_type.slug,
      },
    })
    .from(content)
    .leftJoin(content_type, eq(content.content_type_id, content_type.id))
    .leftJoin(coverImage, eq(content.cover_image_id, coverImage.id))
    .where(
      and(
        ...conditions,
        ...(typeSlug ? [eq(content_type.slug, typeSlug)] : [])
      )
    )
    .orderBy(content.published_at)

  if (slug) {
    if (!rows[0]) throw createError({ statusCode: 404, message: 'Content not found' })
    return rows[0]
  }

  return rows
})
