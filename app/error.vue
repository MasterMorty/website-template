<script setup lang="ts">
import type { NuxtError } from "#app";
import { motion } from "motion-v";

const props = defineProps({
  error: {
    type: Object as PropType<NuxtError>,
    required: true,
  },
});

useHead({
  htmlAttrs: {
    lang: "en",
  },
});

useSeoMeta({
  title: `${props.error.statusCode} — novafox`,
  description:
    props.error.statusCode === 404
      ? "This page could not be found."
      : "Something went wrong.",
});

const handleGoBack = () => clearError({ redirect: "/" });

const is404 = computed(() => props.error.statusCode === 404);
</script>

<template>
  <div class="error-page">
    <!-- Floating sparkles -->
    <motion.div
      class="sparkle sparkle--1"
      :initial="{ opacity: 0, scale: 0, rotate: -90 }"
      :animate="{ opacity: 0.08, scale: 1, rotate: 0 }"
      :transition="{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }"
    >
      <svg viewBox="0 0 46 46" fill="currentColor">
        <path
          d="M23 46C24.4999 46 25.7292 44.8969 25.9374 43.3357C27.9999 29.4317 29.896 27.4959 43.2708 25.9765C44.8126 25.789 46 24.4987 46 23C46 21.4806 44.8333 20.2317 43.2918 20.0028C30.0001 18.1502 28.3541 16.5267 25.9374 2.64345C25.6666 1.10317 24.4792 0 23 0C21.4791 0 20.2708 1.10317 20.0209 2.66426C18.0001 16.5476 16.104 18.4834 2.75 20.0028C1.16668 20.211 0 21.4599 0 23C0 24.4987 1.12499 25.7476 2.70834 25.9765C16.0209 27.8705 17.6459 29.4733 20.0209 43.3564C20.3334 44.9176 21.5418 46 23 46Z"
        />
      </svg>
    </motion.div>
    <motion.div
      class="sparkle sparkle--2"
      :initial="{ opacity: 0, scale: 0, rotate: 90 }"
      :animate="{ opacity: 0.06, scale: 1, rotate: 0 }"
      :transition="{ duration: 1.4, delay: 0.9, ease: [0.16, 1, 0.3, 1] }"
    >
      <svg viewBox="0 0 46 46" fill="currentColor">
        <path
          d="M23 46C24.4999 46 25.7292 44.8969 25.9374 43.3357C27.9999 29.4317 29.896 27.4959 43.2708 25.9765C44.8126 25.789 46 24.4987 46 23C46 21.4806 44.8333 20.2317 43.2918 20.0028C30.0001 18.1502 28.3541 16.5267 25.9374 2.64345C25.6666 1.10317 24.4792 0 23 0C21.4791 0 20.2708 1.10317 20.0209 2.66426C18.0001 16.5476 16.104 18.4834 2.75 20.0028C1.16668 20.211 0 21.4599 0 23C0 24.4987 1.12499 25.7476 2.70834 25.9765C16.0209 27.8705 17.6459 29.4733 20.0209 43.3564C20.3334 44.9176 21.5418 46 23 46Z"
        />
      </svg>
    </motion.div>
    <motion.div
      class="sparkle sparkle--3"
      :initial="{ opacity: 0, scale: 0, rotate: -45 }"
      :animate="{ opacity: 0.05, scale: 1, rotate: 0 }"
      :transition="{ duration: 1, delay: 1.2, ease: [0.16, 1, 0.3, 1] }"
    >
      <svg viewBox="0 0 46 46" fill="currentColor">
        <path
          d="M23 46C24.4999 46 25.7292 44.8969 25.9374 43.3357C27.9999 29.4317 29.896 27.4959 43.2708 25.9765C44.8126 25.789 46 24.4987 46 23C46 21.4806 44.8333 20.2317 43.2918 20.0028C30.0001 18.1502 28.3541 16.5267 25.9374 2.64345C25.6666 1.10317 24.4792 0 23 0C21.4791 0 20.2708 1.10317 20.0209 2.66426C18.0001 16.5476 16.104 18.4834 2.75 20.0028C1.16668 20.211 0 21.4599 0 23C0 24.4987 1.12499 25.7476 2.70834 25.9765C16.0209 27.8705 17.6459 29.4733 20.0209 43.3564C20.3334 44.9176 21.5418 46 23 46Z"
        />
      </svg>
    </motion.div>

    <!-- Content -->
    <div class="error-content">
      <!-- Logo -->
      <motion.a
        href="/"
        class="error-logo"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }"
      >
        <div class="error-logo-pill">
          <img
            src="/images/svg/novafox-logo-bw.svg"
            alt="novafox logo"
            class="error-logo-img"
          >
          <span>novafox</span>
        </div>
      </motion.a>

      <!-- Status code -->
      <motion.div
        class="error-code-wrap"
        :initial="{ opacity: 0, scale: 0.9, y: 30 }"
        :animate="{ opacity: 1, scale: 1, y: 0 }"
        :transition="{ delay: 0.25, duration: 1, ease: [0.16, 1, 0.3, 1] }"
      >
        <span class="error-code">{{ error.statusCode }}</span>
      </motion.div>

      <!-- Center sparkle -->
      <motion.div
        class="error-center-sparkle"
        :initial="{ opacity: 0, scale: 0, rotate: -180 }"
        :animate="{ opacity: 1, scale: 1, rotate: 0 }"
        :transition="{
          delay: 0.5,
          duration: 1.2,
          ease: [0.16, 1, 0.3, 1],
        }"
      >
        <svg viewBox="0 0 46 46" fill="currentColor" class="error-center-sparkle-svg">
          <path
            d="M23 46C24.4999 46 25.7292 44.8969 25.9374 43.3357C27.9999 29.4317 29.896 27.4959 43.2708 25.9765C44.8126 25.789 46 24.4987 46 23C46 21.4806 44.8333 20.2317 43.2918 20.0028C30.0001 18.1502 28.3541 16.5267 25.9374 2.64345C25.6666 1.10317 24.4792 0 23 0C21.4791 0 20.2708 1.10317 20.0209 2.66426C18.0001 16.5476 16.104 18.4834 2.75 20.0028C1.16668 20.211 0 21.4599 0 23C0 24.4987 1.12499 25.7476 2.70834 25.9765C16.0209 27.8705 17.6459 29.4733 20.0209 43.3564C20.3334 44.9176 21.5418 46 23 46Z"
          />
        </svg>
      </motion.div>

      <!-- Message -->
      <motion.p
        class="error-message"
        :initial="{ opacity: 0, y: 16 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ delay: 0.55, duration: 0.8, ease: [0.16, 1, 0.3, 1] }"
      >
        {{ is404 ? 'This page could not be found.' : (error.message || 'Something went wrong.') }}
      </motion.p>

      <!-- Button -->
      <motion.button
        class="error-button"
        :initial="{ opacity: 0, y: 16 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }"
        @click="handleGoBack"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="error-button-icon"
          aria-hidden="true"
        >
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
        <span>Back to home</span>
      </motion.button>
    </div>

    <!-- Footer -->
    <motion.div
      class="error-footer"
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :transition="{ delay: 0.9, duration: 0.6 }"
    >
      <p>&copy; {{ new Date().getFullYear() }} novafox</p>
    </motion.div>
  </div>
