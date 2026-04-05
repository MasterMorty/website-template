<script setup lang="ts">
import { reactive } from "vue";
import { motion } from "motion-v";

const pricingCompleted = reactive(new Set<number>());


const tiers = [
  {
    name: "Spark",
    price: "1.700",
    period: "pro Projekt",
    tagline: "Ein Ergebnis, voller Fokus.",
    features: [
      "Strategie Workshop",
      "UI/UX Design",
      "Responsive Development",
      "Basis SEO-Setup",
      "2 Korrekturschleifen",
    ],
    popular: false,
  },
  {
    name: "Studio",
    price: "6.500",
    period: "pro Projekt",
    tagline: "Das volle novafox-Erlebnis.",
    features: [
      "Alles aus Spark, plus:",
      "Markenstrategie & Positionierung",
      "Visuelle Identität",
      "Individuelles Website-Design",
      "Frontend-Entwicklung",
      "Motion Design",
      "SEO & Performance",
      "CMS Integration",
    ],
    popular: true,
  },
  {
    name: "Partnership",
    price: "2.000",
    period: "pro Monat",
    tagline: "Kreativ-Support auf Abruf.",
    features: [
      "Feste Design-Stunden",
      "Priorisierte Entwicklung",
      "Monatliche Strategie-Calls",
      "Performance-Monitoring",
      "Laufende Verbesserungen",
    ],
    popular: false,
  },
];
</script>

