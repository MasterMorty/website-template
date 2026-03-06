<template>
  <header class="sticky top-0 z-50 w-full backdrop-blur-md bg-white/90 border-b border-neutral-200">
    <div class="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-6">
      <!-- Logo -->
      <NuxtLink to="/" class="font-bold text-base tracking-tight text-neutral-900 flex items-center gap-0.5 shrink-0">
        <span class="text-orange-500">novafox</span>
      </NuxtLink>

      <!-- Nav -->
      <nav class="hidden md:flex items-center gap-7 flex-1 justify-center">
        <a href="#services" class="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Leistungen</a>
        <a href="#projects" class="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Projekte</a>
        <a href="#pricing" class="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Preise</a>
        <a href="#faq" class="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">FAQ</a>
      </nav>

      <!-- CTA -->
      <div class="flex items-center gap-3 shrink-0">
        <a href="/hub" class="hidden sm:block text-sm text-neutral-500 hover:text-neutral-900 transition-colors">
          Login
        </a>
        <a
          href="mailto:info@novafox.at"
          class="inline-flex items-center bg-orange-500 hover:bg-orange-600 transition-colors text-white font-semibold text-sm px-4 py-1.5 rounded-lg"
        >
          Jetzt anfragen
        </a>
      </div>
    </div>
  </header>
</template>
