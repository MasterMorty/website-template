
<script setup lang="ts">

const route = useRoute()

const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('hubPages').path(route.path).first()
})

definePageMeta({ layout: 'auth' })

useSeoMeta({ title: page.value?.title, description: page.value?.description })
</script>

<template>
  <ContentRenderer v-if="page" :value="page"/>
</template>
