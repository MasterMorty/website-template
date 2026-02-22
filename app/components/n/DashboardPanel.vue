<script setup lang="ts">
export interface DashboardPanelProps {
  /**
   * Additional CSS classes
   */
  class?: any;
}

defineProps<DashboardPanelProps>();
</script>

<template>
  <div
    class="absolute top-0 right-0 bottom-0 sidebar-pos overflow-auto z-30 transition-[left] duration-300 rounded-lg border border-zinc-700/50 bg-zinc-800"
    :class="$props.class"
  >
    <slot />
  </div>
</template>
