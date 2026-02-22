<script setup lang="ts">
const auth = useAuthStore();
const role = computed(() => auth.user?.role as string | undefined);

const isAdmin = computed(() => role.value === 'admin' || role.value === 'superadmin');
const isSuperadmin = computed(() => role.value === 'superadmin');

const [{ data: hubNav }, { data: rawAdminPages }, { data: rawSuperadminPages }] = await Promise.all([
  useAsyncData("hub-navigation", () => queryCollectionNavigation("hubPages", ["icon"])),
  useAsyncData("hub-admin-pages", () => queryCollection("hubAdminPages").select("title", "path", "icon").all()),
  useAsyncData("hub-superadmin-pages", () => queryCollection("hubSuperadminPages").select("title", "path", "icon").all()),
]);

const route = useRoute();

const baseItems = computed(() =>
  hubNav.value?.[0]?.children?.map((page) => ({
    label: page.title,
    to: page.path as string,
    icon: page.icon as string,
  })) ?? []
);

const adminItems = computed(() =>
  isAdmin.value
    ? (rawAdminPages.value ?? []).map((page) => ({
        label: page.title,
        to: page.path,
        icon: page.icon as string,
      }))
    : []
);

const superadminItems = computed(() =>
  isSuperadmin.value
    ? (rawSuperadminPages.value ?? []).map((page) => ({
        label: page.title,
        to: page.path,
        icon: page.icon as string,
      }))
    : []
);
</script>

<template>
  <NDashboardGroup>
    <template #sidebar>
      <NDashboardSidebar
        id="default"
        collapsible
        class="py-5"
      >
        <template #header="{ collapsed }">
          <HubMenu :collapsed="collapsed" />
        </template>

        <template #default>
          <div class="w-full flex flex-col gap-1">
            <NButton
              v-for="(item, index) in baseItems"
              :key="'base-' + index"
              :label="item.label"
              :to="item.to"
              :active="route.path === item.to"
              collapsible
              size="sm"
              :icon="item.icon"
            />

            <template v-if="adminItems.length">
              <p class="px-2 pt-3 pb-1 text-xs font-semibold text-muted uppercase tracking-wider collapsible-hidden">
                Admin
              </p>
              <NButton
                v-for="(item, index) in adminItems"
                :key="'admin-' + index"
                :label="item.label"
                :to="item.to"
                :active="route.path === item.to"
                collapsible
                size="sm"
                :icon="item.icon"
              />
            </template>

            <template v-if="superadminItems.length">
              <p class="px-2 pt-3 pb-1 text-xs font-semibold text-muted uppercase tracking-wider collapsible-hidden">
                Super Admin
              </p>
              <NButton
                v-for="(item, index) in superadminItems"
                :key="'superadmin-' + index"
                :label="item.label"
                :to="item.to"
                :active="route.path === item.to"
                collapsible
                size="sm"
                :icon="item.icon"
              />
            </template>
          </div>
        </template>
        <template #footer="{ collapse, collapsed}">
          <div class="w-full">
            <NButton
              label="Toggle sidebar"
              size="sm"
              class="w-full"
              collapsible
              :icon="
                collapsed ? 'lucide:panel-left-open' : 'lucide:panel-left-close'
                "
              @click="collapse(!collapsed)"
            />
          </div>
        </template>
      </NDashboardSidebar>
    </template>

    <slot />
  </NDashboardGroup>
</template>