<template>
  <section id="pricing" class="px-2 lg:px-4 py-16 lg:py-24">
    <div
      class="bg-neutral-900 rounded-2xl lg:rounded-[20px] px-4 pt-16 lg:pt-24 pb-4"
    >
      <!-- Header -->
      <div class="lg:grid lg:grid-cols-12 gap-24 mb-16 lg:mb-20">
        <div
          class="flex flex-col col-span-12 lg:col-span-10 lg:col-start-3"
        >
          <HomeComponentsTextReveal>
            <h2
              class="text-xs lg:text-[clamp(14px,0.8vw,18px)] text-neutral-400 uppercase font-medium tracking-wider mb-2"
            >
              Preise
            </h2>
          </HomeComponentsTextReveal>

          <HomeComponentsTextRevealLines
            text="Transparente Investition, keine Überraschungen. Jedes Projekt erhält die gleiche obsessive Hingabe zum Handwerk, der Umfang bestimmt den Preis."
            class="text-neutral-100 text-[clamp(24px,3.3vw,56px)] font-medium leading-[1.05]"
            :base-delay="0.1"
            :stagger="0.05"
          />
        </div>
      </div>

      <!-- Pricing Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 lg:gap-4">
        <motion.article
          v-for="(tier, i) in tiers"
          :key="tier.name"
          class="pricing-card group relative flex flex-col rounded-xl lg:rounded-2xl overflow-hidden"
          :class="[tier.popular ? 'pricing-card--popular' : 'bg-neutral-800', { 'will-change-[transform,opacity]': !pricingCompleted.has(i) }]"
          :initial="{ y: 60, opacity: 0 }"
          :while-in-view="{ y: 0, opacity: 1 }"
          :in-view-options="{ once: true, margin: '0px 0px -20% 0px' }"
          :transition="{ duration: 0.9, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }"
          @animation-complete="pricingCompleted.add(i)"
        >
          <!-- Popular badge -->
          <div
            v-if="tier.popular"
            class="absolute top-5 right-5 lg:top-7 lg:right-7 z-10"
          >
            <span
              class="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[1.5px] font-semibold bg-neutral-900 text-orange-400 px-3 py-1.5 rounded-full"
            >
              <svg
                viewBox="0 0 46 46"
                fill="currentColor"
                class="w-2.5 h-2.5"
                aria-hidden="true"
              >
                <path
                  d="M23 46C24.5 46 25.73 44.9 25.94 43.34C28 29.43 29.9 27.5 43.27 25.98C44.81 25.79 46 24.5 46 23C46 21.48 44.83 20.23 43.29 20C30 18.15 28.35 16.53 25.94 2.64C25.67 1.1 24.48 0 23 0C21.48 0 20.27 1.1 20.02 2.66C18 16.55 16.1 18.48 2.75 20C1.17 20.21 0 21.46 0 23C0 24.5 1.12 25.75 2.71 25.98C16.02 27.87 17.65 29.47 20.02 43.36C20.33 44.92 21.54 46 23 46Z"
                />
              </svg>
              Beliebt
            </span>
          </div>

          <div class="flex flex-col h-full p-6 lg:p-8">
            <!-- Tier name -->
            <p
              class="text-xs lg:text-sm uppercase tracking-[2px] font-semibold mb-10 lg:mb-14"
              :class="
                tier.popular ? 'text-neutral-900/50' : 'text-neutral-500'
              "
            >
              {{ tier.name }}
            </p>

            <!-- Price block -->
            <div class="mb-6 lg:mb-8">
              <p
                class="text-[10px] lg:text-xs uppercase tracking-widest font-medium mb-1"
                :class="
                  tier.popular ? 'text-neutral-900/40' : 'text-neutral-500'
                "
              >
                Ab
              </p>

              <div class="flex items-start gap-0.5">
                <span
                  class="text-sm lg:text-base font-semibold mt-1.5 lg:mt-2"
                  :class="
                    tier.popular
                      ? 'text-neutral-900/60'
                      : 'text-neutral-400'
                  "
                >
                  &euro;
                </span>

                <span
                  class="text-[clamp(44px,4.5vw,72px)] font-bold tracking-[-0.03em] leading-[0.9]"
                  :class="
                    tier.popular ? 'text-neutral-900' : 'text-neutral-100'
                  "
                >
                  {{ tier.price }}
                </span>

                <span
                  class="text-[clamp(20px,2vw,32px)] font-bold tracking-tight mt-0.5"
                  :class="
                    tier.popular
                      ? 'text-neutral-900/40'
                      : 'text-neutral-500'
                  "
                >
                  +
                </span>
              </div>

              <p
                class="text-[11px] lg:text-xs uppercase tracking-wider font-medium mt-1.5"
                :class="
                  tier.popular ? 'text-neutral-900/40' : 'text-neutral-500'
                "
              >
                {{ tier.period }}
              </p>
            </div>

            <!-- Tagline -->
            <p
              class="text-[clamp(15px,1.1vw,18px)] font-medium leading-relaxed mb-8 lg:mb-10"
              :class="
                tier.popular ? 'text-neutral-900/70' : 'text-neutral-300'
              "
            >
              {{ tier.tagline }}
            </p>

            <!-- Divider -->
            <div
              class="w-full h-px mb-6 lg:mb-8"
              :class="
                tier.popular ? 'bg-neutral-900/12' : 'bg-neutral-700'
              "
            />

            <!-- Features -->
            <ul class="flex flex-col gap-3 flex-1">
              <li
                v-for="feature in tier.features"
                :key="feature"
                class="flex items-start gap-2.5 text-[clamp(13px,0.85vw,15px)] font-medium leading-snug"
                :class="
                  tier.popular
                    ? 'text-neutral-900/65'
                    : 'text-neutral-300'
                "
              >
                <svg
                  class="w-3.5 h-3.5 mt-0.5 shrink-0"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 8.5L6.5 12L13 4"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    :class="
                      tier.popular
                        ? 'stroke-neutral-900'
                        : 'stroke-orange-400'
                    "
                  />
                </svg>
                {{ feature }}
              </li>
            </ul>

            <!-- CTA Button -->
            <a
              href="mailto:info@novafox.at"
              class="pricing-cta mt-10 lg:mt-12 flex items-center justify-center w-full py-3.5 lg:py-4 rounded-lg lg:rounded-xl text-sm font-semibold tracking-wide uppercase no-underline transition-all duration-300"
              :class="
                tier.popular
                  ? 'bg-neutral-900 text-orange-400 hover:bg-neutral-800'
                  : 'pricing-cta--default'
              "
            >
              Jetzt anfragen
            </a>
          </div>
        </motion.article>
      </div>

      <!-- Bottom note -->
      <div class="flex justify-center mt-10 lg:mt-14 pb-4">
        <p
          class="text-neutral-500 text-[clamp(13px,0.9vw,16px)] font-medium text-center max-w-md leading-relaxed"
        >
          Jedes Projekt ist einzigartig —
          <a
            href="mailto:info@novafox.at"
            class="text-orange-400 hover:text-orange-300 transition-colors underline underline-offset-4 decoration-orange-400/30 hover:decoration-orange-300/50"
          >
            schreib mir
          </a>
          und ich erstelle ein individuelles Angebot.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pricing-card {
  transition:
    transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
    box-shadow 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.pricing-card:hover {
  transform: translateY(-4px);
}

.pricing-card--popular {
  background-color: #f97316;
}

.pricing-card--popular:hover {
  box-shadow: 0 12px 48px -12px rgba(249, 115, 22, 0.4);
}

.pricing-cta--default {
  background: rgba(255, 255, 255, 0.06);
  color: #e5e5e5;
}

.pricing-cta--default:hover {
  background: rgba(255, 255, 255, 0.12);
}
</style>
