<script setup lang="ts">
import { motion } from "motion-v";

useSeoMeta({
  title: "Impressum – novafox",
  description: "Impressum und rechtliche Informationen von novafox.",
});

const sections = [
  {
    label: "01",
    title: "Angaben gemäß § 5 ECG",
    items: [
      { heading: "Name", text: "Florian Schlechter, BSc" },
      { heading: "Anschrift", text: "Kaltenbach 13\n6345 Kössen\nÖsterreich" },
      { heading: "E-Mail", text: "info@novafox.at", href: "mailto:info@novafox.at" },
      { heading: "Tel.", text: "+43 660 3233539", href: "tel:+436603233539" },
    ],
  },
  {
    label: "02",
    title: "EU-Streitschlichtung",
    items: [
      {
        heading: "OS-Plattform",
        text: "Gemäß Verordnung über Online-Streitbeilegung in Verbraucherangelegenheiten (ODR-Verordnung) möchten wir Sie über die Online-Streitbeilegungsplattform (OS-Plattform) informieren. Verbraucher haben die Möglichkeit, Beschwerden an die Online Streitbeilegungsplattform der Europäischen Kommission unter https://ec.europa.eu/consumers/odr zu richten.\n\nWir möchten Sie jedoch darauf hinweisen, dass wir nicht bereit oder verpflichtet sind, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.",
      },
    ],
  },
  {
    label: "03",
    title: "Haftung für Inhalte",
    items: [
      {
        heading: "Haftungsausschluss",
        text: "Wir entwickeln die Inhalte dieser Website ständig weiter und bemühen uns korrekte und aktuelle Informationen bereitzustellen. Leider können wir keine Haftung für die Korrektheit aller Inhalte auf dieser Website übernehmen, speziell für jene, die seitens Dritter bereitgestellt wurden. Als Diensteanbieter sind wir nicht verpflichtet, die von Ihnen übermittelten oder gespeicherten Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.\n\nUnsere Verpflichtungen zur Entfernung von Informationen oder zur Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen aufgrund von gerichtlichen oder behördlichen Anordnungen bleiben auch im Falle unserer Nichtverantwortlichkeit davon unberührt.\n\nSollten Ihnen problematische oder rechtswidrige Inhalte auffallen, bitten wir Sie uns umgehend zu kontaktieren, damit wir die rechtswidrigen Inhalte entfernen können.",
      },
    ],
  },
  {
    label: "04",
    title: "Haftung für Links",
    items: [
      {
        heading: "Externe Links",
        text: "Unsere Website enthält Links zu anderen Websites für deren Inhalt wir nicht verantwortlich sind. Haftung für verlinkte Websites besteht für uns nicht, da wir keine Kenntnis rechtswidriger Tätigkeiten hatten und haben, uns solche Rechtswidrigkeiten auch bisher nicht aufgefallen sind und wir Links sofort entfernen würden, wenn uns Rechtswidrigkeiten bekannt werden.\n\nWenn Ihnen rechtswidrige Links auf unserer Website auffallen, bitten wir Sie uns zu kontaktieren.",
      },
    ],
  },
  {
    label: "05",
    title: "Urheberrecht",
    items: [
      {
        heading: "Urheberrechtshinweis",
        text: "Alle Inhalte dieser Webseite (Bilder, Fotos, Texte, Videos) unterliegen dem Urheberrecht. Bitte fragen Sie uns bevor Sie die Inhalte dieser Website verbreiten, vervielfältigen oder verwerten wie zum Beispiel auf anderen Websites erneut veröffentlichen. Falls notwendig, werden wir die unerlaubte Nutzung von Teilen der Inhalte unserer Seite rechtlich verfolgen.\n\nSollten Sie auf dieser Webseite Inhalte finden, die das Urheberrecht verletzen, bitten wir Sie uns zu kontaktieren.",
      },
      {
        heading: "Bildernachweis",
        text: "Die Bilder, Fotos und Grafiken auf dieser Webseite sind urheberrechtlich geschützt. Die Bilderrechte liegen bei:\nFlorian Schlechter\n\nAlle Texte sind urheberrechtlich geschützt.\n\nQuelle: Erstellt mit dem Impressum Generator von AdSimple",
      },
    ],
  },
];
</script>

