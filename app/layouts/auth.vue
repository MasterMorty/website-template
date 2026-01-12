<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const { data: hubPages } = await useAsyncData("hub-navigation", () => {
  return queryCollectionNavigation("hubPages", ["icon"]);
});

const route = useRoute();

const items = computed<NavigationMenuItem[]>(() => {
  if (!hubPages.value) return [];
  return (
    hubPages.value[0]?.children?.map((page) => ({
      label: page.title,
      to: page.path as string,
      icon: page.icon as string,
      active: route.path === page.path,
    })) ?? []
  );
});
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
              v-for="(item, index) in items"
              :key="index"
              :label="item.label"
              :to="item.to"
              :active="route.path === item.to"
              collapsible
              size="sm"
              :icon="item.icon"
            />
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
