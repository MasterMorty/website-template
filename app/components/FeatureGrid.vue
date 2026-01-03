<script setup lang="ts">
/**
 * Feature Grid Component
 * @component FeatureGrid
 * @category Content
 * @description A grid of features with icons, titles, and descriptions
 */

interface Feature {
  /** @label Icon (emoji or URL) */
  icon?: string
  
  /** @label Feature Title */
  title: string
  
  /** @label Feature Description */
  description: string
}

interface Props {
  /** @label Section Title */
  title?: string
  
  /** @label Section Subtitle */
  subtitle?: string
  
  /** 
   * @label Features
   * @type array
   */
  features: Feature[]
  
  /** 
   * @label Number of Columns
   * @options 2,3,4
   */
  columns?: 2 | 3 | 4
}

withDefaults(defineProps<Props>(), {
  title: '',
  subtitle: '',
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
      <div v-if="title" class="text-center mb-12">
        <h2 class="text-4xl font-bold mb-4">{{ title }}</h2>
        <p v-if="subtitle" class="text-xl text-gray-600">{{ subtitle }}</p>
      </div>
      
      <div 
        class="grid gap-8"
        :class="[columnClasses[columns]]"
      >
        <div 
          v-for="(feature, index) in features" 
          :key="index"
          class="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition"
        >
          <div v-if="feature.icon" class="text-4xl mb-4">
            {{ feature.icon }}
          </div>
          <h3 class="text-xl font-semibold mb-2">{{ feature.title }}</h3>
          <p class="text-gray-600">{{ feature.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
