<script setup lang="ts">
definePageMeta({ layout: 'default' })
useSeoMeta({
  title: 'novafox – Your brand deserves better.',
  description: 'Professionelle Web Design und Development Dienstleistungen. Wir erstellen außergewöhnliche Webseiten und digitale Erlebnisse für deine Marke.',
})

const services = [
  {
    label: 'Web Design',
    title: 'Web Design & Development',
    description: 'Individuelle, schnelle und responsive Websites für dein Business. Von der Landing Page bis zum komplexen Portal.',
  },
  {
    label: 'Branding',
    title: 'Brand Identity & Logo Design',
    description: 'Kompletter Markenaufbau von Strategie bis zur visuellen Identität. Logo, CI, Farben, Typografie.',
  },
  {
    label: 'Marketing',
    title: 'Marketing Setup',
    description: 'Social Media, Anzeigen, E-Mails – alles aus einer Hand. Wir helfen beim erfolgreichen Start.',
  },
]

const projects = [
  {
    name: 'volleye',
    tags: ['UI Design', 'Web Design', 'Development'],
    tech: ['Vue', 'Hono', 'YOLO11', 'LiveKit', 'Python'],
    desc: 'Volleye revolutioniert Volleyball mit KI-gestützter Punkteerfassung, Gestensteuerung und Live-Kommentaren. Mit nur zwei Smartphones werden Ball und Spieler in Echtzeit getrackt.',
    url: 'https://portfolio.fh-salzburg.ac.at/projects/2025-volleye',
    img: 'https://novafox.at/img/volleye/start-screen-view.webp',
  },
  {
    name: 'mosti.tirol',
    tags: ['UI', 'Web Design', 'Web Development'],
    tech: ['JS', 'PHP', 'Resend'],
    desc: 'Mountainbike-Coaching- und Tourenplattform mit persönlichen Erlebnissen von Einsteigerkursen bis zu exklusiven Secret Trail-Abenteuern in Tirol.',
    url: 'https://mosti.tirol/src/guiding.html',
    img: 'https://novafox.at/img/mosti/abtme-mockup.webp',
  },
  {
    name: 'fahringermike.at',
    tags: ['UI', 'Web Design', 'Web Development'],
    tech: ['JS', 'PHP', 'Resend', 'CMS'],
    desc: 'Allianz Agentur Website mit maßgeschneiderten Versicherungslösungen. Persönliche Beratung, klare Leistungsübersichten und ein informativer Blog.',
    url: 'https://fahringermike.at/',
    img: 'https://novafox.at/img/mike/angebot-mockup.webp',
  },
]

