<script setup lang="ts">
import { ref, reactive, type ComponentPublicInstance } from "vue";
import { motion, useScroll, useTransform } from "motion-v";
import { Ticker } from "motion-plus-vue";

const MAX_PROJECTS = 24;
const entryCompleted = reactive(new Set<number>());
const dividerPromoting = ref(true);

useSeoMeta({
  title: "Arbeiten – novafox",
  description:
    "Alle Projekte von novafox – ein Design- & Entwicklungsstudio für außergewöhnliche digitale Erlebnisse.",
});

const { data: projects } = await useAsyncData("all-projects", () =>
  queryCollection("projects").order("order", "ASC").all(),
);

const projectList = computed(() => projects.value ?? []);

const cardRefs = Array.from({ length: MAX_PROJECTS }, () =>
  ref<HTMLElement | null>(null),
);

const cardMotions = cardRefs.map((cardRef) => {
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-80, 80]);
  const visible = useVisibleWillChange(cardRef);
  return { y, visible };
});

const setCardRef = (
  index: number,
  el: Element | ComponentPublicInstance | null,
) => {
  if (index < MAX_PROJECTS) {
    cardRefs[index]!.value = el as HTMLElement | null;
  }
};
</script>

<template>
  <div class="page-root">
    <VueLenis
      root
      :options="{ orientation: 'vertical', gestureOrientation: 'vertical' }"
    />
    <HomeNav />
    <main class="page-main">
      <!-- Hero -->
      <section class="px-4 lg:px-8 pt-36 lg:pt-44 pb-12 lg:pb-16">
        <div class="flex justify-between items-end w-full">
          <HomeComponentsTextReveal :delay="0.1">
            <span
              class="text-[clamp(52px,12vw,180px)] font-bold tracking-tight leading-[0.85] uppercase text-[#171717] block"
            >
              Alle
            </span>
          </HomeComponentsTextReveal>
          <motion.p
            class="text-[clamp(13px,1vw,16px)] text-neutral-400 uppercase tracking-widest font-medium pb-2 lg:pb-4 self-end"
            :initial="{ opacity: 0, y: 10 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :in-view-options="{ once: true }"
            :transition="{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }"
          >
            {{ projectList.length }} Projekte
          </motion.p>
        </div>
        <HomeComponentsTextReveal :delay="0.25">
          <span
            class="text-[clamp(52px,12vw,180px)] font-bold tracking-tight leading-[0.85] uppercase text-[#171717] block"
          >
            Arbeiten
          </span>
        </HomeComponentsTextReveal>
      </section>

      <!-- Divider -->
      <motion.div
        class="mx-4 lg:mx-8 h-px bg-neutral-200"
        :class="{ 'will-change-transform': dividerPromoting }"
        :initial="{ scaleX: 0, originX: 0 }"
        :while-in-view="{ scaleX: 1 }"
        :in-view-options="{ once: true }"
        :transition="{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }"
        @animation-complete="dividerPromoting = false"
      />

      <!-- Project list -->
      <ul class="flex flex-col">
        <motion.li
          v-for="(project, index) in projectList"
          :key="project.num"
          :ref="(el) => setCardRef(index, el)"
          class="group border-b border-neutral-200 mx-4 lg:mx-8"
          :class="{ 'will-change-[transform,opacity]': !entryCompleted.has(index) }"
          :initial="{ opacity: 0, y: 24 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :in-view-options="{ once: true }"
          :transition="{
            delay: 0.1 + index * 0.08,
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }"
          @animation-complete="entryCompleted.add(index)"
        >
          <a
            :href="project.url"
            target="_blank"
            rel="noopener noreferrer"
            class="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-0 py-6 lg:py-8 cursor-pointer"
          >
            <!-- Number -->
            <span
              class="text-[clamp(13px,1vw,15px)] font-medium text-neutral-300 uppercase tracking-widest lg:w-20 shrink-0"
            >
              {{ project.num }}
            </span>

            <!-- Image thumbnail -->
            <div
              class="relative w-full lg:w-28 lg:h-18 h-52 rounded-lg lg:rounded-xl overflow-hidden shrink-0 lg:mr-8"
            >
              <motion.div
                class="absolute inset-0 w-full h-[150%] -top-[25%] transform-gpu"
                :class="{ 'will-change-transform': cardMotions[index]!.visible }"
                style="contain: paint"
                :style="{ y: cardMotions[index]!.y }"
              >
                <img
                  :src="project.img"
                  :alt="project.name"
                  loading="lazy"
                  decoding="async"
                  class="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-500 ease-in-out"
                >
              </motion.div>
            </div>

            <!-- Info -->
            <div class="flex flex-col gap-2 flex-1 min-w-0">
              <div class="flex items-center gap-3">
                <img
                  :src="project.logo"
                  :alt="project.name"
                  loading="lazy"
                  width="24"
                  height="24"
                  decoding="async"
                  class="w-5 h-5 lg:w-6 lg:h-6 rounded-full object-contain shrink-0"
                >
                <h2
                  class="text-[clamp(20px,2.5vw,36px)] font-bold tracking-tight text-[#171717] leading-none group-hover:text-neutral-600 transition-colors duration-300"
                >
                  {{ project.name }}
                </h2>
              </div>
              <p
                class="text-[clamp(13px,1vw,15px)] text-neutral-500 leading-relaxed max-w-lg line-clamp-2"
              >
                {{ project.desc }}
              </p>
            </div>

            <!-- Tags ticker -->
            <div
              class="hidden lg:flex justify-center items-center h-4 overflow-hidden relative w-52 mx-8 shrink-0"
            >
              <div
                class="absolute left-0 h-full w-6 bg-linear-to-r from-[#fafaf8] to-transparent z-10"
              />
              <div
                class="absolute right-0 h-full w-6 bg-linear-to-l from-[#fafaf8] to-transparent z-10"
              />
              <div class="flex overflow-hidden">
                <Ticker>
                  <span
                    v-for="tag in project.tags"
                    :key="`work-${project.num}-${tag}`"
                    class="text-xs font-medium text-neutral-400 uppercase tracking-wide mr-5 last:mr-0"
                    >{{ tag }},</span
                  >
                </Ticker>
              </div>
            </div>

            <!-- Meta + arrow -->
            <div
              class="flex lg:flex-col items-center lg:items-end gap-4 lg:gap-1 shrink-0"
            >
              <span
                class="text-[clamp(12px,0.9vw,14px)] font-medium text-neutral-400 uppercase tracking-widest"
              >
                {{ project.type }}
              </span>
              <span
                class="text-[clamp(12px,0.9vw,14px)] font-medium text-neutral-400 uppercase tracking-widest"
              >
                {{ project.date }}
              </span>
            </div>

            <!-- Arrow -->
            <div
              class="hidden lg:flex items-center justify-center ml-8 w-10 h-10 rounded-full border border-neutral-200 group-hover:border-neutral-900 group-hover:bg-neutral-900 transition-all duration-300 shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-neutral-400 group-hover:text-white transition-colors duration-300 -rotate-45"
                aria-hidden="true"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </div>
          </a>
        </motion.li>
      </ul>

      <!-- Back link -->
      <div class="flex justify-center py-20 lg:py-28 px-4 lg:px-8">
        <HomeComponentsTextReveal>
          <NuxtLink
            to="/"
            class="flex items-center gap-2 text-[clamp(16px,1.2vw,20px)] font-medium text-neutral-400 hover:text-[#171717] transition-colors duration-300 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="rotate-180"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
            Zurück zur Startseite
          </NuxtLink>
        </HomeComponentsTextReveal>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page-root {
  background: #fafaf8;
}
</style>
