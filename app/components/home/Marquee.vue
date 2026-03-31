<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'

const trackRef = ref<HTMLElement>()
let tween: gsap.core.Tween | null = null

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
})

onBeforeUnmount(() => {
  tween?.kill()
})
</script>

<template>
  <div class="marquee-root">
    <div ref="trackRef" class="marquee-inner">
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
  will-change: transform;
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
