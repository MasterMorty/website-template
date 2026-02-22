<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: ['hub-role'],
})

const route = useRoute()

const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('hubSuperadminPages').path(route.path).first()
})

useSeoMeta({ title: page.value?.title, description: page.value?.description })
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
  <div v-else class="p-8 text-muted">Page not found.</div>
</template>
