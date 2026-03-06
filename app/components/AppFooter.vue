<script setup lang="ts">
</script>

<template>
  <footer class="bg-white border-t border-neutral-100 pt-16 pb-8 px-6">
    <div class="max-w-6xl mx-auto">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">
        <!-- Brand -->
        <div class="lg:col-span-2">
          <p class="font-bold text-xl mb-3 text-neutral-900">
            <span class="text-orange-500">novafox</span>
          </p>
          <p class="text-neutral-500 text-sm leading-relaxed max-w-xs">
            Professionelle Web Design und Development Dienstleistungen. Wir verwandeln Besucher in Kunden.
          </p>
          <a
            href="mailto:info@novafox.at"
            class="inline-flex items-center gap-2 mt-5 text-sm text-orange-500 hover:text-orange-400 transition-colors"
          >
            info@novafox.at
          </a>
        </div>

        <!-- Overview -->
        <div>
          <p class="text-xs text-neutral-400 uppercase tracking-widest font-semibold mb-4">Übersicht</p>
          <ul class="flex flex-col gap-3">
            <li><a href="#" class="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Home</a></li>
            <li><a href="#services" class="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Leistungen</a></li>
            <li><a href="#projects" class="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Projekte</a></li>
            <li><a href="#pricing" class="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Preise</a></li>
          </ul>
        </div>

        <!-- Company -->
        <div>
          <p class="text-xs text-neutral-400 uppercase tracking-widest font-semibold mb-4">Unternehmen</p>
          <ul class="flex flex-col gap-3">
            <li><NuxtLink to="/de/agb" class="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">AGB</NuxtLink></li>
            <li><NuxtLink to="/de/impressum" class="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Impressum</NuxtLink></li>
            <li><NuxtLink to="/de/datenschutz" class="text-sm text-neutral-500 hover:text-neutral-900 transition-colors">Datenschutz</NuxtLink></li>
          </ul>
          <div class="flex gap-4 mt-6">
            <a href="https://www.instagram.com/novafox.at/" target="_blank" rel="noopener" aria-label="Instagram" class="text-neutral-400 hover:text-orange-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
