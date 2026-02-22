/**
 * Handles CORS preflight (OPTIONS) requests for the public v1 API.
 * Must return before the route handler runs, otherwise verifyProjectApiKey
 * throws 401 (no key on a preflight) which browsers reject as "not ok status".
 */
export default defineEventHandler((event) => {
  if (!event.path.startsWith('/api/v1/')) return

  if (event.node.req.method === 'OPTIONS') {
    setResponseStatus(event, 204)
    return ''
  }
})
