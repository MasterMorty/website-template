<script setup lang="ts">
import {
  motion,
  AnimatePresence,
  stagger,
  animate,
  type PanInfo,
} from "motion-v";

const { scrollYProgress: pageScrollProgress } = useSharedPageScroll();
const isMoved = ref(false);
const mobileMenuOpen = ref(false);
const mobileMenuButtonVisible = ref(false);
const mobileMenuCircleActive = ref(false);
const topMenuButtonScale = useMotionValue(1);
const controls = useDragControls();
const dragProgress = useMotionValue(0);
const menuY = useMotionValue(0);
const backdropOpacity = useMotionValue(0);
const menuCloseDragThreshold = 200;
let dragProgressAnimation: ReturnType<typeof animate> | null = null;
let menuAnimation: ReturnType<typeof animate> | null = null;
let backdropAnimation: ReturnType<typeof animate> | null = null;

const dragProgressWidth = useTransform(
  dragProgress,
  (value) => `${value * 100}%`,
);

const stopDragProgressAnimation = () => {
  dragProgressAnimation?.stop();
  dragProgressAnimation = null;
};

const stopMenuAnimation = () => {
  menuAnimation?.stop();
  menuAnimation = null;
};

const stopBackdropAnimation = () => {
  backdropAnimation?.stop();
  backdropAnimation = null;
};

const getMenuHiddenY = () => {
  if (!import.meta.client) {
    return 1000;
  }

  return window.innerHeight + 120;
};

const unsubscribeScroll = pageScrollProgress.on("change", (value) => {
  isMoved.value = value >= 0.05;
});

onBeforeUnmount(() => {
  stopBackdropAnimation();
  stopMenuAnimation();
  stopDragProgressAnimation();
  unsubscribeScroll();
});

function openMenu() {
  stopBackdropAnimation();
  stopMenuAnimation();
  stopDragProgressAnimation();
  dragProgress.set(0);

  // Read layout values before writing to avoid thrashing
  const hiddenY = getMenuHiddenY();

  menuY.set(hiddenY);
  backdropOpacity.set(0);
  mobileMenuOpen.value = true;
  mobileMenuButtonVisible.value = true;
  mobileMenuCircleActive.value = true;

  nextTick(() => {
    requestAnimationFrame(() => {
      menuAnimation = animate(menuY, 0, {
        duration: 0.38,
        ease: [0.16, 1, 0.3, 1],
      });
      backdropAnimation = animate(backdropOpacity, 1, {
        duration: 0.26,
        ease: "linear",
      });
    });
  });
}

function closeMenu() {
  if (!mobileMenuOpen.value) {
    return;
  }

  stopBackdropAnimation();
  stopMenuAnimation();
  stopDragProgressAnimation();
  dragProgress.set(0);
  mobileMenuButtonVisible.value = false;
  mobileMenuCircleActive.value = false;

  menuAnimation = animate(menuY, getMenuHiddenY(), {
    duration: 0.34,
    ease: [0.4, 0, 1, 1],
  });
  backdropAnimation = animate(backdropOpacity, 0, {
    duration: 0.22,
    ease: "linear",
  });
  
  animate(topMenuButtonScale, [0.95, 1], {
    type: "spring",
    stiffness: 340,
    damping: 8,
  });

  setTimeout(() => {
    mobileMenuOpen.value = false;
    backdropOpacity.set(0);
  }, 340);
}

const dragHandle = {
  start: {
    width: 60,
  },
};

const onDrag = (_event: PointerEvent, info: PanInfo) => {
  stopDragProgressAnimation();
  const progress = Math.min(
    Math.max(info.offset.y / menuCloseDragThreshold, 0),
    1,
  );
  dragProgress.set(progress);
};

const onDragEnd = (_event: PointerEvent, info: PanInfo) => {
  if (info.offset.y >= menuCloseDragThreshold) {
    closeMenu();
    return;
  }

  stopDragProgressAnimation();
  dragProgressAnimation = animate(dragProgress, 0, {
    duration: 0.2,
    ease: "linear",
  });
};

const menuNavItems = [
  { href: "#services", label: "Service" },
  { href: "#work", label: "My Work" },
  { href: "#pricing", label: "Preis" },
  { href: "mailto:info@novafox.at", label: "Kontakt" },
];

