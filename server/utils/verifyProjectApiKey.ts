import { auth } from '~~/lib/auth'
import type { H3Event } from 'h3'

/**
 * Reads an API key from the request headers (`x-api-key` or `Authorization: Bearer <key>`),
 * verifies it via better-auth, and ensures it is scoped to the given projectId.
 *
 * Throws 401 / 403 on failure.
 */
export async function verifyProjectApiKey(event: H3Event, projectId: string) {
  const apiKeyHeader = getHeader(event, 'x-api-key')
  const authHeader = getHeader(event, 'authorization')
  const rawKey = apiKeyHeader ?? authHeader?.replace(/^Bearer\s+/i, '')

  if (!rawKey) {
    throw createError({
      statusCode: 401,
      message: 'API key required. Send it as x-api-key header or Authorization: Bearer <key>',
    })
  }

  const verification = await auth.api.verifyApiKey({ body: { key: rawKey } })
  if (!verification.valid || !verification.key) {
    throw createError({ statusCode: 401, message: 'Invalid or expired API key' })
  }

  const metadata = verification.key.metadata as Record<string, unknown> | null
  if (metadata?.projectId !== projectId) {
    throw createError({ statusCode: 403, message: 'This API key does not have access to the requested project' })
  }

  return verification.key
}
