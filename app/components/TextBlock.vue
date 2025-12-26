<script setup lang="ts">
/**
 * Text Block Component
 * @component TextBlock
 * @category Content
 * @description A simple text content block with optional title
 */

interface Props {
  /** @label Title */
  title?: string
  
  /** 
   * @label Content
   * @type richtext
   */
  content: string
  
  /** 
   * @label Text Alignment
   * @options left,center,right
   */
  alignment?: 'left' | 'center' | 'right'
  
  /** 
   * @label Max Width
   * @options sm,md,lg,xl,full
   */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  alignment: 'left',
  maxWidth: 'lg'
})

const alignmentClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right'
}

const maxWidthClasses = {
  sm: 'max-w-2xl',
  md: 'max-w-3xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
  full: 'max-w-full'
}
</script>

<template>
  <section class="py-12">
    <div class="container mx-auto px-4">
      <div 
        class="mx-auto"
        :class="[alignmentClasses[alignment], maxWidthClasses[maxWidth]]"
      >
        <h2 v-if="title" class="text-3xl font-bold mb-6">
          {{ title }}
        </h2>
        <div class="prose prose-lg" v-html="content" />
      </div>
    </div>
  </section>
</template>