const pricingPlans = [
  {
    name: 'Basic',
    price: '999',
    subtitle: 'Essentials für kleine Unternehmen',
    features: [
      'Ein kostenloses Designmuster',
      'Website mit max. 3 Unterseiten',
      'Webdesign',
      'Mobile Responsiveness',
      'Einfache Barrierefreiheit',
    ],
    popular: false,
  },
  {
    name: 'Business',
    price: '1.999',
    subtitle: 'Perfekt für wachsende Unternehmen',
    features: [
      'Alles vom Basic-Paket',
      'Bis zu 10 Seiten',
      'Verbessertes UI/UX-Design',
      'SEO-Optimierung',
      'Branding-Paket (Logo, CI, ...)',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '4.999',
    subtitle: 'Für große Organisationen',
    features: [
      'Alles vom Business-Paket',
      'E-Commerce-Integration',
      'Erweiterte Analytik',
      '24/7 Support',
      'Individuelle Funktionen',
    ],
    popular: false,
  },
]

const features = [
  {
    subtitle: 'Alles auf einer Plattform.',
    title: 'Docs & Medien',
    description: 'Logos, Bilder, Dokumente – wir verwalten alle Assets deines Projekts sauber und übersichtlich, damit nichts verloren geht.',
  },
  {
    subtitle: 'Mobile-first by default.',
    title: 'Smart & Reaktionsfähig',
    description: 'Jede Website, die wir bauen, funktioniert perfekt auf allen Geräten – vom Smartphone bis zum 4K-Monitor.',
  },
  {
    subtitle: 'Content inklusive.',
    title: 'Echte Inhalte, kein Lorem Ipsum',
    description: 'Wir helfen dir beim Aufbau deiner Inhalte. Texte, Struktur, SEO-Tags – alles bereit für den Live-Gang.',
  },
  {
    subtitle: 'Animations & UX.',
    title: 'Interaktiv & Modern',
    description: 'Subtile Animationen, klare User Journeys und moderne Interaktionen machen deine Website zu einem echten Erlebnis.',
  },
]

const faqs = [
  { q: 'Was bietet novafox an?', a: 'novafox bietet professionelles Webdesign, Web Development, Brand Identity und Marketing Setup für Unternehmen jeder Größe. Wir verwandeln Besucher in Kunden.' },
  { q: 'Wie lange dauert ein Projekt?', a: 'Ein Basic-Paket ist oft in 2–4 Wochen fertig, Business-Projekte in 4–8 Wochen. Wir besprechen immer einen gemeinsamen Zeitplan.' },
  { q: 'Welche Technologien nutzt ihr?', a: 'Wir arbeiten mit Vue, Nuxt, React, Next.js, PHP, JS und mehr – immer auf das Projekt abgestimmt.' },
  { q: 'Bietet ihr Wartung nach dem Launch an?', a: 'Ja. Optionale Wartungspakete & Support halten deine Website aktuell und sicher.' },
  { q: 'Wie starte ich ein Projekt mit novafox?', a: 'Schreib uns an info@novafox.at. Wir melden uns innerhalb von 24 Stunden für ein kostenloses Erstgespräch.' },
]

const openFaq = ref<number | null>(null)
</script>

<template>
  <div class="bg-white text-neutral-900">

    <!-- ─── ANNOUNCE BANNER ────────────────────────────────────────────────── -->
    <div class="bg-orange-500 text-white text-xs text-center py-2 px-4 flex items-center justify-center gap-2">
      <span class="w-1.5 h-1.5 rounded-full bg-white/60 inline-block" />
      Neue Projekte verfügbar – Jetzt kostenloses Erstgespräch buchen
      <a href="mailto:info@novafox.at" class="underline font-semibold ml-1">Jetzt anfragen →</a>
    </div>

    <!-- ─── HERO ──────────────────────────────────────────────────────────── -->
    <section class="relative overflow-hidden nf-grid-bg">
      <div class="absolute inset-0 bg-linear-to-b from-white/0 via-white/60 to-white pointer-events-none" />

      <div class="relative z-10 max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
        <!-- badge -->
        <div class="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-600 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="4"/></svg>
          Web Design · Development · Branding
        </div>

        <h1 class="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6">
          Your brand<br>
          <span class="text-orange-500">deserves better.</span>
        </h1>

        <p class="text-lg text-neutral-500 max-w-xl mx-auto mb-10 leading-relaxed">
          Wir erstellen außergewöhnliche Webseiten und digitale Erlebnisse, die deiner Marke helfen, sich online hervorzuheben.
        </p>

        <div class="flex flex-wrap gap-3 justify-center mb-16">
          <a
            href="mailto:info@novafox.at"
            class="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 transition-colors text-white font-semibold px-6 py-3 rounded-xl text-sm shadow-lg shadow-orange-500/20"
          >
            Projekt starten
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
          <a
            href="#projects"
            class="inline-flex items-center gap-2 border border-neutral-200 hover:border-neutral-400 bg-white/80 transition-colors text-neutral-700 font-semibold px-6 py-3 rounded-xl text-sm"
          >
            Projekte ansehen
          </a>
        </div>

        <!-- hero demo card -->
        <div class="max-w-2xl mx-auto nf-card shadow-xl overflow-hidden text-left">
          <!-- browser chrome bar -->
          <div class="flex items-center gap-2 bg-neutral-50 border-b border-neutral-100 px-4 py-2.5">
            <span class="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span class="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <span class="w-2.5 h-2.5 rounded-full bg-green-400" />
            <div class="flex-1 mx-3 bg-white border border-neutral-200 rounded px-3 py-0.5 text-xs text-neutral-400 font-mono">
              novafox.at → your-brand-new-website.at
            </div>
          </div>
          <!-- mock content -->
          <div class="p-5 bg-white space-y-3">
            <div class="flex items-center gap-2">
              <span class="text-xs font-mono text-orange-500 bg-orange-50 border border-orange-100 px-2 py-0.5 rounded">Design</span>
              <span class="text-xs font-mono text-neutral-400 bg-neutral-50 border border-neutral-100 px-2 py-0.5 rounded">Development</span>
              <span class="text-xs font-mono text-neutral-400 bg-neutral-50 border border-neutral-100 px-2 py-0.5 rounded">Branding</span>
              <span class="text-xs font-mono text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded ml-auto">Launch ready ✓</span>
            </div>
            <div class="space-y-2 pt-1">
              <div class="h-2.5 bg-neutral-100 rounded-full w-full" />
              <div class="h-2.5 bg-neutral-100 rounded-full w-4/5" />
              <div class="h-2.5 bg-orange-100 rounded-full w-3/5" />
            </div>
            <div class="grid grid-cols-3 gap-3 pt-1">
              <div class="h-14 bg-orange-50 border border-orange-100 rounded-lg flex items-center justify-center text-orange-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>
              </div>
              <div class="h-14 bg-neutral-50 border border-neutral-100 rounded-lg" />
              <div class="h-14 bg-neutral-50 border border-neutral-100 rounded-lg" />
            </div>
            <div class="flex items-center justify-between pt-2 border-t border-neutral-100">
              <span class="text-xs text-neutral-400 font-mono">Deploying... 98%</span>
              <span class="text-xs text-green-600 font-semibold">● Online</span>
            </div>
          </div>
        </div>
      </div>

      <!-- trusted-by bar -->
      <div class="relative z-10 border-t border-neutral-100 bg-white py-6 px-6">
        <p class="text-xs text-neutral-400 text-center mb-4 uppercase tracking-widest font-semibold">Vertrauen uns Kunden aus</p>
        <div class="flex flex-wrap items-center justify-center gap-10 grayscale opacity-40">
          <span class="text-sm font-bold tracking-tight">volleye</span>
          <span class="text-sm font-bold tracking-tight">mosti.tirol</span>
          <span class="text-sm font-bold tracking-tight">fahringermike.at</span>
          <span class="text-sm font-bold tracking-tight">Tirol</span>
          <span class="text-sm font-bold tracking-tight">Salzburg</span>
        </div>
      </div>
    </section>

    <!-- ─── SERVICES ─────────────────────────────────────────────────────── -->
    <section id="services" class="nf-section-alt py-24 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <p class="text-xs text-orange-500 font-semibold uppercase tracking-widest mb-3">// Developer First</p>
          <h2 class="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            From design to launch,<br>
            <span class="text-orange-500">we help you glow online.</span>
          </h2>
          <p class="text-neutral-500 max-w-xl mx-auto text-base">
            Alle Leistungen aus einer Hand – damit du dich auf dein Business konzentrierst.
          </p>
        </div>

        <!-- 3 service cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <div
            v-for="(svc, i) in services"
            :key="svc.title"
            class="nf-card p-6 hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between mb-4">
              <span class="text-xs text-neutral-400 font-mono uppercase tracking-widest">{{ svc.label }}</span>
              <span v-if="i === 0" class="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full font-semibold">Beliebt</span>
            </div>
            <h3 class="font-bold text-neutral-900 text-base mb-2">{{ svc.title }}</h3>
            <p class="text-sm text-neutral-500 leading-relaxed">{{ svc.description }}</p>
          </div>
        </div>

        <!-- how-it-works split card -->
        <div class="nf-card shadow-sm overflow-hidden">
          <div class="grid grid-cols-1 lg:grid-cols-2">
            <div class="p-8 border-b lg:border-b-0 lg:border-r border-neutral-100">
              <p class="text-xs text-neutral-400 font-mono uppercase tracking-widest mb-3">Starte dein Projekt</p>
              <h3 class="text-2xl font-extrabold mb-3 tracking-tight">So einfach geht's</h3>
              <p class="text-sm text-neutral-500 leading-relaxed mb-6">
                Kontaktiere uns, beschreib dein Projekt – und wir liefern. Kein langer Prozess, kein Overhead.
              </p>
              <ul class="space-y-3 text-sm text-neutral-600">
                <li class="flex items-start gap-3">
                  <span class="text-orange-500 font-bold shrink-0">01</span>
                  Kostenloses Erstgespräch & Briefing
                </li>
                <li class="flex items-start gap-3">
                  <span class="text-orange-500 font-bold shrink-0">02</span>
                  Design-Konzept & Feedback-Runde
                </li>
                <li class="flex items-start gap-3">
                  <span class="text-orange-500 font-bold shrink-0">03</span>
                  Entwicklung & Qualitätssicherung
                </li>
                <li class="flex items-start gap-3">
                  <span class="text-orange-500 font-bold shrink-0">04</span>
                  Launch 🚀 + optionaler Support
                </li>
              </ul>
            </div>
            <!-- fake terminal -->
            <div class="bg-neutral-950 p-8 font-mono text-sm">
              <div class="flex items-center gap-2 mb-5">
                <span class="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <span class="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <span class="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                <span class="text-xs text-neutral-500 ml-2">novafox / projekt-start</span>
              </div>
              <p class="text-neutral-500 mb-1"># Schreib uns einfach</p>
              <p class="text-green-400 mb-4">$ email info@novafox.at</p>
              <p class="text-neutral-500 mb-2"># Wir übernehmen:</p>
              <p class="text-white/80">→ <span class="text-orange-400">Design</span> deiner neuen Website</p>
              <p class="text-white/80">→ <span class="text-orange-400">Development</span> mit modernen Technologien</p>
              <p class="text-white/80">→ <span class="text-orange-400">Branding</span> & visuelle Identität</p>
              <p class="text-white/80">→ <span class="text-orange-400">Launch</span> & Publishing</p>
              <p class="text-green-400 mt-4 animate-pulse">█</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── CORE PRINCIPLES ──────────────────────────────────────────────── -->
    <section class="py-24 px-6 bg-white">
      <div class="max-w-6xl mx-auto">
        <div class="mb-16">
          <p class="text-xs text-orange-500 font-semibold uppercase tracking-widest mb-3">// Built to outperform</p>
          <h2 class="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Core principles,<br>
            <span class="text-orange-500">proven performance.</span>
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- bar chart card -->
          <div class="nf-card p-8">
            <div class="flex items-start gap-3 mb-6">
              <div class="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <div>
                <p class="text-xs text-neutral-400 font-mono uppercase tracking-widest mb-0.5">Keine Kompromisse</p>
                <h3 class="font-bold text-neutral-900 text-base">Individuelle Websites. Keine Templates.</h3>
                <p class="text-sm text-neutral-500 mt-1 leading-relaxed">Maßgefertigte Designs, die deine Marke unverwechselbar machen – nicht ein weiteres Template aus der Masse.</p>
              </div>
            </div>
            <div class="space-y-3">
              <div v-for="bar in [{label:'novafox',pct:91,hi:true},{label:'Template-Builder',pct:62,hi:false},{label:'DIY-Website',pct:38,hi:false}]" :key="bar.label" class="flex items-center gap-3">
                <span class="text-xs w-32 text-neutral-500 shrink-0">{{ bar.label }}</span>
                <div class="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div class="h-2 rounded-full" :class="bar.hi ? 'bg-orange-500' : 'bg-neutral-300'" :style="`width:${bar.pct}%`" />
                </div>
                <span class="text-xs font-semibold text-neutral-600 w-8 text-right">{{ bar.pct }}%</span>
              </div>
            </div>
          </div>

          <!-- timing table card -->
          <div class="nf-card p-8">
            <div class="flex items-start gap-3 mb-6">
              <div class="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <p class="text-xs text-neutral-400 font-mono uppercase tracking-widest mb-0.5">Blitzschnell</p>
                <h3 class="font-bold text-neutral-900 text-base">Ergebnisse in Wochen, nicht Monaten.</h3>
                <p class="text-sm text-neutral-500 mt-1 leading-relaxed">Effiziente Prozesse und klare Kommunikation sorgen dafür, dass dein Projekt schnell live geht.</p>
              </div>
            </div>
            <div class="border border-neutral-100 rounded-xl overflow-hidden">
              <div class="grid grid-cols-2 bg-neutral-50 border-b border-neutral-100 px-4 py-2">
                <span class="text-xs text-neutral-400 font-semibold">Phase</span>
                <span class="text-xs text-neutral-400 font-semibold text-right">Dauer</span>
              </div>
              <div v-for="(row, i) in [['Discovery & Konzept','~3 Tage'],['Design & Prototyp','~5 Tage'],['Entwicklung','~10 Tage'],['Review & Launch','~2 Tage']]" :key="i" class="grid grid-cols-2 px-4 py-2.5 border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50 transition-colors">
                <span class="text-sm text-neutral-700">{{ row[0] }}</span>
                <span class="text-sm text-neutral-500 text-right font-mono">{{ row[1] }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── WE HANDLE THE HARD STUFF ────────────────────────────────────── -->
    <section class="nf-section-alt py-24 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <p class="text-xs text-orange-500 font-semibold uppercase tracking-widest mb-3">// Zero Configuration</p>
          <h2 class="text-4xl sm:text-5xl font-extrabold tracking-tight">
            We handle the <span class="text-orange-500">hard stuff.</span>
          </h2>
          <p class="text-neutral-500 mt-4 max-w-xl mx-auto text-base">
            Du musst dich nicht um Technik kümmern. Performance, responsives Layout, SEO, Hosting – wir erledigen alles.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div
            v-for="feat in features"
            :key="feat.title"
            class="nf-card p-6 hover:shadow-md transition-shadow"
          >
            <p class="text-xs text-neutral-400 font-mono mb-2">{{ feat.subtitle }}</p>
            <h3 class="font-bold text-neutral-900 text-sm mb-2">{{ feat.title }}</h3>
            <p class="text-xs text-neutral-500 leading-relaxed">{{ feat.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── PROJECTS ─────────────────────────────────────────────────────── -->
    <section id="projects" class="py-24 px-6 bg-white">
      <div class="max-w-6xl mx-auto">
        <div class="flex items-end justify-between flex-wrap gap-4 mb-16">
          <div>
            <p class="text-xs text-orange-500 font-semibold uppercase tracking-widest mb-3">// Projekte</p>
            <h2 class="text-4xl sm:text-5xl font-extrabold tracking-tight">
              Ausgewählte<br>Arbeiten.
            </h2>
          </div>
          <p class="text-sm text-neutral-500 max-w-xs text-right">Echte Projekte, echte Kunden, echte Ergebnisse.</p>
        </div>

        <div class="flex flex-col gap-8">
          <div
            v-for="(project, i) in projects"
            :key="project.name"
            class="nf-card overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div class="grid grid-cols-1 lg:grid-cols-2">
              <div class="overflow-hidden bg-neutral-50 h-72" :class="i % 2 === 1 ? 'lg:order-2' : ''">
                <img
                  :src="project.img"
                  :alt="project.name"
                  class="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                >
              </div>
              <div class="p-8 flex flex-col justify-center" :class="i % 2 === 1 ? 'lg:order-1' : ''">
                <div class="flex flex-wrap gap-2 mb-4">
                  <span
                    v-for="tag in project.tags"
                    :key="tag"
                    class="text-xs bg-orange-50 text-orange-500 border border-orange-100 px-2.5 py-0.5 rounded-full"
                  >{{ tag }}</span>
                </div>
                <h3 class="text-xl font-extrabold mb-3 tracking-tight">{{ project.name }}</h3>
                <p class="text-neutral-500 text-sm leading-relaxed mb-5">{{ project.desc }}</p>
                <div class="flex flex-wrap gap-2 mb-6">
                  <span
                    v-for="tech in project.tech"
                    :key="tech"
                    class="text-xs bg-neutral-100 text-neutral-500 px-2.5 py-0.5 rounded-md font-mono"
                  >{{ tech }}</span>
                </div>
                <a
                  :href="project.url"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center gap-2 text-orange-500 hover:text-orange-600 text-sm font-semibold transition-colors"
                >
                  Zur Website
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── PRICING ───────────────────────────────────────────────────────── -->
    <section id="pricing" class="nf-section-alt py-24 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <p class="text-xs text-orange-500 font-semibold uppercase tracking-widest mb-3">// Transparent</p>
          <h2 class="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Flexible pricing.
          </h2>
          <p class="text-neutral-500 max-w-xl mx-auto">
            Starte mit einer klaren Investition und skaliere wenn du wächst.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            v-for="plan in pricingPlans"
            :key="plan.name"
            class="relative nf-card p-8 flex flex-col"
            :class="plan.popular ? 'ring-2 ring-orange-500 shadow-xl shadow-orange-500/10' : ''"
          >
            <div v-if="plan.popular" class="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span class="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">Beliebteste Wahl</span>
            </div>

            <div class="mb-6">
              <p class="text-sm font-semibold text-neutral-900 mb-1">{{ plan.name }}</p>
              <div class="flex items-baseline gap-1 mb-1">
                <span class="text-4xl font-extrabold tracking-tight">€{{ plan.price }}</span>
                <span class="text-neutral-400 text-sm">ab*</span>
              </div>
              <p class="text-xs text-neutral-400">{{ plan.subtitle }}</p>
            </div>

            <ul class="flex flex-col gap-3 mb-8 flex-1">
              <li
                v-for="feat in plan.features"
                :key="feat"
                class="flex items-start gap-2 text-sm text-neutral-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mt-0.5 text-orange-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                {{ feat }}
              </li>
            </ul>

            <a
              href="mailto:info@novafox.at"
              class="w-full text-center font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm"
              :class="plan.popular
                ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'"
            >
              Loslegen
            </a>
          </div>
        </div>
        <p class="text-neutral-400 text-xs text-center mt-6">* Preise können je nach Projektgröße variieren. Kontaktiere uns für ein individuelles Angebot.</p>
      </div>
    </section>

    <!-- ─── FAQ ──────────────────────────────────────────────────────────── -->
    <section id="faq" class="py-24 px-6 bg-white">
      <div class="max-w-3xl mx-auto">
        <div class="text-center mb-14">
          <p class="text-xs text-orange-500 font-semibold uppercase tracking-widest mb-3">// FAQ</p>
          <h2 class="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Frequently asked questions.
          </h2>
        </div>

        <div class="divide-y divide-neutral-100">
          <div v-for="(item, i) in faqs" :key="i" class="py-5">
            <button
              class="w-full flex items-center justify-between text-left gap-4"
              @click="openFaq = openFaq === i ? null : i"
            >
              <span class="font-semibold text-neutral-900 text-base">{{ item.q }}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-5 h-5 shrink-0 text-neutral-400 transition-transform duration-200"
                :class="openFaq === i ? 'rotate-45' : ''"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
              ><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
            </button>
            <p v-show="openFaq === i" class="text-neutral-500 text-sm leading-relaxed mt-3 pr-8">
              {{ item.a }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── FINAL CTA ─────────────────────────────────────────────────────── -->
    <section class="nf-section-alt py-24 px-6">
      <div class="max-w-2xl mx-auto text-center">
        <p class="text-xs text-orange-500 font-semibold uppercase tracking-widest mb-3">// Get started</p>
        <h2 class="text-4xl sm:text-5xl font-extrabold tracking-tight mb-5">
          Ready to build?
        </h2>
        <p class="text-neutral-500 text-base mb-10 max-w-md mx-auto leading-relaxed">
          Start getting a professional online presence for free and scale seamlessly as your project grows. No credit card needed.
        </p>
        <div class="flex flex-wrap gap-3 justify-center">
          <a
            href="mailto:info@novafox.at"
            class="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 transition-colors text-white font-semibold px-8 py-3.5 rounded-xl text-sm shadow-lg shadow-orange-500/20"
          >
            Jetzt anfragen
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </a>
          <a
            href="#pricing"
            class="inline-flex items-center gap-2 border border-neutral-200 hover:border-neutral-400 bg-white transition-colors text-neutral-700 font-semibold px-8 py-3.5 rounded-xl text-sm"
          >
            Preise ansehen
          </a>
        </div>
      </div>
    </section>

  </div>
</template>
