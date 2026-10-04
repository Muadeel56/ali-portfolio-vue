<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { loadGsap } from '@/composables/useMotion.js'

// A small gold ring that follows the pointer (alongside the system cursor). Over [data-cursor]
// targets it grows into a labelled disc (PLAY on films, DRAG on the grading slider) and the
// system cursor hides there only. Fine pointers only; never with reduced motion.
const LABELS = { play: 'Play', drag: 'Drag' }

const enabled = ref(false)
const cursorRef = ref(null)
const label = ref('')
const visible = ref(false)

let moveX
let moveY
let fine
let reduced

const onMove = (e) => {
  if (e.pointerType !== 'mouse') return
  moveX?.(e.clientX)
  moveY?.(e.clientY)
  visible.value = true
  const target = e.target.closest?.('[data-cursor]')
  label.value = target ? (LABELS[target.dataset.cursor] ?? '') : ''
}

const onLeave = () => {
  visible.value = false
}

const start = async () => {
  if (enabled.value) return
  const { gsap } = await loadGsap()
  enabled.value = true
  document.documentElement.classList.add('has-cursor')
  // Wait one frame so the ring exists before quickTo binds to it
  requestAnimationFrame(() => {
    if (!cursorRef.value) return
    moveX = gsap.quickTo(cursorRef.value, 'x', { duration: 0.35, ease: 'power3.out' })
    moveY = gsap.quickTo(cursorRef.value, 'y', { duration: 0.35, ease: 'power3.out' })
  })
  window.addEventListener('pointermove', onMove, { passive: true })
  document.documentElement.addEventListener('pointerleave', onLeave)
}

const stop = () => {
  enabled.value = false
  visible.value = false
  moveX = moveY = null
  document.documentElement.classList.remove('has-cursor')
  window.removeEventListener('pointermove', onMove)
  document.documentElement.removeEventListener('pointerleave', onLeave)
}

const sync = () => (fine.matches && !reduced.matches ? start() : stop())

onMounted(() => {
  fine = matchMedia('(hover: hover) and (pointer: fine)')
  reduced = matchMedia('(prefers-reduced-motion: reduce)')
  fine.addEventListener('change', sync)
  reduced.addEventListener('change', sync)
  sync()
})

onUnmounted(() => {
  fine?.removeEventListener('change', sync)
  reduced?.removeEventListener('change', sync)
  stop()
})
</script>

<template>
  <div
    v-if="enabled"
    ref="cursorRef"
    class="app-cursor"
    :class="{ 'is-visible': visible, 'is-labelled': label }"
    aria-hidden="true"
  >
    <span class="app-cursor__ring" />
    <span class="app-cursor__disc">
      <span class="app-cursor__label">{{ label }}</span>
    </span>
  </div>
</template>

<style scoped>
/* The outer box only moves (x/y from GSAP); the ring and the disc sit centred on it */
.app-cursor {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 300;
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--dur-fast) var(--ease-out-expo);
}

.app-cursor.is-visible {
  opacity: 1;
}

.app-cursor__ring,
.app-cursor__disc {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.app-cursor__ring {
  width: var(--cursor-ring);
  height: var(--cursor-ring);
  border: 1px solid var(--gold);
  transition: opacity var(--dur-fast) var(--ease-out-expo);
}

.app-cursor__disc {
  width: var(--cursor-disc);
  height: var(--cursor-disc);
  display: grid;
  place-items: center;
  background: var(--gold);
  transform: translate(-50%, -50%) scale(0);
  transition: transform var(--dur-base) var(--ease-out-expo);
}

.is-labelled .app-cursor__ring {
  opacity: 0;
}

.is-labelled .app-cursor__disc {
  transform: translate(-50%, -50%) scale(1);
}

.app-cursor__label {
  font-family: var(--mono);
  font-weight: 500;
  font-size: var(--fs-caption);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--bg);
}
</style>

<!-- Unscoped: the state class lives on <html> (set by VideoPlayerModal) -->
<style>
/* Hidden while the player is open */
html.is-modal-open .app-cursor.is-visible {
  opacity: 0;
}
</style>
