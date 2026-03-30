<script setup>
import { useMotionValue, useSpring, motion } from "motion-v";

defineProps({
  label: String,
});

// Button motion values
const buttonX = useMotionValue(0);
const buttonY = useMotionValue(0);
const springButtonX = useSpring(buttonX, { stiffness: 300, damping: 20 });
const springButtonY = useSpring(buttonY, { stiffness: 300, damping: 20 });

// Span motion values (moves more = parallax effect)
const spanX = useMotionValue(0);
const spanY = useMotionValue(0);
const springSpanX = useSpring(spanX, { stiffness: 300, damping: 20 });
const springSpanY = useSpring(spanY, { stiffness: 300, damping: 20 });

const onMouseMove = (e) => {
  const button = e.currentTarget;
  const rect = button.getBoundingClientRect();

  const xPos = e.clientX - rect.left - button.offsetWidth / 2;
  const yPos = e.clientY - rect.top - button.offsetHeight / 2;

  // Button moves 10% of cursor offset
  buttonX.set((xPos / button.offsetWidth) * 5);
  buttonY.set((yPos / button.offsetHeight) * 5);

  // Span moves 20% (parallax)
  spanX.set((xPos / button.offsetWidth) * 10);
  spanY.set((yPos / button.offsetHeight) * 10);
};

const onMouseLeave = () => {
  buttonX.set(0);
  buttonY.set(0);
  spanX.set(0);
  spanY.set(0);
};
</script>

<template>
  <motion.button
    :style="{ x: springButtonX, y: springButtonY }"
    class="relative ml-3 overflow-hidden cursor-pointer px-5 py-2 text-white rounded-full bg-[#171717] z-0"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <motion.span
      :style="{ x: springSpanX, y: springSpanY }"
      class="block relative text-white pointer-events-none z-10"
    >
      {{ label }}
    </motion.span>
  </motion.button>
</template>