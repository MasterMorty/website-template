<script setup lang="ts">
/**
 * Hero Section Component
 * @component HeroSection
 * @category Hero
 * @description A large hero section with headline, subheadline, and CTA
 */

interface Props {
  /** @label Headline */
  headline: string

  /** @label Subheadline */
  subheadline?: string

  /** @label CTA Button Text */
  ctaText?: string

  /** @label CTA Button Link */
  ctaLink?: string

  /** @label Background Image URL */
  backgroundImage?: string
}

withDefaults(defineProps<Props>(), {
  subheadline: '',
  ctaText: 'Learn More',
  ctaLink: '#',
  backgroundImage: ''
})
</script>

<template>
  <section
    class="relative min-h-125 flex items-center justify-center text-white"
  >
    <div class="container mx-auto px-4 relative z-10 text-center">
      <h1 class="text-5xl md:text-6xl font-bold mb-4">
        {{ headline }}
      </h1>
      <p
        v-if="subheadline"
        class="text-xl md:text-2xl mb-8 max-w-2xl mx-auto"
      >
        {{ subheadline }}
      </p>
      <a
        v-if="ctaText"
        :href="ctaLink"
        class="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
      >
        {{ ctaText }}
      </a>
    </div>
  </section>
</template>
