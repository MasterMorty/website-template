<script setup lang="ts">
useSeoMeta({
  title: "novafox – Digital. Wild. Exceptional.",
  description:
    "novafox \u2013 Ein Design- & Entwicklungsstudio, das au\u00dfergew\u00f6hnliche digitale Erlebnisse f\u00fcr ambitionierte Marken schafft.",
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
