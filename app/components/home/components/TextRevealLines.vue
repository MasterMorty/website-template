<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { splitText } from "motion-plus-vue";
import { motion } from "motion-v";

const props = withDefaults(
  defineProps<{
    text: string;
    baseDelay?: number;
    stagger?: number;
    duration?: number;
    tag?: string;
    reverse?: boolean;
  }>(),
  {
    baseDelay: 0,
    stagger: 0.05,
    duration: 0.8,
    tag: "p",
    reverse: false,
  },
);

const initialY = props.reverse ? "-100%" : "100%";

const measurer = ref<HTMLElement | null>(null);
const lines = ref<string[]>([]);

function split() {
  const el = measurer.value;
  if (!el) return;

  el.textContent = props.text;

  const result = splitText(el);
  lines.value = result.lines.map((line) => line.textContent ?? "");
}

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  split();

  resizeObserver = new ResizeObserver(() => {
    split();
  });
  if (measurer.value) {
    resizeObserver.observe(measurer.value);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});
</script>

<template>
  <component :is="tag" class="relative block">
    <span ref="measurer" class="invisible absolute inset-x-0 pointer-events-none" aria-hidden="true">
      {{ text }}
    </span>

    <span v-for="(line, i) in lines" :key="i" class="block overflow-hidden py-[0.08em] -my-[0.08em]">
      <motion.span
        class="block"
        :initial="{ y: initialY }"
        :while-in-view="{ y: '0%' }"
        :in-view-options="{ once: true }"
        :transition="{
          duration,
          delay: baseDelay + i * stagger,
          ease: [0.16, 1, 0.3, 1],
        }"
      >
        {{ line }}
      </motion.span>
    </span>
  </component>
</template>
