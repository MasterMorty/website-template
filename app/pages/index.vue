<script setup lang="ts">
useSeoMeta({
  title: "novafox – Digital. Wild. Exceptional.",
  description:
    "novafox – A design & development studio crafting exceptional digital experiences for ambitious brands.",
});
</script>

<template>
  <div class="page-root">
    <VueLenis root />
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
