<script setup lang="ts">
const route = useRoute()

const slug = computed(() => {
  const pathSlug = Array.isArray(route.params.slug)
    ? route.params.slug.join('/')
    : route.params.slug || 'home'
  return pathSlug
})

const { data: page, error } = await useAsyncData(`page-${slug.value}`, () =>
  queryCollection('pages')
    .where('slug', '=', slug.value)
    .where('published', '=', true)
    .first()
)

const componentMap: Record<string, any> = {
  HeroSection: resolveComponent('HeroSection'),
  TextBlock: resolveComponent('TextBlock'),
  FeatureGrid: resolveComponent('FeatureGrid')
}

if (page.value) {
  if (import.meta.server) {
    useSeoMeta({
      title: page.value.title,
      description: page.value.meta?.description || '',
      ogTitle: page.value.title,
      ogDescription: page.value.meta?.description || '',
      ogImage: page.value.meta?.ogImage || ''
    })
  }
}
</script>

<template>
  <div>
    <div
      v-if="error || !page"
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

    <div v-else>
      <component
        :is="componentMap[section.component]"
        v-for="section in page.sections"
        :key="section.id"
        v-bind="section.props"
      />
    </div>
  </div>
</template>
