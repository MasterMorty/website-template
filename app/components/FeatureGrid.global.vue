<script setup lang="ts">
interface Props {
  /** 
   * @label Number of Columns
   * @options 2,3,4
   */
  columns?: 2 | 3 | 4
}

withDefaults(defineProps<Props>(), {
  columns: 3
})

const columnClasses = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4'
}
</script>

<template>
  <section class="py-16">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <slot name="title" />
        <slot name="subtitle" />
      </div>
      
      <div 
        class="grid gap-8"
        :class="[columnClasses[columns]]"
      >
        <slot name="features" />
      </div>
    </div>
  </section>
</template>
