import { auth } from '~~/lib/auth'
import { requireRole } from '~~/server/utils/requireRole'

export default defineEventHandler(async (event) => {
  await requireRole(event, 'admin')

  const projectId = getRouterParam(event, 'projectId')
  if (!projectId) throw createError({ statusCode: 400, message: 'Project ID required' })

  const userId = (event.context.user as { id: string }).id

  const body = await readBody(event)
  const name: string = body.name || `API Key for ${projectId}`
  const expiresIn: number | undefined = body.expiresIn // seconds

  const data = await auth.api.createApiKey({
    body: {
      name,
      prefix: 'nfx_',
      userId,
      ...(expiresIn ? { expiresIn } : {}),
      metadata: { projectId },
    },
  })

  return data
})
