export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return;

  const auth = useAuthStore();
  const role = auth.user?.role as string | undefined;

  if (auth.loading) {
    return;
  }

  if (to.path.startsWith('/hub/superadmin')) {
    if (role !== 'superadmin') {
      return navigateTo('/hub');
    }
  }

  if (to.path.startsWith('/hub/admin')) {
    if (role !== 'admin' && role !== 'superadmin') {
      return navigateTo('/hub');
    }
  }
});

