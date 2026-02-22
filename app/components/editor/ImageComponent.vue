<script setup lang="ts">
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/vue-3'
import { inject } from 'vue'

const props = defineProps<NodeViewProps>()

const coverImageId = inject<any>('coverImageId')

const isCoverImage = computed(() => {
  return props.node.attrs.mediaId && coverImageId?.value === props.node.attrs.mediaId
})

const isHidden = computed(() => props.node.attrs.title === 'hidden')
</script>

<template>
  <NodeViewWrapper as="span" class="image-wrapper" :class="{ 'is-hidden-from-content': isHidden }">
    <img
      :src="node.attrs.src"
      :alt="node.attrs.alt"
      :title="node.attrs.title === 'hidden' ? undefined : node.attrs.title"
      class="image-node"
    >
    <UBadge
      v-if="isCoverImage"
      label="Cover Image"
      color="primary"
      variant="solid"
      size="xs"
      class="absolute top-2 right-2"
    />
    <UBadge
      v-if="isHidden"
      label="Hidden from content"
      color="neutral"
      variant="solid"
      size="xs"
      class="absolute top-2 left-2"
    />
  </NodeViewWrapper>
</template>

<style scoped>
.image-wrapper {
  position: relative;
  display: inline-block;
}

.image-node {
  display: block;
  max-width: 100%;
  height: auto;
}

.is-hidden-from-content .image-node {
  opacity: 0.35;
  filter: grayscale(0.4);
}
</style>
