<script setup lang="ts">
const user = computed(() => useAuthStore().user);

async function handleLogout() {
  await useAuthStore().signOut();
  navigateTo("/");
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="border-b">
      <div
        class="container mx-auto px-4 py-4 flex items-center justify-between"
      >
        <div class="flex items-center gap-4">
          <NuxtLink to="/hub" class="text-xl font-bold"> Novafox Hub </NuxtLink>
        </div>

        <div class="flex items-center gap-4">
          <div v-if="user" class="flex items-center gap-3">
            <span class="text-sm text-gray-600">{{ user.name }}</span>
            <UButton
              icon="i-lucide-log-out"
              variant="ghost"
              size="sm"
              @click="handleLogout"
            >
              Logoutt
            </UButton>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>
  </div>
</template>
