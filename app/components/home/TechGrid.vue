<script setup lang="ts">
import { ref, type ComponentPublicInstance } from "vue";
import { motion } from "motion-v";

const techItems = [
  {
    src: "/images/svg/react-logo.svg",
    alt: "React",
    url: "https://reactjs.org",
  },
  {
    src: "/images/svg/vue-logo.svg",
    alt: "Vue",
    url: "https://vuejs.org",
  },
  {
    src: "/images/svg/rust-logo.svg",
    alt: "Rust",
    url: "https://www.rust-lang.org",
  },
  {
    src: "/images/svg/nuxt-logo.svg",
    alt: "Nuxt",
    url: "https://nuxt.com",
  },
  {
    src: "/images/svg/typescript-logo.svg",
    alt: "TypeScript",
    url: "https://www.typescriptlang.org",
  },
  {
    src: "/images/svg/laravel-logo.svg",
    alt: "Laravel",
    url: "https://laravel.com",
  },
  {
    src: "/images/svg/tailwindcss-logo.svg",
    alt: "Tailwind CSS",
    url: "https://tailwindcss.com",
  },
  {
    src: "/images/svg/motion.svg",
    alt: "Motion",
    url: "https://motion.dev",
  },
  {
    src: "/images/svg/figma-logo.svg",
    alt: "Figma",
    url: "https://figma.com",
  },
];


const gridRef = ref<HTMLElement>();
const itemRefs = ref<Array<HTMLElement | null>>([]);

const activeItemIndex = ref<number | null>(null);
const hoverKey = ref(0);
const hoverVisible = ref(false);
const hoverExiting = ref(false);

const hoverRect = ref<{
  x: number;
  y: number;
  width: number;
  height: number;
} | null>(null);

const hoverInitial = ref({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  scaleX: 1,
  scaleY: 1,
  originX: 0.5,
  originY: 0.5,
  opacity: 1,
});

const hoverExit = ref({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  scaleX: 1,
  scaleY: 1,
  originX: 0.5,
  originY: 0.5,
  opacity: 1,
});

const hoverAnimate = ref({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  scaleX: 1,
  scaleY: 1,
  originX: 0.5,
  originY: 0.5,
  opacity: 1,
});

type Edge = "top" | "right" | "bottom" | "left";

function setItemRef(
  index: number,
  el: Element | ComponentPublicInstance | null,
) {
  itemRefs.value[index] = el as HTMLElement | null;
}

function getItemRect(index: number) {
  if (!gridRef.value || !itemRefs.value[index]) return null;

  const gridRect = gridRef.value.getBoundingClientRect();
  const itemRect = itemRefs.value[index]!.getBoundingClientRect();

  return {
    x: itemRect.left - gridRect.left,
    y: itemRect.top - gridRect.top,
    width: itemRect.width,
    height: itemRect.height,
  };
}

function getClosestEdge(clientX: number, clientY: number, rect: DOMRect): Edge {
  const distances: Record<Edge, number> = {
    top: Math.abs(clientY - rect.top),
    right: Math.abs(clientX - rect.right),
    bottom: Math.abs(clientY - rect.bottom),
    left: Math.abs(clientX - rect.left),
  };

  let closest: Edge = "top";
  let min = distances.top;

  (Object.keys(distances) as Edge[]).forEach((edge) => {
    if (distances[edge] < min) {
      min = distances[edge];
      closest = edge;
    }
  });

  return closest;
}

function getEnterState(
  rect: { x: number; y: number; width: number; height: number },
  edge: Edge,
) {
  if (edge === "top") {
    return {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      scaleX: 1,
      scaleY: 0,
      originX: 0.5,
      originY: 0,
      opacity: 1,
    };
  }

  if (edge === "bottom") {
    return {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      scaleX: 1,
      scaleY: 0,
      originX: 0.5,
      originY: 1,
      opacity: 1,
    };
  }

  if (edge === "left") {
    return {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      scaleX: 0,
      scaleY: 1,
      originX: 0,
      originY: 0.5,
      opacity: 1,
    };
  }

  return {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
    scaleX: 0,
    scaleY: 1,
    originX: 1,
    originY: 0.5,
    opacity: 1,
  };
}