const menuItemDelayBase = 0.16;
const menuItemDelayStep = 0.08;
const footerStartDelay =
  menuItemDelayBase + (menuNavItems.length - 1) * menuItemDelayStep + 0.08;

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

const footerIconDelay = (index: number, total: number) => {
  const centerIndex = Math.floor(total / 2);
  return footerStartDelay + Math.abs(index - centerIndex) * 0.08;
};

const footerTextDelay = footerStartDelay + 0.16;
</script>

<template>
  <header>
    <div
      class="fixed items-center justify-between text-[#404040] left-4 lg:left-8 right-4 lg:right-8 top-4.5 lg:top-6 flex gap-4 lg:gap-8 z-50"
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
      <!-- Desktop nav -->
      <div
        class="h-fit hidden lg:inline-flex gap-4 lg:gap-8 col-span-6 text-[clamp(16px,1.2vw,20px)]"
      >
        <HomeComponentsTextReveal :delay="0.8" :duration="1">
          <HomeComponentsButton href="#services" label="Services" />
        </HomeComponentsTextReveal>
        <HomeComponentsTextReveal :delay="0.9" :duration="1">
          <HomeComponentsButton href="#work" label="Arbeiten" />
        </HomeComponentsTextReveal>
        <HomeComponentsTextReveal :delay="1" :duration="1">
          <HomeComponentsButton href="#tech" label="Technologien" />
        </HomeComponentsTextReveal>
        <HomeComponentsTextReveal :delay="1.1" :duration="1">
          <HomeComponentsButton href="#pricing" label="Preise" />
        </HomeComponentsTextReveal>
      </div>
      <div class="hidden lg:inline-flex items-center">
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
          <HomeComponentsFollowMouseButton label="Kontakt" />
        </motion.div>
      </div>

      <!-- Mobile menu button -->
      <motion.button
        class="lg:hidden ml-auto cursor-pointer bg-[#171717] text-white px-4 py-1.5 rounded-full text-sm font-medium"
        :initial="{ y: 20, opacity: 0 }"
        :while-in-view="{ y: 0, opacity: 1 }"
        :in-view-options="{ once: true }"
        :style="{ scale: topMenuButtonScale }"
        :transition="{
          delay: 0.8,
          duration: 1,
          ease: [0.16, 1, 0.3, 1],
        }"
        @click="openMenu"
      >
        MENÜ
      </motion.button>
    </div>

    <!-- Mobile menu dialog -->
    <Teleport to="header">
      <div v-if="mobileMenuOpen" class="fixed inset-0 z-90 text-[#404040]">
        <div
          class="fixed items-center justify-between text-[#404040] left-4 lg:left-8 right-4 lg:right-8 top-4.5 lg:top-6 flex gap-4 lg:gap-8 z-50"
        >
          <AnimatePresence>
            <motion.button
              v-if="mobileMenuButtonVisible"
              class="ml-auto w-18.5 bg-[#171717] text-white px-1 py-1.5 text-sm font-medium rounded-md"
              :initial="{ opacity: 0, scale: 0.95 }"
              :animate="{ opacity: 1, scale: 1 }"
              :exit="{ opacity: 0, scale: 0.95 }"
              :transition="{
                opacity: { duration: 0.2 },
                scale: {
                  type: 'spring',
                  stiffness: 340,
                  damping: 8,
                },
              }"
              @click="closeMenu"
            >
              ZURÜCK
            </motion.button>
            <motion.div
              class="w-fit rounded-full p-2 bg-[#171717] absolute z-0 cursor-pointer"
              :variants="circle"
              initial="initial"
              :animate="mobileMenuCircleActive ? 'moved' : 'initial'"
              :transition="{
                delay: mobileMenuCircleActive ? 0.1 : 0,
              }"
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
          </AnimatePresence>
        </div>

        <motion.div
          class="fixed inset-0 z-10 flex justify-center items-end p-0 m-0 bg-transparent overflow-visible"
          :style="{ y: menuY }"
          drag="y"
          :drag-listener="false"
          :drag-controls="controls"
          drag-direction-lock
          :drag-constraints="{ top: 0, bottom: 0 }"
          :drag-transition="{ bounceStiffness: 500, bounceDamping: 15 }"
          :drag-elastic="{ top: 0, right: 0, bottom: 0.2, left: 0 }"
          :while-drag="{ cursor: 'grabbing' }"
          @drag="onDrag"
          @drag-end="onDragEnd"
          @pointerdown.self="closeMenu"
        >
          <div
            class="relative z-1 w-full m-6 max-h-[85vh] bg-[#fafaf8] rounded-3xl flex flex-col will-change-transform touch-none"
          >
            <!-- Drag handle -->
            <motion.div
              class="flex justify-center pt-3"
              style="touch-action: none"
              while-press="start"
              @pointerdown="(event) => controls.start(event)"
            >
              <motion.span
                class="w-10 h-1 bg-gray-300 rounded-full"
                :variants="dragHandle"
              >
                <motion.span
                  class="block h-1 rounded-full bg-neutral-900"
                  :style="{
                    width: dragProgressWidth,
                    opacity: dragProgressWidth,
                  }"
                />
              </motion.span>
            </motion.div>

            <!-- Nav content -->
            <div
              class="flex-1 overflow-y-auto flex items-center justify-center mt-10"
            >
              <nav class="menu-nav">
                <ul
                  class="list-none p-0 m-0 flex flex-col items-center gap-6 overflow-hidden"
                >
                  <motion.li
                    v-for="(item, index) in menuNavItems"
                    :key="item.href"
                    :initial="{ opacity: 0, scale: 1.1, y: 20 }"
                    :while-in-view="{ opacity: 1, scale: 1, y: 0 }"
                    :transition="{
                      delay: menuItemDelayBase + index * menuItemDelayStep,
                      type: 'spring',
                      stiffness: 300,
                      damping: 20,
                    }"
                  >
                    <a
                      :href="item.href"
                      class="menu-nav-button"
                      @click="closeMenu"
                    >
                      <span>
                        <span class="">
                          {{ item.label }}
                        </span>
                      </span>
                    </a>
                  </motion.li>
                </ul>
              </nav>
            </div>

            <!-- Footer -->
            <div class="grid w-full grid-cols-3 py-5 px-7 text-black mt-5">
              <motion.p
                class="text-xs font-light text-left"
                :initial="{ opacity: 0, y: 8 }"
                :while-in-view="{ opacity: 1, y: 0 }"
                :transition="{
                  delay: footerTextDelay,
                  duration: 0.2,
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                }"
              >
                novafox
              </motion.p>
              <div class="flex justify-center gap-3">
                <motion.svg
                  v-for="i in [1, 2, 3]"
                  :key="i"
                  viewBox="0 0 46 46"
                  fill="currentColor"
                  class="size-4 self-center"
                  :initial="{ opacity: 0, scale: 0.85, y: 20 }"
                  :while-in-view="{ opacity: 1, scale: 1, y: 0 }"
                  :transition="{
                    delay: footerIconDelay(i - 1, 3),
                    duration: 0.18,
                    type: 'spring',
                    stiffness: 300,
                    damping: 20,
                  }"
                >
                  <path
                    d="M23 46C24.4999 46 25.7292 44.8969 25.9374 43.3357C27.9999 29.4317 29.896 27.4959 43.2708 25.9765C44.8126 25.789 46 24.4987 46 23C46 21.4806 44.8333 20.2317 43.2918 20.0028C30.0001 18.1502 28.3541 16.5267 25.9374 2.64345C25.6666 1.10317 24.4792 0 23 0C21.4791 0 20.2708 1.10317 20.0209 2.66426C18.0001 16.5476 16.104 18.4834 2.75 20.0028C1.16668 20.211 0 21.4599 0 23C0 24.4987 1.12499 25.7476 2.70834 25.9765C16.0209 27.8705 17.6459 29.4733 20.0209 43.3564C20.3334 44.9176 21.5418 46 23 46Z"
                  />
                </motion.svg>
              </div>
              <motion.p
                class="text-xs font-light text-right"
                :initial="{ opacity: 0, y: 8 }"
                :while-in-view="{ opacity: 1, y: 0 }"
                :transition="{
                  delay: footerTextDelay,
                  duration: 0.2,
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                }"
              >
                {{ new Date().getFullYear() }}
              </motion.p>
            </div>
          </div>
        </motion.div>
        <motion.span
          class="backdrop-blur-sm cursor-no-drop absolute inset-0 z-0 bg-[color-mix(in_hsl,black,transparent_82%)]"
          :style="{ opacity: backdropOpacity }"
        />
      </div>
    </Teleport>
  </header>
</template>