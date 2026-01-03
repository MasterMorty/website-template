<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('pages').path(route.path).first()
})

useSeoMeta({
  title: page.value?.title,
  description: page.value?.description
})
</script>

<template>
  <ContentRenderer
    v-if="page"
    :value="page"
  />
  <div
    v-else
    class="container mx-auto px-4 py-16 text-center"
  >
    <h1 class="text-4xl font-bold mb-4">
      Page Not Found
    </h1>
    <p class="text-xl text-gray-600 mb-8">
      The page you're looking for doesn't exist.
    </p>
    <NuxtLink
      to="/"
      class="text-blue-600 hover:underline"
    >
      Go back home
    </NuxtLink>
  </div>
</template>
