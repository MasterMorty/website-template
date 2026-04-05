<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'

const rootRef = ref<HTMLElement>()
const trackRef = ref<HTMLElement>()
const isVisible = ref(false)
let tween: gsap.core.Tween | null = null
let observer: IntersectionObserver | null = null

const baseItems = [
  'Web Design', '·', 'Development', '·', 'Branding', '·',
  'Motion', '·', 'UI/UX', '·', 'novafox', '·',
]

onMounted(() => {
  if (!trackRef.value) return

  const track = trackRef.value
  const firstSet = track.querySelector('.marquee-set') as HTMLElement
  if (!firstSet) return

  const setWidth = firstSet.offsetWidth

  tween = gsap.to(track, {
    x: -setWidth,
    duration: 20,
    ease: 'none',
    repeat: -1,
    modifiers: {
      x: gsap.utils.unitize((x: string) => parseFloat(x) % setWidth),
    },
  })

  // Pause when off-screen to save CPU/GPU
  if (rootRef.value) {
    observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.value = entry!.isIntersecting
        if (entry!.isIntersecting) {
          tween?.resume()
        } else {
          tween?.pause()
        }
      },
      { threshold: 0 },
    )
    observer.observe(rootRef.value)
  }
})

onBeforeUnmount(() => {
  tween?.kill()
  observer?.disconnect()
})
</script>

<template>
  <div ref="rootRef" class="marquee-root">
    <div ref="trackRef" class="marquee-inner" :class="{ 'will-change-transform': isVisible }">
      <div v-for="copy in 3" :key="copy" class="marquee-set">
        <span v-for="(item, i) in baseItems" :key="i" class="marquee-item" :class="{ 'marquee-item--dot': item === '·' }">{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.marquee-root {
  overflow: hidden;
  border-top: 1px solid #e5e5e0;
  border-bottom: 1px solid #e5e5e0;
  padding: 1rem 0;
  background: #fafaf8;
}

.marquee-inner {
  display: flex;
  white-space: nowrap;
  width: max-content;
}

.marquee-set {
  display: flex;
  flex-shrink: 0;
}

.marquee-item {
  font-size: clamp(0.8rem, 1.3vw, 1.1rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 0 1.5rem;
  color: #0a0a0a;
}

.marquee-item--dot {
  color: #f97316;
  padding: 0 0.2rem;
}
</style>