<template>
  <div class="imprint-root">
    <VueLenis root />

    <!-- Minimal nav -->
    <header class="fixed top-0 left-0 right-0 z-50 px-4 lg:px-8 pt-4.5 lg:pt-6">
      <motion.div
        :initial="{ y: 20, opacity: 0 }"
        :animate="{ y: 0, opacity: 1 }"
        :transition="{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }"
      >
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 font-medium text-[clamp(16px,1.2vw,20px)] bg-[#171717] text-white px-3 py-1 rounded hover:bg-[#2a2a2a] transition-colors"
        >
          <img
            src="/images/svg/novafox-logo-bw.svg"
            alt="novafox logo"
            class="h-3 w-auto object-contain"
          >
          <span>novafox</span>
        </NuxtLink>
      </motion.div>
    </header>

    <main class="px-2 lg:px-4 pt-28 lg:pt-40 pb-16 lg:pb-24">
      <!-- Hero heading -->
      <div class="mb-16 lg:mb-24 lg:grid lg:grid-cols-12">
        <div class="col-span-12 lg:col-span-8 lg:col-start-3">
          <HomeComponentsTextReveal>
            <p class="text-xs lg:text-[clamp(14px,0.8vw,18px)] text-neutral-400 uppercase font-medium tracking-wider mb-3">
              Rechtliches
            </p>
          </HomeComponentsTextReveal>
          <h1 class="text-[#0a0a0a] text-[clamp(48px,8vw,140px)] font-bold leading-[0.95] tracking-[-0.03em]">
            <HomeComponentsTextReveal :delay="0.1">
              Impressum
            </HomeComponentsTextReveal>
          </h1>
        </div>
      </div>

      <!-- Content sections -->
      <div
        class="bg-neutral-900 rounded-2xl lg:rounded-3xl px-4 lg:px-5 pt-10 lg:pt-16 pb-4"
      >
        <ul class="flex flex-col">
          <li
            v-for="(section, sIdx) in sections"
            :key="section.label"
            class="flex flex-col lg:grid lg:grid-cols-12 lg:gap-8 pt-10 pb-10"
            :class="sIdx < sections.length - 1 ? 'border-b border-neutral-700' : ''"
          >
            <!-- Number -->
            <HomeComponentsTextReveal class="lg:col-span-2">
              <p class="text-xs lg:text-[clamp(14px,0.8vw,18px)] text-neutral-400 uppercase font-medium tracking-wider mb-1">
                {{ section.label }}
              </p>
            </HomeComponentsTextReveal>

            <!-- Section title -->
            <HomeComponentsTextReveal class="lg:col-span-3 mb-6 lg:mb-0">
              <h2 class="text-[clamp(24px,3.3vw,48px)] text-neutral-100 font-medium lg:-mt-3 leading-[1.1]">
                {{ section.title }}
              </h2>
            </HomeComponentsTextReveal>

            <!-- Items -->
            <div class="flex flex-col gap-6 lg:col-span-5">
              <div v-for="(item, iIdx) in section.items" :key="iIdx">
                <HomeComponentsTextReveal>
                  <p class="text-[11px] lg:text-xs text-neutral-400 uppercase tracking-[1.2px] font-medium mb-1.5">
                    {{ item.heading }}
                  </p>
                </HomeComponentsTextReveal>
                <HomeComponentsTextReveal>
                  <p v-if="!item.href" class="text-[clamp(16px,1.2vw,20px)] text-neutral-100 font-medium leading-normal whitespace-pre-line">
                    {{ item.text }}
                  </p>
                  <a
                    v-else
                    :href="item.href"
                    class="text-[clamp(16px,1.2vw,20px)] text-orange-400 font-medium leading-normal hover:text-orange-300 transition-colors inline-block"
                  >
                    {{ item.text }}
                  </a>
                </HomeComponentsTextReveal>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- Back link -->
      <div class="mt-12 lg:mt-16 lg:grid lg:grid-cols-12">
        <div class="col-span-12 lg:col-span-8 lg:col-start-3">
          <motion.div
            :initial="{ opacity: 0, y: 12 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :in-view-options="{ once: true }"
            :transition="{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }"
          >
            <NuxtLink
              to="/"
              class="group inline-flex items-center gap-2 text-[clamp(16px,1.2vw,20px)] text-neutral-500 font-medium hover:text-[#0a0a0a] transition-colors"
            >
              <span class="inline-block transition-transform group-hover:-translate-x-1">&larr;</span>
              Zurück zur Startseite
            </NuxtLink>
          </motion.div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <HomeFooterNav />
  </div>
</template>

<style scoped>
.imprint-root {
  background: #fafaf8;
}
</style>
