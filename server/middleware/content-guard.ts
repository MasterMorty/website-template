/**
 * Protects Nuxt Content's internal /_content/ API from being called
 * directly by users who don't have the correct role.
 *
 * Without this, any logged-in user could call:
 *   GET /_content/query?collection=hubAdminPages
 * and read admin-only content directly — bypassing the frontend middleware.
 */
export default defineEventHandler(async (event) => {
  if (!event.path.startsWith('/_content/')) return;

  const user = event.context.user as { role?: string } | null;
  const role = user?.role;

  const isAdmin = role === 'admin' || role === 'superadmin';
  const isSuperadmin = role === 'superadmin';

  const path = event.path;

  if (path.includes('hubAdminPages') || path.includes('hub_admin_pages')) {
    if (!isAdmin) {
      throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
    }
  }

  if (path.includes('hubSuperadminPages') || path.includes('hub_superadmin_pages')) {
    if (!isSuperadmin) {
      throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
    }
  }

  try {
    const raw = await readRawBody(event);
    if (raw) {
      const body = raw.toString();

      if (body.includes('hubAdminPages') || body.includes('hub_admin_pages')) {
        if (!isAdmin) {
          throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
        }
      }

      if (body.includes('hubSuperadminPages') || body.includes('hub_superadmin_pages')) {
        if (!isSuperadmin) {
          throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
        }
      }
    }
  } catch (e) {
    if ((e as any).statusCode === 403) throw e;
  }
});
