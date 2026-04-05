<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "motion-v";

const { scrollYProgress: pageScrollProgress } = useSharedPageScroll();
const gifOpacity = useTransform(pageScrollProgress, [0, 0.1], [1, 0]);
const viewportHeight = useMotionValue(900);
const viewportWidth = useMotionValue(1440);

const introSection = ref<HTMLElement | null>(null);
const videoPreviewVisible = useVisibleWillChange(introSection);
const videoWrapperPromoting = ref(true);
const gifPromoting = ref(true);

const { scrollYProgress } = useScroll({
  target: introSection,
  offset: ["start end", "start 0.2"],
});

const videoY = useTransform(() => {
  const progress = scrollYProgress.get();
  const startY = -viewportHeight.get() * 1.05;
  return startY * (1 - progress);
});

const videoScale = useTransform(scrollYProgress, [0, 1], [0.35, 1]);

const mouseXRatio = useMotionValue(0);
const smoothedX = useSpring(mouseXRatio, {
  stiffness: 100,
  damping: 20,
});

const videoX = useTransform(() => {
  const sway = smoothedX.get();
  const progress = scrollYProgress.get();
  const influence = 1 - progress;
  return sway * viewportWidth.get() * 0.3 * influence;
});

const handlePointerMove = (e: PointerEvent) => {
  const normalized = (e.clientX / viewportWidth.get() - 0.5) * 2;
  mouseXRatio.set(normalized);
};

const handlePointerLeave = () => {
  mouseXRatio.set(0);
};

const handleResize = () => {
  viewportHeight.set(window.innerHeight);
  viewportWidth.set(window.innerWidth);
};

