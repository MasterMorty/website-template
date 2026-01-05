<script setup lang="ts">
import type { NavigationMenuItem } from '#ui/types'

const { data: pages } = await useAsyncData('navigation', () => {
  return queryCollectionNavigation('pages')
})

const items = computed<NavigationMenuItem[]>(() => {
  if (!pages.value) return []

  //TODO: just use predefined navigation
  const route = useRoute()

  const pageItems = pages.value
    .map(page => ({
      label: page.title,
      to: page.path as string,
      active: route.path === page.path
    }))
    .reverse()
    
  const isAuthenticated = !!useAuthStore().user

  const extraItem: NavigationMenuItem = isAuthenticated
    ? { label: 'Hub', to: '/hub', active: route.path === '/hub' }
    : { label: 'Login', to: '/login', active: route.path === '/login' }

  return [...pageItems, extraItem]
})
</script>

<template>
  <UHeader class="backdrop-blur-lg border-b border-neutral-200/10">
    <template #left>
      <NuxtLink to="/" class="font-bold text-lg">
        Logo
      </NuxtLink>
    </template>

    <template #default>
      <UNavigationMenu
        :items="items"
        variant="link"
        color="neutral"
        class="hidden lg:flex"
      />
    </template>

    <template #right>
      <UColorModeButton />
    </template>
  </UHeader>
</template>
