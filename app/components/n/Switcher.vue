<script setup>
import { motion } from "motion-v";

defineProps({
  animationDuration: {
    type: Number,
    default: 0.3
  }
});

const currentPath = ref([0]);

const currentIndex = computed(() => currentPath.value[currentPath.value.length - 1]);

const navigateForward = (targetIndex) => {
  if (typeof targetIndex !== 'number') {
    console.warn('navigateForward requires a numeric index');
    return;
  }
  currentPath.value.push(targetIndex);
};

const navigateBack = () => {
  if (currentPath.value.length > 1) {
    currentPath.value.pop();
  }
};

const navigateToBreadcrumb = (level) => {
  if (level >= 0 && level < currentPath.value.length) {
    currentPath.value = currentPath.value.slice(0, level + 1);
  }
};

const reset = () => {
  currentPath.value = [0];
};

provide('switcher', {
  navigateForward,
  navigateBack,
  navigateToBreadcrumb,
  reset,
  currentPath: currentPath.value,
  currentIndex
});

const getSlideOffset = (slideIndex) => {
  const currentIdx = currentIndex.value;
  const offset = (slideIndex - currentIdx) * 100;
  return `${offset}%`;
};

const getInitialSlideOffset = (slideIndex) => {
  const offset = (slideIndex - 0) * 100;
  return `${offset}%`;
};
</script>

<template>
  <div class="relative w-full h-full overflow-hidden">
    <div class="relative w-full h-full overflow-hidden">
      <template v-for="(_, slideIndex) in $slots" :key="`slide-${slideIndex}`">
        <motion.div
          v-if="$slots[slideIndex]"
          class="absolute top-0 left-0 w-full h-full"
          :style="{ zIndex: 1000 - slideIndex }"
          :initial="{ 
            x: getInitialSlideOffset(slideIndex),
            opacity: Math.abs(slideIndex - 0) > 1 ? 0 : 1
          }"
          :animate="{ 
            x: getSlideOffset(slideIndex),
            opacity: Math.abs(slideIndex - currentIndex) > 1 ? 0 : 1
          }"
          :transition="{ 
            duration: animationDuration, 
            ease: 'easeInOut' 
          }"
        >
          <slot 
            :name="slideIndex.toString()" 
            :navigate-forward="navigateForward"
            :navigate-back="navigateBack"
            :current-path="currentPath"
            :is-active="slideIndex === currentIndex"
          />
        </motion.div>
      </template>
    </div>
  </div>
</template>