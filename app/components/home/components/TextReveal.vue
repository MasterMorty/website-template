<script setup lang="ts">
import { motion } from "motion-v";

const props = withDefaults(
  defineProps<{
    delay?: number;
    duration?: number;
    tag?: string;
    reverse?: boolean;
  }>(),
  {
    delay: 0,
    duration: 0.8,
    tag: "div",
    reverse: false,
  },
);

const initialY = props.reverse ? "-100%" : "100%";
</script>

<template>
  <component :is="tag" class="text-reveal-mask">
    <motion.div
      :initial="{ y: initialY }"
      :while-in-view="{ y: 0 }"
      :in-view-options="{ once: true }"
      :transition="{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }"
    >
      <slot />
    </motion.div>
  </component>
</template>

<style scoped>
.text-reveal-mask {
  overflow: hidden;
  /* Prevent descenders (g, y, p, q) from being clipped by the reveal mask. */
  padding-block: 0.08em;
  margin-block: -0.08em;
}
</style>
