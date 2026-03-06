<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function onSubmit() {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Please fill in all fields.'
    return
  }
  loading.value = true
  try {
    await authStore.signIn(email.value, password.value)
  } catch {
    error.value = 'Invalid email or password.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-white nf-grid-bg flex items-center justify-center px-4">
    <div class="absolute inset-0 bg-linear-to-b from-white/0 via-white/60 to-white pointer-events-none" />

    <div class="relative z-10 w-full max-w-sm">
      <!-- Card -->
      <div class="nf-card p-8 shadow-sm">
        <div class="mb-6">
          <h1 class="text-2xl font-extrabold tracking-tight text-neutral-900 mb-1">Welcome back!</h1>
          <p class="text-sm text-neutral-500">Hey buddy. Please enter your details.</p>
        </div>

        <form @submit.prevent="onSubmit" class="flex flex-col gap-4">
          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-neutral-600 uppercase tracking-widest">Email</label>
            <input
              v-model="email"
              type="email"
              autocomplete="email"
              placeholder="you@example.com"
              class="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <label class="text-xs font-semibold text-neutral-600 uppercase tracking-widest">Password</label>
            <input
              v-model="password"
              type="password"
              autocomplete="current-password"
              placeholder="••••••••"
              class="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition"
            />
          </div>

          <p v-if="error" class="text-xs text-red-500">{{ error }}</p>

          <button
            type="submit"
            :disabled="loading"
            class="mt-1 w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 transition-colors text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-orange-500/20"
          >
            {{ loading ? 'Logging in…' : 'Log in' }}
          </button>
        </form>
      </div>

      <p class="text-center text-xs text-neutral-400 mt-6">
        © 2026 novafox. Alle Rechte vorbehalten.
      </p>
    </div>
  </div>
</template>