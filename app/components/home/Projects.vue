<script setup lang="ts">
import { ref, type ComponentPublicInstance } from "vue";
import { motion, useScroll, useTransform } from "motion-v";

const projects = [
  {
    num: "01",
    name: "volleye",
    tags: ["UI Design", "Development", "AI"],
    desc: "KI-gestützte Volleyball-Wertung mit Gestensteuerung und Live-Kommentar. Computer Vision trifft Sport.",
    img: "/images/home/volleye_icon.jpg",
    logo: "https://cdn.novafox.at/projects/019d3904-9a7b-7684-9b1c-5ce316eab8fc/media/019d4f03-498d-7791-95f1-74f28ec284e6.webp",
    url: "https://portfolio.fh-salzburg.ac.at/projects/2025-volleye",
    color: "#1a1a2e",
    date: "2025",
  },
  {
    num: "02",
    name: "Bikesport Bichler",
    tags: ["Web Design", "Web Development", "CMS"],
    desc: "Relaunch der Webseite für den österreichischen Fahrrad- und E-Bike-Händler Bikesport Bichler. Modernes Design trifft auf benutzerfreundliche Funktionalität.",
    img: "https://cdn.novafox.at/projects/019d3904-9a7b-7684-9b1c-5ce316eab8fc/media/019d5383-92b1-7f4a-80ed-09a75f1a26fc.webp",
    logo: "https://cdn.novafox.at/projects/019d3904-9a7b-7684-9b1c-5ce316eab8fc/media/019d4f02-0b02-7236-a7e9-c8a39175b0ce.png",
    url: "https://bikesportbichler.at",
    color: "#0d1f0d",
    date: "2026",
  },
];

const cardRefs = projects.map(() => ref<HTMLElement | null>(null));

const cardMotions = cardRefs.map((cardRef) => {
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  return { y };
});

const setCardRef = (
  index: number,
  el: Element | ComponentPublicInstance | null,
) => {
  cardRefs[index]!.value = el as HTMLElement | null;
};
</script>

<template>
  <section id="work" class="flex flex-col items-center py-28 px-4 lg:px-8">
    <h2 class="flex justify-between w-full mb-6 lg:mb-8 text-[#171717]">
      <HomeComponentsTextReveal :delay="0.2">
        <span
          class="text-[clamp(48px,12vw,200px)] font-bold tracking-tight leading-[0.8] uppercase block"
        >
          My
        </span>
      </HomeComponentsTextReveal>
      <HomeComponentsTextReveal :delay="0.4">
        <span
          class="text-[clamp(48px,12vw,200px)] font-bold tracking-tight leading-[0.8] uppercase block"
        >
          Work
        </span>
      </HomeComponentsTextReveal>
    </h2>

    <ul class="flex flex-col lg:flex-row gap-3 lg:gap-4 w-full mb-8 lg:mb-16">
      <motion.li
        v-for="(project, index) in projects"
        :key="project.num"
        :ref="(el) => setCardRef(index, el)"
        class="w-full lg:w-1/2 group"
        :initial="{ y: 40, opacity: 0, scale: 0.95 }"
        :while-in-view="{ y: 0, opacity: 1, scale: 1 }"
        :in-view-options="{ once: true }"
        :transition="{
          delay: 0.3 + index * 0.2,
          duration: 1.2,
          ease: [0.16, 1, 0.3, 1],
        }"
      >
        <a
          class="flex flex-col gap-4 lg:gap-5 px-3 lg:px-4 pt-3 lg:pt-4 pb-5 lg:pb-6 rounded-xl lg:rounded-2xl bg-neutral-900 cursor-pointer relative"
          :href="project.url"
        >
          <div
            class="relative rounded-lg lg:rounded-xl overflow-hidden w-full h-65 md:h-87.5 lg:h-[clamp(500px,32vw,800px)]"
            style="clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%)"
          >
            <div
              class="absolute inset-0 bg-neutral-900/30 backdrop-blur-md z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out"
            />
            <motion.div
              class="bg-orange-500 absolute top-1/2 -translate-y-1/12 left-1/2 -translate-x-1/2 w-[clamp(300px,65%,600px)] aspect-video rounded-lg z-20 pointer-events-none [clip-path:polygon(30%_50%,70%_50%,70%_50%,30%_50%)] group-hover:[clip-path:polygon(0_100%,100%_100%,100%_0,0_0)] group-hover:-translate-y-6/12 transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)]"
            />
            <div class="w-full h-full">
              <motion.div
                class="absolute inset-0 w-full h-[150%] -top-[25%] lg:-top-[30%] transform-gpu will-change-transform"
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
          </div>

          <div class="flex flex-col gap-4 lg:gap-5 px-3 lg:px-4">
            <div class="flex justify-between items-center w-full relative">
              <div class="flex items-center gap-2 lg:gap-3">
                <img
                  :src="project.logo"
                  :alt="project.name"
                  loading="lazy"
                  width="32"
                  height="32"
                  decoding="async"
                  class="w-6 h-6 lg:w-8 lg:h-8 rounded-full object-contain"
                >
                <p
                  class="text-[clamp(14px,1.2vw,18px)] uppercase font-semibold text-neutral-100 tracking-wide"
                >
                  {{ project.name }}
                </p>
              </div>
              <div class="flex gap-3 lg:gap-5">
                <p
                  class="text-[clamp(14px,1.2vw,18px)] uppercase font-semibold text-neutral-300 tracking-wide"
                >
                  {{ project.tags[0] }}
                </p>
                <p
                  class="text-[clamp(14px,1.2vw,18px)] uppercase font-semibold text-neutral-300 tracking-wide"
                >
                  {{ project.date }}
                </p>
              </div>
            </div>

            <div
              class="flex justify-center items-center h-4 md:h-4.5 overflow-hidden relative w-full"
            >
              <div
                class="absolute left-0 h-full w-8 lg:w-10 bg-linear-to-r from-neutral-900/95 to-neutral-200/0 z-10"
              />
              <div
                class="absolute right-0 h-full w-8 lg:w-10 bg-linear-to-l from-neutral-900/95 to-neutral-200/0 z-10"
              />
              <div class="flex overflow-hidden">
                <p
                  v-for="copy in 2"
                  :key="`tags-${index}-${copy}`"
                  class="text-[10px] md:text-xs tracking-widest text-neutral-300 uppercase whitespace-nowrap pr-1.5"
                >
                  <span
                    v-for="tag in project.tags"
                    :key="`p${index}-${copy}-${tag}`"
                    >{{ tag }},
                  </span>
                </p>
              </div>
            </div>
          </div>
        </a>
      </motion.li>
    </ul>

    <HomeComponentsTextReveal>
      <a class="flex items-center gap-1 group" href="/work">
        <span class="text-[clamp(20px,1.5vw,32px)] font-medium">Alle ansehen</span>
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
          class="lucide lucide-arrow-right w-6 h-6"
          aria-hidden="true"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </a>
    </HomeComponentsTextReveal>
  </section>
</template>