</template>

<style scoped>
.error-page {
  background: #fafaf8;
  color: #404040;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 2rem 1rem;
}

/* Floating sparkle decorations */
.sparkle {
  position: absolute;
  color: #171717;
  pointer-events: none;
}

.sparkle--1 {
  top: 12%;
  right: 8%;
  width: clamp(80px, 12vw, 180px);
}

.sparkle--2 {
  bottom: 18%;
  left: 6%;
  width: clamp(50px, 8vw, 120px);
}

.sparkle--3 {
  top: 28%;
  left: 14%;
  width: clamp(30px, 4vw, 60px);
}

/* Content */
.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  position: relative;
  z-index: 1;
}

/* Logo */
.error-logo {
  text-decoration: none;
  color: white;
  margin-bottom: 3rem;
}

.error-logo-pill {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #171717;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-weight: 500;
  font-size: clamp(14px, 1.2vw, 18px);
}

.error-logo-img {
  height: 0.75rem;
  width: auto;
  object-fit: contain;
}

/* Status code */
.error-code-wrap {
  line-height: 1;
  margin-bottom: 1rem;
}

.error-code {
  font-size: clamp(7rem, 20vw, 16rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  color: #0a0a0a;
  line-height: 0.85;
}

/* Center sparkle */
.error-center-sparkle {
  margin-bottom: 1.5rem;
}

.error-center-sparkle-svg {
  width: clamp(18px, 2.5vw, 32px);
  height: auto;
  color: #171717;
}

/* Message */
.error-message {
  font-size: clamp(14px, 1.2vw, 18px);
  text-align: center;
  max-width: 28rem;
  line-height: 1.6;
  margin-bottom: 2.5rem;
}

/* Button */
.error-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #171717;
  color: white;
  padding: 0.625rem 1.5rem;
  border-radius: 9999px;
  border: none;
  font-size: clamp(13px, 1vw, 16px);
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              background 0.3s ease;
}

.error-button:hover {
  transform: scale(1.04);
  background: #2a2a2a;
}

.error-button:active {
  transform: scale(0.97);
}

.error-button-icon {
  width: 1em;
  height: 1em;
}

/* Footer */
.error-footer {
  position: absolute;
  bottom: 1.5rem;
  font-size: 0.75rem;
  color: #a0a09a;
}
</style>