function getExitState(
  rect: { x: number; y: number; width: number; height: number },
  edge: Edge,
) {
  const base = {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
    opacity: 1,
  };

  if (edge === "top") {
    return { ...base, scaleX: 1, scaleY: 0, originX: 0.5, originY: 0 };
  }

  if (edge === "bottom") {
    return { ...base, scaleX: 1, scaleY: 0, originX: 0.5, originY: 1 };
  }

  if (edge === "left") {
    return { ...base, scaleX: 0, scaleY: 1, originX: 0, originY: 0.5 };
  }

  return { ...base, scaleX: 0, scaleY: 1, originX: 1, originY: 0.5 };
}

function activateItem(index: number, event: MouseEvent) {
  const rect = getItemRect(index);
  const cell = itemRefs.value[index];
  if (!rect || !cell) return;

  if (!hoverVisible.value) {
    const edge = getClosestEdge(
      event.clientX,
      event.clientY,
      cell.getBoundingClientRect(),
    );
    hoverInitial.value = getEnterState(rect, edge);
    hoverVisible.value = true;
    hoverKey.value += 1;
  }

  hoverExiting.value = false;
  hoverRect.value = rect;
  hoverAnimate.value = {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
    scaleX: 1,
    scaleY: 1,
    originX: 0.5,
    originY: 0.5,
    opacity: 1,
  };
  activeItemIndex.value = index;
}

function onItemEnter(index: number, event: MouseEvent) {
  activateItem(index, event);
}

function onGridMove(event: MouseEvent) {
  const target = event.target as HTMLElement | null;
  const cell = target?.closest(".tech-cell") as HTMLElement | null;
  if (!cell) return;

  const rawIndex = cell.dataset.techIndex;
  if (!rawIndex) return;

  const index = Number(rawIndex);
  if (Number.isNaN(index)) return;

  if (activeItemIndex.value !== index) {
    activateItem(index, event);
  }
}

function onGridLeave(event: MouseEvent) {
  if (!hoverRect.value || !hoverVisible.value) return;

  const activeIndex = activeItemIndex.value;
  const cell = activeIndex === null ? null : itemRefs.value[activeIndex];
  if (!cell) {
    if (!gridRef.value) {
      activeItemIndex.value = null;
      hoverVisible.value = false;
      return;
    }

    const edge = getClosestEdge(
      event.clientX,
      event.clientY,
      gridRef.value.getBoundingClientRect(),
    );
    hoverExit.value = getExitState(hoverRect.value, edge);
    hoverAnimate.value = hoverExit.value;
    hoverExiting.value = true;
    activeItemIndex.value = null;
    return;
  }

  if (activeIndex === null) {
    activeItemIndex.value = null;
    return;
  }

  const rect = getItemRect(activeIndex);
  if (rect) {
    hoverRect.value = rect;
  }

  const edge = getClosestEdge(
    event.clientX,
    event.clientY,
    cell.getBoundingClientRect(),
  );
  hoverExit.value = getExitState(hoverRect.value, edge);
  hoverAnimate.value = hoverExit.value;
  hoverExiting.value = true;
  activeItemIndex.value = null;
}

function onHoverAnimationComplete() {
  if (!hoverExiting.value) return;

  hoverExiting.value = false;
  hoverVisible.value = false;
}
</script>

