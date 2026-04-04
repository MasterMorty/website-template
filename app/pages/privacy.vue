<script setup lang="ts">
import { motion } from "motion-v";

useSeoMeta({
  title: "Datenschutz – novafox",
  description: "Datenschutzerklärung von novafox.",
});

const sections = [
  {
    label: "01",
    title: "Einleitung und Überblick",
    items: [
      {
        heading: "Datenschutzerklärung",
        text: "Wir haben diese Datenschutzerklärung (Fassung 03.11.2023-122664961) verfasst, um Ihnen gemäß der Vorgaben der Datenschutz-Grundverordnung (EU) 2016/679 und anwendbaren nationalen Gesetzen zu erklären, welche personenbezogenen Daten wir als Verantwortliche – und die von uns beauftragten Auftragsverarbeiter (z. B. Provider) – verarbeiten, zukünftig verarbeiten werden und welche rechtmäßigen Möglichkeiten Sie haben.\n\nDatenschutzerklärungen klingen für gewöhnlich sehr technisch und verwenden juristische Fachbegriffe. Diese Datenschutzerklärung soll Ihnen hingegen die wichtigsten Dinge so einfach und transparent wie möglich beschreiben. Wir informieren damit in klarer und einfacher Sprache, dass wir im Rahmen unserer Geschäftstätigkeiten nur dann personenbezogene Daten verarbeiten, wenn eine entsprechende gesetzliche Grundlage gegeben ist.\n\nWenn trotzdem Fragen bleiben, möchten wir Sie bitten, sich an die im Impressum genannte verantwortliche Stelle zu wenden.",
      },
    ],
  },
  {
    label: "02",
    title: "Anwendungsbereich",
    items: [
      {
        heading: "Geltungsbereich",
        text: "Diese Datenschutzerklärung gilt für alle von uns im Unternehmen verarbeiteten personenbezogenen Daten und für alle personenbezogenen Daten, die von uns beauftragte Firmen (Auftragsverarbeiter) verarbeiten. Mit personenbezogenen Daten meinen wir Informationen im Sinne des Art. 4 Nr. 1 DSGVO wie zum Beispiel Name, E-Mail-Adresse und postalische Anschrift einer Person.\n\nDer Anwendungsbereich umfasst alle Onlineauftritte, Social Media Auftritte, E-Mail-Kommunikation sowie mobile Apps, die wir betreiben.",
      },
    ],
  },
  {
    label: "03",
    title: "Rechtsgrundlagen",
    items: [
      {
        heading: "Verarbeitungsgrundlagen",
        text: "Wir verarbeiten Ihre Daten nur, wenn mindestens eine der folgenden Bedingungen zutrifft:\n\n- Einwilligung (Art. 6 Abs. 1 lit. a DSGVO): Sie haben uns Ihre Einwilligung gegeben, Daten zu einem bestimmten Zweck zu verarbeiten.\n- Vertrag (Art. 6 Abs. 1 lit. b DSGVO): Um einen Vertrag oder vorvertragliche Verpflichtungen mit Ihnen zu erfüllen.\n- Rechtliche Verpflichtung (Art. 6 Abs. 1 lit. c DSGVO): Wenn wir einer rechtlichen Verpflichtung unterliegen.\n- Berechtigte Interessen (Art. 6 Abs. 1 lit. f DSGVO): Im Falle berechtigter Interessen, die Ihre Grundrechte nicht einschränken.\n\nZusätzlich gilt in Österreich das Datenschutzgesetz (DSG).",
      },
    ],
  },
  {
    label: "04",
    title: "Kontaktdaten",
    items: [
      {
        heading: "Verantwortlicher",
        text: "Florian Schlechter\nKaltenbach 13\n6345 Kössen\nÖsterreich",
      },
      { heading: "E-Mail", text: "info@novafox.at", href: "mailto:info@novafox.at" },
    ],
  },
  {
    label: "05",
    title: "Begriffserklärungen",
    items: [
      {
        heading: "Auftragsverarbeiter",
        text: "Eine natürliche oder juristische Person, Behörde, Einrichtung oder andere Stelle, die personenbezogene Daten im Auftrag des Verantwortlichen verarbeitet (Art. 4 DSGVO).\n\nDazu zählen etwa Hosting- oder Cloudanbieter, Bezahlungs- oder Newsletter-Anbieter sowie große Unternehmen wie Google oder Microsoft.",
      },
      {
        heading: "Einwilligung",
        text: "Jede freiwillig für den bestimmten Fall, in informierter Weise und unmissverständlich abgegebene Willensbekundung, mit der die betroffene Person zu verstehen gibt, dass sie mit der Verarbeitung der sie betreffenden personenbezogenen Daten einverstanden ist (Art. 4 DSGVO).\n\nIn der Regel erfolgt bei Websites eine solche Einwilligung über ein Cookie-Consent-Tool.",
      },
      {
        heading: "Personenbezogene Daten",
        text: "Alle Informationen, die sich auf eine identifizierte oder identifizierbare natürliche Person beziehen (Art. 4 DSGVO). Dazu zählen u. a. Name, Adresse, E-Mail-Adresse, Telefonnummer, Geburtsdatum, Bankdaten sowie laut EuGH auch die IP-Adresse.\n\nBesondere Kategorien umfassen rassische/ethnische Herkunft, politische Meinungen, religiöse Überzeugungen, genetische und biometrische Daten, Gesundheitsdaten sowie Daten zur sexuellen Orientierung.",
      },
      {
        heading: "Verantwortlicher",
        text: "Die natürliche oder juristische Person, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten entscheidet (Art. 4 DSGVO).\n\nIn unserem Fall sind wir der Verantwortliche. Wenn wir Daten an andere Dienstleister weitergeben, sind diese Auftragsverarbeiter – hierfür muss ein Auftragsverarbeitungsvertrag (AVV) unterzeichnet werden.",
      },
      {
        heading: "Verarbeitung",
        text: "Jeden mit oder ohne Hilfe automatisierter Verfahren ausgeführten Vorgang im Zusammenhang mit personenbezogenen Daten wie das Erheben, Erfassen, Speichern, Anpassen, Auslesen, Abfragen, Verwenden, Offenlegen, Einschränken, Löschen oder Vernichten (Art. 4 DSGVO).",
      },
    ],
  },
  {
    label: "06",
    title: "Schlusswort",
    items: [
      {
        heading: "Abschließende Hinweise",
        text: "Uns ist es wichtig, Sie nach bestem Wissen und Gewissen über die Verarbeitung personenbezogener Daten zu informieren. Bei Fragen zum Thema Datenschutz auf unserer Website zögern Sie bitte nicht, uns zu kontaktieren.\n\nAlle Texte sind urheberrechtlich geschützt.\n\nQuelle: Erstellt mit dem Datenschutz Generator von AdSimple",
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
              Datenschutz
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
