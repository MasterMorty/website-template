<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

defineProps<{
  collapsed?: boolean;
}>();

const auth = useAuthStore();

async function handleLogout() {
  await auth.signOut();
  navigateTo("/");
}

const teams = ref([
  {
    label: "Nuxt",
    avatar: {
      src: "https://github.com/nuxt.png",
      alt: "Nuxt",
    },
  },
  {
    label: "NuxtHub",
    avatar: {
      src: "https://github.com/nuxt-hub.png",
      alt: "NuxtHub",
    },
  },
  {
    label: "NuxtLabs",
    avatar: {
      src: "https://github.com/nuxtlabs.png",
      alt: "NuxtLabs",
    },
  },
]);
const selectedTeam = ref(teams.value[0]);

const items = computed<DropdownMenuItem[][]>(() => {
  return [
    teams.value.map((team) => ({
      ...team,
      onSelect() {
        selectedTeam.value = team;
      },
    })),
    [
      {
        label: "Profile",
        icon: "i-lucide-user",
        onSelect() {
          navigateTo("/hub/profile");
        },
      },
      {
        label: "Logout",
        icon: "i-lucide-log-out",
        onSelect: handleLogout,
      },
    ],
  ];
});
</script>

<template>
  <NDropdownMenu
    v-model:selected="selectedTeam"
    :items="items"
    class="w-full"
    :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{
      content: collapsed ? 'w-40' : 'w-(--reka-dropdown-menu-trigger-width)',
    }"
  >
    <NButton
      v-bind="{
        ...selectedTeam,
        trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down',
      }"
      class="w-full"
      collapsible
      block
      size="sm"
    />
  </NDropdownMenu>
</template>
