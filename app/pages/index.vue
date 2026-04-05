<script setup lang="ts">
useSeoMeta({
  title: "novafox - Your brand deserves better.",
  description:
    "novafox - Ein Design- & Entwicklungsstudio, das außergewöhnliche digitale Erlebnisse für ambitionierte Marken schafft.",
});
</script>

<template>
  <div class="page-root">
    <VueLenis
      root
      :options="{ orientation: 'vertical', gestureOrientation: 'vertical' }"
    />
    <HomeNav />
    <main class="page-main">
      <HomeHero />
      <HomeMarquee />
      <HomeServices />
      <HomeProjects />
      <HomeTechGrid />
      <HomePricing />
      <HomeFooterNav />
    </main>
  </div>
</template>

<style scoped>
.page-root {
  background: #fafaf8;
}
</style>
