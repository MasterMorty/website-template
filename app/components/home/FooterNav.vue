<script setup lang="ts">
import { ref } from "vue";
import { motion, useScroll, useTransform } from "motion-v";

const wrapRef = ref<HTMLElement | null>(null);

const { scrollYProgress } = useScroll({
  target: wrapRef,
  offset: ["start end", "end start"],
});

// Parallax the big text by 8vh across the section's viewport traversal
const bigTextY = useTransform(scrollYProgress, [0, 1], ["-12vh", "8vh"]);
</script>

<template>
  <section style="background: #f5f5f0;">
    <div ref="wrapRef" class="relative py-8 px-2 md:pt-16 md:px-4 md:pb-4 overflow-hidden">
      <motion.h2
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold whitespace-nowrap pointer-events-none z-0 will-change-transform"
        :style="{ fontSize: 'clamp(6rem, 14vw, 18rem)', color: '#0a0a0a', letterSpacing: '-0.04em', y: bigTextY }"
      >
        novafox
      </motion.h2>

      <div class="relative z-10 grid grid-cols-2 gap-2 lg:grid-cols-12 lg:gap-4">
        <a href="#projects" class="ftnav-card ftnav-card--tall col-span-2 h-40 lg:col-span-8 flex items-end py-4 px-5 rounded-xl font-medium no-underline leading-tight" style="color: #0a0a0a;">
          Arbeiten
        </a>
        <a href="mailto:info@novafox.at" class="ftnav-card ftnav-card--tall col-span-2 h-32 lg:col-span-4 flex items-end py-4 px-5 rounded-xl font-medium no-underline leading-tight" style="color: #0a0a0a;">
          Kontakt
        </a>
        <a href="https://www.instagram.com/novafox.at/" target="_blank" rel="noopener noreferrer" class="ftnav-card h-32 lg:col-span-3 lg:h-48 flex items-end py-4 px-5 rounded-xl font-medium no-underline leading-tight" style="color: #0a0a0a;">
          Instagram
        </a>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="ftnav-card h-32 lg:col-span-3 lg:h-48 flex items-end py-4 px-5 rounded-xl font-medium no-underline leading-tight" style="color: #0a0a0a;">
          GitHub
        </a>
        <a href="#services" class="ftnav-card h-32 lg:col-span-3 lg:h-48 flex items-end py-4 px-5 rounded-xl font-medium no-underline leading-tight" style="color: #0a0a0a;">
          Services
        </a>
        <a href="#" class="ftnav-card h-32 lg:col-span-3 lg:h-48 flex items-end py-4 px-5 rounded-xl font-medium no-underline leading-tight" style="color: #0a0a0a;">
          LinkedIn
        </a>
      </div>

      <div class="relative z-10 mt-8 pb-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-gray-400">
        <p>&copy; 2026 novafox. Alle Rechte vorbehalten.</p>
        <NuxtLink to="/agb" class="hover:text-gray-600 transition-colors">AGB</NuxtLink>
        <span aria-hidden="true">|</span>
        <NuxtLink to="/imprint" class="hover:text-gray-600 transition-colors">Impressum</NuxtLink>
        <span aria-hidden="true">|</span>
        <NuxtLink to="/privacy" class="hover:text-gray-600 transition-colors">Datenschutz</NuxtLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* backdrop-filter, hover colors, clamp font-size, and 22rem tall-card height
   cannot be expressed in Tailwind v2 without arbitrary value support */
.ftnav-card {
  font-size: clamp(1rem, 1.4vw, 1.5rem);
  background: rgba(180, 180, 174, 0.45);
  backdrop-filter: blur(6px);
  transition: backdrop-filter 0.3s ease, background 0.3s ease;
}

.ftnav-card:hover {
  backdrop-filter: blur(12px);
  background: rgba(180, 180, 174, 0.65);
}

@media (min-width: 1024px) {
  .ftnav-card--tall {
    height: 22rem;
  }
}
</style>
