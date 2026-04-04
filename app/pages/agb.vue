<script setup lang="ts">
import { motion } from "motion-v";

useSeoMeta({
  title: "AGB – novafox",
  description: "Allgemeine Geschäftsbedingungen von novafox.",
});

const sections = [
  {
    label: "01",
    title: "Geltungsbereich",
    items: [
      {
        heading: "Allgemeine Geschäftsbedingungen",
        text: "Florian Schlechter, BSc\nKaltenbach 13\n6345 Kössen\nÖsterreich",
      },
      { heading: "E-Mail", text: "info@novafox.at", href: "mailto:info@novafox.at" },
      { heading: "Tel.", text: "+43 660 3233539", href: "tel:+436603233539" },
      {
        heading: "Geltungsbereich",
        text: "Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen novafox / Florian Schlechter (im Folgenden \"Agentur\" genannt) und ihren Kund:innen.\nAbweichende Bedingungen gelten nur, wenn sie schriftlich von der Agentur bestätigt wurden.",
      },
    ],
  },
  {
    label: "02",
    title: "Vertragsabschluss",
    items: [
      {
        heading: "Zustandekommen",
        text: "Ein Vertrag kommt zustande, wenn die Agentur ein Angebot des Kunden schriftlich oder per E-Mail bestätigt oder mit der Ausführung der Leistung beginnt.\nMündliche Nebenabreden sind nur wirksam, wenn sie schriftlich bestätigt werden.",
      },
    ],
  },
  {
    label: "03",
    title: "Leistungen und Preise",
    items: [
      {
        heading: "Preise",
        text: "Preise verstehen sich in Euro, zzgl. gesetzlicher Umsatzsteuer, sofern nicht anders angegeben.\nKostenvoranschläge sind unverbindlich.\nErhöhen sich die tatsächlichen Kosten um mehr als 20 %, informiert die Agentur den Kunden rechtzeitig.\nNicht im vereinbarten Preis enthaltene Zusatzleistungen (z. B. zusätzliche Korrekturschleifen, Sonderformate, Stockmaterial) werden gesondert berechnet.",
      },
    ],
  },
  {
    label: "04",
    title: "Präsentationen und Entwürfe",
    items: [
      {
        heading: "Eigentum",
        text: "Präsentationen, Konzepte und Entwürfe bleiben Eigentum der Agentur, solange kein Kauf- oder Lizenzvertrag geschlossen wurde.\nOhne Auftrag dürfen sie nicht genutzt, vervielfältigt oder an Dritte weitergegeben werden.",
      },
    ],
  },
  {
    label: "05",
    title: "Urheber- und Nutzungsrechte",
    items: [
      {
        heading: "Nutzungsrechte",
        text: "Mit vollständiger Bezahlung erhält der Kunde die vereinbarten Nutzungsrechte am Werk, zeitlich und örtlich im vereinbarten Umfang.\nÄnderungen, Weitergabe an Dritte oder Nutzung über den vereinbarten Rahmen hinaus bedürfen der schriftlichen Zustimmung der Agentur.\nDas Urheberrecht bleibt bei der Agentur bzw. den beauftragten Kreativen.",
      },
    ],
  },
  {
    label: "06",
    title: "Mitwirkungspflichten",
    items: [
      {
        heading: "Pflichten des Kunden",
        text: "Der Kunde stellt alle für die Leistungserbringung notwendigen Informationen, Materialien und Freigaben rechtzeitig zur Verfügung.\nVerzögerungen, die durch verspätete Zuarbeit entstehen, verlängern vereinbarte Fristen entsprechend.",
      },
    ],
  },
  {
    label: "07",
    title: "Lieferung und Termine",
    items: [
      {
        heading: "Termine",
        text: "Liefertermine werden individuell vereinbart.\nVerzögerungen durch höhere Gewalt, Betriebsstörungen oder Lieferantenprobleme verlängern die Fristen angemessen.\nBei Verzug kann der Kunde nach Setzung einer angemessenen Nachfrist vom Vertrag zurücktreten.",
      },
    ],
  },
  {
    label: "08",
    title: "Abnahme und Gewährleistung",
    items: [
      {
        heading: "Gewährleistung",
        text: "Der Kunde hat gelieferte Leistungen unverzüglich zu prüfen und Mängel innerhalb von 14 Tagen ab Lieferung schriftlich mitzuteilen.\nBei berechtigten Mängeln erfolgt zunächst eine kostenlose Nachbesserung.\nGewährleistungsrechte richten sich nach den gesetzlichen Bestimmungen.\nBei Unternehmern beträgt die Gewährleistungsfrist 12 Monate, bei Verbrauchern 24 Monate.",
      },
    ],
  },
  {
    label: "09",
    title: "Haftung",
    items: [
      {
        heading: "Haftungsbeschränkung",
        text: "Die Agentur haftet unbeschränkt nur für Vorsatz und grobe Fahrlässigkeit.\nFür leichte Fahrlässigkeit haftet sie nur bei Verletzung wesentlicher Vertragspflichten, und zwar begrenzt auf den vertragstypischen, vorhersehbaren Schaden.\nEine Haftung für entgangenen Gewinn oder Folgeschäden ist ausgeschlossen, außer bei Vorsatz oder grober Fahrlässigkeit.",
      },
    ],
  },
  {
    label: "10",
    title: "Zahlung",
    items: [
      {
        heading: "Zahlungsbedingungen",
        text: "Rechnungen sind innerhalb von 14 Tagen ab Rechnungsdatum ohne Abzug fällig.\nBei Zahlungsverzug werden Verzugszinsen in gesetzlicher Höhe berechnet.\nGelieferte Waren und Daten bleiben bis zur vollständigen Bezahlung Eigentum der Agentur.",
      },
    ],
  },
  {
    label: "11",
    title: "Widerrufsrecht",
    items: [
      {
        heading: "Für Verbraucher",
        text: "Verbraucher im Sinne des KSchG haben das Recht, binnen 14 Tagen ohne Angabe von Gründen vom Vertrag zurückzutreten.\nDie Frist beginnt bei Warenlieferungen mit Erhalt der Ware, bei digitalen Inhalten mit Vertragsabschluss.\nZur Wahrung der Frist genügt die rechtzeitige Absendung des Widerrufs.",
      },
      {
        heading: "Ausschluss des Widerrufsrechts",
        text: "- Bei vollständig erbrachten Dienstleistungen, wenn der Verbraucher vor Beginn ausdrücklich zugestimmt hat, dass die Leistung sofort ausgeführt wird und er sein Widerrufsrecht dadurch verliert.\n- Bei maßgeschneiderten oder personalisierten Waren, die nach Kundenspezifikationen gefertigt wurden.",
      },
    ],
  },
  {
    label: "12",
    title: "Datenschutz",
    items: [
      {
        heading: "DSGVO",
        text: "Die Verarbeitung personenbezogener Daten erfolgt gemäß der Datenschutz-Grundverordnung (DSGVO).\nEine aktuelle Datenschutzerklärung ist auf unserer Website abrufbar.",
      },
    ],
  },
  {
    label: "13",
    title: "Anwendbares Recht",
    items: [
      {
        heading: "Gerichtsstand",
        text: "Es gilt österreichisches Recht unter Ausschluss des UN-Kaufrechts.\nGerichtsstand für Unternehmer ist der Sitz der Agentur.\nFür Verbraucher gilt der gesetzliche Gerichtsstand.",
      },
    ],
  },
  {
    label: "14",
    title: "Salvatorische Klausel",
    items: [
      {
        heading: "Teilunwirksamkeit",
        text: "Sollte eine Bestimmung dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.\n\nStand: 01.08.2025",
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
