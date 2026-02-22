<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import { useQueryClient } from "@tanstack/vue-query";

defineProps<{
  collapsed?: boolean;
}>();

const auth = useAuthStore();
const { activeProjectQuery, projectNamesQuery, projectId } = useActiveProject();
const queryClient = useQueryClient()

async function handleLogout() {
  await auth.signOut();
  navigateTo("/");
}

// ---- Organizations ----
const orgs = ref<{ id: string; name: string; slug: string }[]>([])

if (import.meta.client) {
  authClient.organization.list().then(({ data }) => {
    orgs.value = data ?? []
  })
}

const activeOrgId = computed(
  () => (auth.session?.data?.session as any)?.activeOrganizationId as string | null | undefined,
)

async function switchOrg(orgId: string) {
  await authClient.organization.setActive({ organizationId: orgId })
  // Clear active project so useActiveProject auto-picks the first one for the new org
  projectId.value = ''
  await queryClient.invalidateQueries({ queryKey: ['project-names'] })
  await queryClient.invalidateQueries({ queryKey: ['project'] })
}

const selectedProject = computed(() => {
  if (!activeProjectQuery.data.value?.name) return undefined;
  return {
    label: activeProjectQuery.data.value.name,
  };
});

const items = computed<DropdownMenuItem[][]>(() => {
  const orgItem: DropdownMenuItem | null =
    orgs.value.length > 1
      ? {
          label: 'Organization',
          icon: 'i-lucide-building-2',
          children: orgs.value.map((org) => ({
            label: org.name,
            icon: activeOrgId.value === org.id ? 'i-lucide-check' : undefined,
            onSelect(e: Event) {
              e.preventDefault()
              switchOrg(org.id)
            },
          })),
        }
      : null

  return [
    (projectNamesQuery.data.value ?? []).map((project) => ({
      label: project.name,
      onSelect() {
        projectId.value = project.id
      },
    })),

    [
      ...(orgItem ? [orgItem] : []),
      {
        label: "Profile",
        icon: "i-lucide-user",
        onSelect: () => navigateTo("/hub/profile"),
      },
      {
        label: "Logout",
        icon: "i-lucide-log-out",
        onSelect: handleLogout,
      },
    ],
  ]
})
</script>

<template>
  <NDropdownMenu
    :selected="selectedProject"
    :items="items"
    class="w-full"
    :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{
      content: collapsed ? 'w-40' : 'w-(--reka-dropdown-menu-trigger-width)',
    }"
  >
    <NButton
      v-bind="{
        ...selectedProject,
        trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down',
      }"
      class="w-full"
      collapsible
      block
      size="sm"
    />
  </NDropdownMenu>
</template>
