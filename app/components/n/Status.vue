<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true
  }
})

const badgeConfig = computed(() => {
  switch (props.status) {
    case 'published':
      return {
        color: 'green',
        variant: 'soft',
        icon: 'i-heroicons-check'
      }

    case 'draft':
      return {
        color: 'amber',
        variant: 'soft',
        icon: 'i-heroicons-clock'
      }

    case 'deleted':
      return {
        color: 'red',
        variant: 'soft',
        icon: 'i-heroicons-trash'
      }

    default:
      return {
        color: 'gray',
        variant: 'soft',
        icon: 'i-heroicons-question-mark-circle'
      }
  }
})
</script>

<template>
  <UBadge
    :color="badgeConfig.color"
    :variant="badgeConfig.variant"
  >
    <UIcon :name="badgeConfig.icon" class="mr-1" />
    {{ status }}
  </UBadge>
</template>