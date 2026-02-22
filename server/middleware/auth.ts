import { auth } from "~~/lib/auth";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers
  });

  event.context.user = session?.user || null;

  const user = session?.user as { role?: string } | undefined;
  const role = user?.role;

  if (event.path.startsWith('/hub') && !session?.user) {
    return sendRedirect(event, '/', 302);
  }

  if (event.path.startsWith('/hub/superadmin') && role !== 'superadmin') {
    return sendRedirect(event, '/hub', 302);
  }

  if (
    event.path.startsWith('/hub/admin') &&
    role !== 'admin' &&
    role !== 'superadmin'
  ) {
    return sendRedirect(event, '/hub', 302);
  }
});