<script setup lang="ts">
import { motion, stagger, useScroll } from "motion-v";

const { scrollYProgress: pageScrollProgress } = useScroll();
const isMoved = ref(false);

const unsubscribeScroll = pageScrollProgress.on("change", (value) => {
  isMoved.value = value >= 0.05;
});

onBeforeUnmount(() => {
  unsubscribeScroll();
});

const circle = {
  initial: {
    scale: 0.75,
    x: -80,
    rotate: -180,
  },
  moved: {
    scale: 1,
    x: 0,
    rotate: 0,
  },
  hover: {
    scale: 1.1,
    rotate: 180,
  },
};

const container = {
  initial: {
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    rotate: 0,
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.1,
      delayChildren: stagger(0.05, { startDelay: 0.15 }),
      opacity: { duration: 0.15 },
    },
  },
  moved: {
    x: -5,
    y: -20,
    z: 0,
    rotateX: 75,
    rotateY: 4.7,
    rotateZ: 4.7,
    opacity: 0,
    scale: 0.95,
    transition: {
      opacity: { duration: 0.1 },
    },
  },
  hover: {
    transition: {
      delayChildren: stagger(0.1),
    },
  },
};

const novafox = {
  initial: {
    y: 0,
  },
  hover: {
    y: [0, -3, 0.5, -0.3, 0],
    transition: {
      duration: 0.5,
      ease: "easeInOut" as const,
    },
  },
  moved: {
    y: -10,
  },
};

const logo = {
  hover: {
    ...novafox.hover,
    rotate: [0, 180, 180, 180, 180],
  },
  moved: { ...novafox.moved },
  initial: { ...novafox.initial },
};
</script>

<template>
  <header>
    <div
      class="fixed items-center justify-between left-4 lg:left-8 right-4 lg:right-8 top-4.5 lg:top-6 flex gap-4 lg:gap-8 z-50"
    >
      <motion.div
        class="relative"
        :initial="{ y: 20, opacity: 0 }"
        :while-in-view="{ y: 0, opacity: 1 }"
        :in-view-options="{ once: true }"
        :transition="{
          delay: 0.7,
          ease: [0.16, 1, 0.3, 1],
        }"
      >
        <motion.div
          class="w-fit rounded-full p-2 bg-[#171717] absolute z-0 cursor-pointer"
          :variants="circle"
          initial="initial"
          :animate="isMoved ? 'moved' : 'initial'"
          while-hover="hover"
        >
          <svg
            viewBox="0 0 46 46"
            fill="currentColor"
            class="size-4 w-auto object-contain text-white"
          >
            <path
              d="M23 46C24.4999 46 25.7292 44.8969 25.9374 43.3357C27.9999 29.4317 29.896 27.4959 43.2708 25.9765C44.8126 25.789 46 24.4987 46 23C46 21.4806 44.8333 20.2317 43.2918 20.0028C30.0001 18.1502 28.3541 16.5267 25.9374 2.64345C25.6666 1.10317 24.4792 0 23 0C21.4791 0 20.2708 1.10317 20.0209 2.66426C18.0001 16.5476 16.104 18.4834 2.75 20.0028C1.16668 20.211 0 21.4599 0 23C0 24.4987 1.12499 25.7476 2.70834 25.9765C16.0209 27.8705 17.6459 29.4733 20.0209 43.3564C20.3334 44.9176 21.5418 46 23 46Z"
            />
          </svg>
        </motion.div>
        <motion.div
          class="relative flex items-center gap-3 cursor-pointer font-medium text-[clamp(16px,1.2vw,20px)] bg-black text-white px-3 py-1 rounded z-10"
          :variants="container"
          initial="initial"
          :animate="isMoved ? 'moved' : 'initial'"
          while-hover="hover"
          :transition="{
            type: 'spring',
            visualDuration: 0.2,
            bounce: 0.2,
          }"
        >
          <motion.img
            :variants="logo"
            src="/images/svg/novafox-logo-bw.svg"
            alt="novafox logo"
            class="h-3 w-auto object-contain"
          />
          <motion.span :variants="novafox"> novafox </motion.span>
        </motion.div>
      </motion.div>
      <div
        class="h-fit inline-flex gap-4 lg:gap-8 col-span-6 text-[clamp(16px,1.2vw,20px)]"
      >
        <HomeComponentsTextReveal :delay="0.8" :duration="1">
          <HomeComponentsButton href="#services" label="Services" />
        </HomeComponentsTextReveal>
        <HomeComponentsTextReveal :delay="0.9" :duration="1">
          <HomeComponentsButton href="#work" label="Work" />
        </HomeComponentsTextReveal>
        <HomeComponentsTextReveal :delay="1" :duration="1">
          <HomeComponentsButton href="#tech" label="Tech Stack" />
        </HomeComponentsTextReveal>
        <HomeComponentsTextReveal :delay="1.1" :duration="1">
          <HomeComponentsButton href="#pricing" label="Price" />
        </HomeComponentsTextReveal>
      </div>
      <div class="inline-flex items-center">
        <HomeComponentsTextReveal :delay="1.2" :duration="1">
          <div class="h-fit flex items-center text-[clamp(16px,1.2vw,20px)]">
            <HomeComponentsButton href="/login" label="Login" />
          </div>
        </HomeComponentsTextReveal>
        <motion.div
          :initial="{ y: 20, opacity: 0 }"
          :while-in-view="{ y: 0, opacity: 1 }"
          :in-view-options="{ once: true }"
          :transition="{
            delay: 1.3,
            duration: 1,
            ease: [0.16, 1, 0.3, 1],
          }"
        >
          <HomeComponentsFollowMouseButton label="Contact" />
        </motion.div>
      </div>
    </div>
  </header>
</template>