onMounted(() => {
  handleResize();
  window.addEventListener("pointermove", handlePointerMove);
  window.addEventListener("pointerleave", handlePointerLeave);
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("pointermove", handlePointerMove);
  window.removeEventListener("pointerleave", handlePointerLeave);
  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <!-- Mobile Hero -->
  <section class="h-svh relative px-4 lg:px-8 overflow-x-hidden">
    <div class="flex flex-col justify-between h-full pt-32 pb-4 lg:hidden">
      <div class="flex flex-col gap-1">
        <div class="overflow-hidden mb-1 w-full relative">
          <HomeComponentsTextReveal :duration="1">
            <div class="flex justify-between w-full">
              <p class="text-[clamp(14px,1.2vw,20px)] uppercase font-semibold">
                Your
              </p>
              <p class="text-[clamp(14px,1.2vw,20px)] uppercase font-semibold">
                Brand
              </p>
            </div>
          </HomeComponentsTextReveal>
        </div>
        <div class="relative md:hidden">
          <HomeComponentsTextReveal :delay="0.15" :duration="1" reverse>
            <div
              class="w-full h-full pointer-events-none aspect-video rounded-xl overflow-hidden bg-amber-200"
              style="clip-path: inset(0px)"
            />
          </HomeComponentsTextReveal>
        </div>
      </div>
      <div
        class="flex flex-col lg:flex-row lg:justify-between items-center gap-2 lg:gap-0"
      >
        <HomeComponentsTextReveal :delay="0.2" :duration="1">
          <div class="w-full pointer-events-none lg:pr-[4vw]">
            <img
              :src="'/images/home/deserves.svg'"
              alt="Design"
              class="h-[15vw] md:h-[16vw] lg:h-[17vw]"
            >
          </div>
        </HomeComponentsTextReveal>
        <HomeComponentsTextReveal :delay="0.3" :duration="1" class="w-full">
          <div class="flex justify-center">
            <img
              :src="'/images/home/better.svg'"
              alt="Engineer"
              class="h-[15vw] md:h-[16vw] lg:h-[17vw]"
            >
          </div>
        </HomeComponentsTextReveal>
      </div>

      <div class="flex items-end justify-between text-[#404040]">
        <HomeComponentsTextReveal :delay="0.45" :duration="1">
          <div class="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-4 h-4 text-neutral-900"
              aria-hidden="true"
            >
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
            <p class="text-sm font-medium">Mehr</p>
          </div>
        </HomeComponentsTextReveal>

        <motion.img
          :src="'/images/home/scroll_down_anim.gif'"
          loading="eager"
          width="28"
          height="28"
          alt=""
          fetchpriority="high"
          class="hero_footer-img"
          :class="{ 'will-change-[transform,opacity]': gifPromoting }"
          :style="{ opacity: gifOpacity }"
          :initial="{ opacity: 0, y: 12 }"
          :while-in-view="{ y: 0, opacity: 1 }"
          :in-view-options="{ once: true }"
          :transition="{
            delay: 0.55,
            ease: [0.16, 1, 0.3, 1],
          }"
          @animation-complete="gifPromoting = false"
        />

        <HomeComponentsTextReveal :delay="0.5" :duration="1">
          <div class="flex items-center gap-1">
            <p class="text-sm font-medium">entdecken</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="w-4 h-4 text-neutral-900"
              aria-hidden="true"
            >
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
          </div>
        </HomeComponentsTextReveal>
      </div>
    </div>
  </section>

  <!-- Desktop Hero -->
  <section class="hidden lg:block text-[#404040]">
    <div
      class="flex flex-col uppercase font-semibold absolute bottom-[15vh] lg:bottom-[20vh] left-8 right-8"
    >
      <div
        class="overflow-hidden mb-2 lg:mb-0 lg:w-full relative mx-auto lg:mx-0"
      >
        <HomeComponentsTextReveal :duration="1">
          <div class="flex justify-between w-full">
            <p class="text-[clamp(14px,1.2vw,20px)] uppercase block">Your</p>
            <p class="text-[clamp(14px,1.2vw,20px)] uppercase block">Brand</p>
          </div>
        </HomeComponentsTextReveal>
      </div>
      <div
        class="flex flex-col lg:flex-row lg:justify-between items-center gap-2 lg:gap-0"
      >
        <HomeComponentsTextReveal :delay="0.2" :duration="1" class="mr-[4vw]">
          <div>
            <img
              :src="'/images/home/deserves.svg'"
              alt="Design"
              class="h-[10vw] w-auto object-contain pointer-events-none"
            >
          </div>
        </HomeComponentsTextReveal>
        <HomeComponentsTextReveal :delay="0.3" :duration="1">
          <div>
            <img
              :src="'/images/home/better.svg'"
              alt="Engineer"
              class="h-[10vw] w-auto object-contain pointer-events-none"
            >
          </div>
        </HomeComponentsTextReveal>
      </div>
    </div>
    <div class="absolute left-8 bottom-6">
      <HomeComponentsTextReveal :delay="0.5" :duration="1">
        <div class="flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-arrow-down w-[clamp(16px,1.3vw,24px)] h-[clamp(16px,1.3vw,24px)] text-neutral-900"
            aria-hidden="true"
          >
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
          </svg>
          <p class="text-[clamp(12px,1.2vw,20px)] font-medium">Mehr</p>
        </div>
      </HomeComponentsTextReveal>
    </div>
    <div class="absolute right-8 bottom-6 flex items-end gap-32">
      <motion.img
        :src="'/images/home/scroll_down_anim.gif'"
        loading="eager"
        width="32"
        height="32"
        alt=""
        fetchpriority="high"
        class="hero_footer-img"
        :class="{ 'will-change-[transform,opacity]': gifPromoting }"
        :style="{ opacity: gifOpacity }"
        :initial="{ opacity: 0, y: 20 }"
        :while-in-view="{ y: 0, opacity: 1 }"
        :in-view-options="{ once: true }"
        :transition="{
          delay: 0.7,
          ease: [0.16, 1, 0.3, 1],
        }"
        @animation-complete="gifPromoting = false"
      />
      <HomeComponentsTextReveal :delay="0.5" :duration="1">
        <div class="flex items-center gap-1">
          <p class="text-[clamp(12px,1.2vw,20px)] font-medium">entdecken</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-arrow-down w-[clamp(16px,1.3vw,24px)] h-[clamp(16px,1.3vw,24px)] text-neutral-900"
            aria-hidden="true"
          >
            <path d="M12 5v14" />
            <path d="m19 12-7 7-7-7" />
          </svg>
        </div>
      </HomeComponentsTextReveal>
    </div>
  </section>

  <!-- Video Preview Section -->
  <section ref="introSection" class="hidden md:block intro h-svh px-8 relative text-[#404040]">
    <motion.div
      class="video-preview relative w-full aspect-video overflow-hidden rounded-3xl cursor-pointer"
      :class="{ 'will-change-transform': videoPreviewVisible }"
      style="clip-path: inset(0px); transform-origin: 50% 50%"
      :style="{
        x: videoX,
        y: videoY,
        scale: videoScale,
      }"
    >
      <motion.div
        class="video-wrapper absolute top-0 left-0 w-full h-full overflow-hidden rounded-2xl"
        :class="{ 'will-change-transform': videoWrapperPromoting }"
        :initial="{ y: '-100%' }"
        :while-in-view="{ y: 0 }"
        :in-view-options="{ once: true, margin: '0px 0px -80px 0px' }"
        :transition="{
          duration: 1,
          delay: 0.5,
          ease: [0.16, 1, 0.3, 1],
        }"
        @animation-complete="videoWrapperPromoting = false"
      >
        <div
          class="absolute top-0 left-0 w-full h-full rounded-2xl pointer-events-none bg-amber-200"
        />
      </motion.div>
      <button
        class="absolute bottom-8 right-8 z-10 scale-0 group-hover:scale-100 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        aria-label="Unmute video"
        role="button"
      >
        <div
          class="bg-neutral-100/50 shadow-2xl backdrop-blur-2xl w-[4vw] h-[4vw] rounded-full flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-volume2 lucide-volume-2 w-[2vw] h-[2vw] text-neutral-900"
            aria-hidden="true"
          >
            <path
              d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"
            />
            <path d="M16 9a5 5 0 0 1 0 6" />
            <path d="M19.364 18.364a9 9 0 0 0 0-12.728" />
          </svg>
        </div>
      </button>
    </motion.div>
  </section>
</template>