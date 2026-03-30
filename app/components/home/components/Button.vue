<script setup lang="ts">
defineProps<{
  href: string;
  label: string;
}>();
</script>

<template>
  <a :href="href" class="inline-block overflow-hidden relative z-10">
    <span
      v-for="(char, index) in label"
      :key="`${char}-${index}`"
      class="letter"
    >
      {{ char }}
    </span>
  </a>
</template>

<style scoped>
a {
  text-shadow: 0 2.05ex 0 currentColor;
  line-height: 1.15;
  --y: 0;
  transition: color 0.2s ease-in-out;
  &:hover {
    --y: -100%;
    color: #fb923b;
  }
  span {
    display: inline-block;
  }
}

.letter {
  position: relative;
  transition: transform 0.2s ease-in-out;
  transform: translateY(var(--y));
  transition-delay: calc(sibling-index() * 0.01s);
  span.bottom {
    position: absolute;
    top: 0;
    left: 0;
    transform: translateY(100%);
  }
}
</style>
