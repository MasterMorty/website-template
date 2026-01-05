<script setup lang="ts">
import { ref } from 'vue'
import type { LayoutKey } from '#build/types/layouts'

const route = useRoute()

// reactive layout key so definePageMeta can react to changes
const layoutKey = ref<LayoutKey | false>('default')

const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('pages').path(route.path).first()
})

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

if ((page.value as any)?.layout) {
  layoutKey.value = (page.value as any).layout as LayoutKey
} else {
  layoutKey.value = 'default'
}

definePageMeta({ layout: layoutKey })

useSeoMeta({ title: page.value?.title, description: page.value?.description })
</script>

<template>
  <ContentRenderer v-if="page" :value="page" />
</template>
