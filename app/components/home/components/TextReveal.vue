<script setup lang="ts">
import { ref } from "vue";
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
const promoting = ref(true);
</script>

<template>
  <component :is="tag" class="text-reveal-mask">
    <motion.div
      :class="{ 'will-change-transform': promoting }"
      :initial="{ y: initialY }"
      :while-in-view="{ y: 0 }"
      :in-view-options="{ once: true }"
      :transition="{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }"
      @animation-complete="promoting = false"
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
