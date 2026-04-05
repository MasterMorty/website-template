<script setup lang="ts">
</script>

<template>
  <section id="services" class="px-2 lg:px-4 py-16 lg:py-24">
    <div
      class="flex flex-col gap-16 lg:gap-24 bg-neutral-900 px-4 pt-16 lg:pt-24 pb-4 rounded-2xl lg:rounded-3xl"
    >
      <!-- Header -->
      <div class="lg:grid lg:grid-cols-12 gap-24">
        <div class="flex flex-col col-span-12 lg:col-span-10 lg:col-start-3">
          <HomeComponentsTextReveal>
            <h2
              class="text-xs lg:text-[clamp(14px,0.8vw,18px)] text-neutral-400 uppercase font-medium tracking-wider mb-2"
            >
              Services
            </h2>
          </HomeComponentsTextReveal>
          <HomeComponentsTextRevealLines
            text="Mit jedem Projekt entwickle ich mich weiter. Mein Prozess vereint Design, Entwicklung und Markenstrategie - mit dem Ziel, Vision und Umsetzung für jedes Projekt in Einklang zu bringen."
            class="text-neutral-100 text-[clamp(24px,3.3vw,56px)] font-medium leading-[1.05]"
            :base-delay="0.1"
            :stagger="0.05"
          />
        </div>
      </div>

      <!-- Services List -->
      <div
        class="flex flex-col bg-neutral-800 rounded-xl lg:rounded-2xl px-4 lg:px-5"
      >
        <ul class="flex flex-col">
          <!-- Item 1 -->
          <li
            class="flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 pt-10 pb-10 border-b border-neutral-700"
          >
            <HomeComponentsTextReveal class="lg:col-span-2">
              <p
                class="text-xs lg:text-[clamp(14px,0.8vw,18px)] text-neutral-300 uppercase font-medium tracking-wider mb-1"
              >
                01
              </p>
            </HomeComponentsTextReveal>

            <HomeComponentsTextReveal
              :delay="0.05"
              class="lg:col-span-4 mb-6 lg:mb-0"
            >
              <h3
                class="text-[clamp(24px,3.3vw,56px)] text-neutral-100 font-medium lg:-mt-4"
              >
                Markenstrategie
              </h3>
            </HomeComponentsTextReveal>

            <div
              class="flex flex-col gap-4 lg:gap-6 lg:col-span-3 mb-8 lg:mb-0"
            >
              <HomeComponentsTextRevealLines
                text="Ich helfe dabei, den Kern und die Einzigartigkeit einer Marke zu erkennen und eine klare Strategie zu entwickeln, um Kunden nachhaltig zu begeistern."
                class="text-[clamp(16px,1.2vw,20px)] text-neutral-100 font-medium leading-[1.3]"
                :base-delay="0.1"
                :stagger="0.04"
              />

              <p
                class="text-[clamp(16px,1.2vw,20px)] text-neutral-100 font-medium leading-[1.3]"
              >
                <HomeComponentsTextReveal>
                  <ul
                    class="flex gap-1.5 flex-wrap text-[10px] uppercase tracking-[1.1] text-neutral-100"
                  >
                    <li class="bg-neutral-100/10 px-2 pt-2 pb-1.5 rounded-md">
                      Research & Insights
                    </li>
                    <li class="bg-neutral-100/10 px-2 pt-2 pb-1.5 rounded-md">
                      Markenstrategie
                    </li>
                    <li class="bg-neutral-100/10 px-2 pt-2 pb-1.5 rounded-md">
                      Wettbewerbsanalyse
                    </li>
                    <li class="bg-neutral-100/10 px-2 pt-2 pb-1.5 rounded-md">
                      Stimme & Ton
                    </li>
                    <li class="bg-neutral-100/10 px-2 pt-2 pb-1.5 rounded-md">
                      Naming & Copywriting
                    </li>
                    <li class="bg-neutral-100/10 px-2 pt-2 pb-1.5 rounded-md">
                      Workshops
                    </li>
                  </ul>
                </HomeComponentsTextReveal>
              </p>
            </div>

            <div class="lg:col-span-3">
              <div
                class="h-55 sm:h-100 md:h-112.5 lg:h-[clamp(220px,15vw,360px)] rounded-lg relative"
              >
                <img
                  :src="'https://cdn.novafox.at/projects/019d3904-9a7b-7684-9b1c-5ce316eab8fc/media/019d4ef4-e0fe-7fdc-bb5b-745778163a5d.png'"
                  alt="Markenstrategie"
                  class="absolute inset-0 top-2 w-full h-full object-contain"
                >
              </div>
            </div>
          </li>

          <!-- Item 2 -->
          <li
            class="flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 pt-10 pb-10 border-b border-neutral-700"
          >
            <HomeComponentsTextReveal class="lg:col-span-2">
              <p
                class="text-xs lg:text-[clamp(14px,0.8vw,18px)] text-neutral-300 uppercase font-medium tracking-wider mb-1"
              >
                02
              </p>
            </HomeComponentsTextReveal>

            <HomeComponentsTextReveal
              :delay="0.05"
              class="lg:col-span-4 mb-6 lg:mb-0"
            >
              <h3
                class="text-[clamp(24px,3.3vw,56px)] text-neutral-100 font-medium lg:-mt-4"
              >
                Digital Design
              </h3>
            </HomeComponentsTextReveal>

            <div
              class="flex flex-col gap-4 lg:gap-6 lg:col-span-3 mb-8 lg:mb-0"
            >
              <HomeComponentsTextRevealLines
                text="Gestaltung digitaler Erlebnisse, die Markenstrategie, Kreativität und UX vereinen – für funktionale und benutzerfreundliche Lösungen."
                class="text-[clamp(16px,1.2vw,20px)] text-neutral-100 font-medium leading-[1.3]"
                :base-delay="0.1"
                :stagger="0.04"
              />
              <p
                class="text-[clamp(16px,1.2vw,20px)] text-neutral-100 font-medium leading-[1.3]"
              >
                <HomeComponentsTextReveal>
                  <ul
                    class="flex gap-1.5 flex-wrap text-[10px] uppercase tracking-[1.1] text-neutral-100"
                  >
                    <li class="bg-neutral-100/10 px-2 pt-2 pb-1.5 rounded-md">
                      Identity Design
                    </li>
                    <li class="bg-neutral-100/10 px-2 pt-2 pb-1.5 rounded-md">
                      Wireframing
                    </li>
                    <li class="bg-neutral-100/10 px-2 pt-2 pb-1.5 rounded-md">
                      UI
                    </li>
                    <li class="bg-neutral-100/10 px-2 pt-2 pb-1.5 rounded-md">
                      UX
                    </li>
                    <li class="bg-neutral-100/10 px-2 pt-2 pb-1.5 rounded-md">
                      Web Design
                    </li>
                    <li class="bg-neutral-100/10 px-2 pt-2 pb-1.5 rounded-md">
                      Produktdesign
                    </li>
                  </ul>
                </HomeComponentsTextReveal>
              </p>
            </div>

            <div class="lg:col-span-3">
              <div
                class="h-55 sm:h-100 md:h-112.5 lg:h-[clamp(220px,15vw,360px)] rounded-lg overflow-hidden relative"
              >
                <img
                  :src="'https://cdn.novafox.at/projects/019d3904-9a7b-7684-9b1c-5ce316eab8fc/media/019d3b6b-a37d-7875-84a1-cc0b119dd4dd.png'"
                  alt="Digital Design"
                  class="absolute inset-0 w-full h-full object-cover"
                >
              </div>
            </div>
          </li>

          <!-- Item 3 -->
          <li
            class="flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 pt-10 pb-10"
          >
            <HomeComponentsTextReveal class="lg:col-span-2">
              <p
                class="text-xs lg:text-[clamp(14px,0.8vw,18px)] text-neutral-300 uppercase font-medium tracking-wider mb-1"
              >
                03
              </p>
            </HomeComponentsTextReveal>

            <HomeComponentsTextReveal
              :delay="0.05"
              class="lg:col-span-4 mb-6 lg:mb-0"
            >
              <h3
                class="text-[clamp(24px,3.3vw,56px)] text-neutral-100 font-medium lg:-mt-4"
              >
                Development
              </h3>
            </HomeComponentsTextReveal>

            <div
              class="flex flex-col gap-4 lg:gap-6 lg:col-span-3 mb-8 lg:mb-0"
            >
              <HomeComponentsTextRevealLines
                text="Entwicklung digitaler Produkte, die Design, Technologie und Geschäftsstrategie vereinen - für nahtlose Nutzererlebnisse."
                class="text-[clamp(16px,1.2vw,20px)] text-neutral-100 font-medium leading-[1.3]"
                :base-delay="0.1"
                :stagger="0.04"
              />

              <p
                class="text-[clamp(16px,1.2vw,20px)] text-neutral-100 font-medium leading-[1.3]"
              >
                <HomeComponentsTextReveal>
                  <ul
                    class="flex gap-1.5 flex-wrap text-[10px] uppercase tracking-[1.1] text-neutral-100"
                  >
                    <li class="bg-neutral-100/10 px-2 pt-2 pb-1.5 rounded-md">
                      Frontend Development
                    </li>
                    <li class="bg-neutral-100/10 px-2 pt-2 pb-1.5 rounded-md">
                      SEO
                    </li>
                    <li class="bg-neutral-100/10 px-2 pt-2 pb-1.5 rounded-md">
                      Motion
                    </li>
                    <li class="bg-neutral-100/10 px-2 pt-2 pb-1.5 rounded-md">
                      Animation
                    </li>
                    <li class="bg-neutral-100/10 px-2 pt-2 pb-1.5 rounded-md">
                      WebGL
                    </li>
                    <li class="bg-neutral-100/10 px-2 pt-2 pb-1.5 rounded-md">
                      CMS Development
                    </li>
                    <li class="bg-neutral-100/10 px-2 pt-2 pb-1.5 rounded-md">
                      Datenbanken
                    </li>
                  </ul>
                </HomeComponentsTextReveal>
              </p>
            </div>

            <div class="lg:col-span-3">
              <div
                class="h-55 sm:h-100 md:h-112.5 lg:h-[clamp(220px,15vw,360px)] rounded-lg overflow-hidden relative"
              >
                <img
                  :src="'https://cdn.novafox.at/projects/019d3904-9a7b-7684-9b1c-5ce316eab8fc/media/019d3b6b-c15b-759c-b33c-c2e1d00f62e8.png'"
                  alt="Development"
                  class="absolute inset-0 w-full h-full object-cover"
                >
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