<template>
  <section id="tech" class="px-4 lg:px-8 py-16 lg:py-28">
    <!-- Header -->
    <div class="lg:grid lg:grid-cols-12 gap-24 mb-16 lg:mb-20">
      <div class="flex flex-col col-span-12 lg:col-span-10 lg:col-start-3">
        <HomeComponentsTextReveal>
          <h2
            class="text-xs lg:text-[clamp(14px,0.8vw,18px)] text-[#8b7b63] uppercase font-medium tracking-wider mb-2"
          >
            Technologien
          </h2>
        </HomeComponentsTextReveal>
        <HomeComponentsTextRevealLines
            text="Basierend auf skalierbaren Tools - gezielt gewählt für Präzision, Performance und kreativen Spielraum."
            class="text-[#1f2937] text-[clamp(24px,3.3vw,56px)] font-medium leading-[1.05]"
            :base-delay="0.1"
            :stagger="0.05"
          />
      </div>
    </div>

    <!-- Grid -->
    <div
      ref="gridRef"
      class="tech-grid"
      @mousemove="onGridMove"
      @mouseleave="onGridLeave"
    >
      <motion.div
        v-if="hoverVisible"
        :key="`hover-${hoverKey}`"
        class="tech-hover-bg"
        :initial="hoverInitial"
        :animate="hoverAnimate"
        :transition="{
          x: { type: 'spring', stiffness: 500, damping: 42, mass: 0.55 },
          y: { type: 'spring', stiffness: 500, damping: 42, mass: 0.55 },
          width: { type: 'spring', stiffness: 500, damping: 42, mass: 0.55 },
          height: { type: 'spring', stiffness: 500, damping: 42, mass: 0.55 },
          scaleX: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
          scaleY: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
        }"
        @animation-complete="onHoverAnimationComplete"
      />

      <a
        v-for="(item, index) in techItems"
        :key="item.alt"
        :ref="(el) => setItemRef(index, el)"
        :data-tech-index="index"
        :href="item.url"
        target="_blank"
        rel="noopener noreferrer"
        class="tech-cell"
        :aria-label="`Visit ${item.alt} website`"
        @mouseenter="onItemEnter(index, $event)"
      >
        <img
          :src="item.src"
          :alt="item.alt"
          loading="lazy"
          decoding="async"
          class="tech-logo"
        >
        <span class="tech-name">{{ item.alt }}</span>
      </a>
    </div>
  </section>
</template>

<style scoped>
.tech-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  background: #fcfbf8;
  border: 1px solid rgba(80, 69, 51, 0.16);
  border-radius: 12px;
  overflow: hidden;
  isolation: isolate;
}

.tech-hover-bg {
  position: absolute;
  z-index: 1;
  pointer-events: none;
  background: rgba(249, 115, 22, 0.14);
  box-shadow: inset 0 0 0 1px rgba(249, 115, 22, 0.28);
}

/* Each cell */
.tech-cell {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem 1rem;
  background: transparent;
  box-shadow: inset 0 0 0 1px rgba(80, 69, 51, 0.12);
  text-decoration: none;
  transition: box-shadow 0.3s ease;
  backface-visibility: hidden;
  will-change: box-shadow;
}

@media (min-width: 1024px) {
  .tech-cell {
    padding: 3.5rem 1.5rem;
    gap: 1rem;
  }
}

.tech-cell:hover {
  box-shadow:
    inset 0 0 0 1px rgba(249, 115, 22, 0.28),
    0 10px 24px rgba(120, 98, 60, 0.1);
}

/* Logos — forced white via filter */
.tech-logo {
  width: auto;
  height: clamp(28px, 3.5vw, 48px);
  max-width: clamp(70px, 9vw, 130px);
  object-fit: contain;
  filter: brightness(0) saturate(100%);
  opacity: 0.52;
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
  pointer-events: none;
}

.tech-cell:hover .tech-logo {
  opacity: 0.86;
  transform: translateY(-2px);
}

/* Tech name labels */
.tech-name {
  font-size: clamp(10px, 0.75vw, 13px);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(31, 41, 55, 0.38);
  transition: color 0.35s ease;
}

.tech-cell:hover .tech-name {
  color: rgba(194, 98, 31, 0.88);
}
</style>
