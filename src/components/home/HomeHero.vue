<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { vReleaseMedia } from '@/composables/useVideoPreview.js'
import { cdn, findVideo, showreel, posterAttrs, isSlowConnection, prefersReducedMotion } from '@/data/videos.js'
import AppButton from '../ui/AppButton.vue'
import VideoPlayerModal from '../ui/VideoPlayerModal.vue'

const reelVideo = findVideo(showreel.videoSlug)
// The loop's first frame once it exists, so the poster → video fade is seamless.
const poster = posterAttrs(showreel.loopPoster ? { poster: showreel.loopPoster } : reelVideo)
// Dedicated silent loop once it exists; the reel's 5s preview until then.
const loopPath = showreel.loop ?? reelVideo.preview

// ── Background loop ───────────────────────────────────────
// The poster is the LCP element. The <video> only exists after the page has loaded and gone idle,
// and never for reduced motion, data saver or slow connections.
// It fades in once the headline's last line has landed and the video can play, whichever is later.
const heroRef = ref(null)
const videoRef = ref(null)
const timecodeRef = ref(null)
const loopSrc = ref('')
const canPlay = ref(false)
const linesDone = ref(false)
const loopReady = computed(() => canPlay.value && linesDone.value)
const modalOpen = ref(false)
const lastLine = showreel.headline.length - 1

let inView = true
let observer

// ── Running timecode (HH:MM:SS:FF at 25 fps) ──────────────
// Written straight to textContent each frame, not through reactive state. It follows the loop's
// currentTime once the loop shows, and time since mount before that. Static with reduced motion.
const FPS = 25
const pad2 = (n) => String(n).padStart(2, '0')
const formatTimecode = (seconds) => {
  const frames = Math.floor(seconds * FPS)
  const s = Math.floor(frames / FPS)
  return [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60, frames % FPS].map(pad2).join(':')
}

let rafId = 0
let clockStart = 0
let clockElapsed = 0

const tick = (now) => {
  const video = videoRef.value
  const seconds = loopReady.value && video ? video.currentTime : (now - clockStart) / 1000
  if (timecodeRef.value) timecodeRef.value.textContent = formatTimecode(seconds)
  rafId = requestAnimationFrame(tick)
}

const setTicking = (on) => {
  if (on && !rafId) {
    clockStart = performance.now() - clockElapsed
    rafId = requestAnimationFrame(tick)
  } else if (!on && rafId) {
    cancelAnimationFrame(rafId)
    rafId = 0
    clockElapsed = performance.now() - clockStart
  }
}

// Loop and timecode run only while the hero is on screen, the tab is visible and the player is closed.
const syncPlayback = () => {
  const active = inView && !document.hidden && !modalOpen.value
  setTicking(active)
  const video = videoRef.value
  if (!video) return
  if (active) video.play().catch(() => {})
  else video.pause()
}

const onCanPlay = () => {
  canPlay.value = true
  syncPlayback()
}

const startLoop = () => {
  loopSrc.value = cdn(loopPath)
}

const whenIdle = () => (window.requestIdleCallback ?? ((cb) => setTimeout(cb, 200)))(startLoop)

onMounted(() => {
  if (prefersReducedMotion()) return

  observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting
    syncPlayback()
  })
  observer.observe(heroRef.value)
  document.addEventListener('visibilitychange', syncPlayback)

  if (isSlowConnection()) return
  if (document.readyState === 'complete') whenIdle()
  else window.addEventListener('load', whenIdle, { once: true })
})

onUnmounted(() => {
  window.removeEventListener('load', whenIdle)
  document.removeEventListener('visibilitychange', syncPlayback)
  observer?.disconnect()
  setTicking(false)
})

// The full showreel plays with sound in the modal; pause the loop behind it.
watch(modalOpen, syncPlayback)
</script>

<template>
  <section ref="heroRef" class="hero" aria-labelledby="hero-title">
    <div class="hero__media" aria-hidden="true">
      <img
        class="hero__poster"
        :src="poster.large"
        :srcset="poster.srcset"
        sizes="100vw"
        :width="poster.width"
        :height="poster.height"
        loading="eager"
        fetchpriority="high"
        decoding="async"
        alt=""
      />
      <video
        v-if="loopSrc"
        ref="videoRef"
        v-release-media
        class="hero__loop"
        :class="{ 'hero__loop--ready': loopReady }"
        :src="loopSrc"
        muted
        loop
        playsinline
        preload="auto"
        @canplay="onCanPlay"
        @contextmenu.prevent
      />
      <div class="hero__scrim" />
    </div>

    <div class="hero__content container">
      <p class="t-label hero__eyebrow">{{ showreel.eyebrow }}</p>
      <!-- Every line is in the DOM from the start; the mask only animates its position. -->
      <h1 id="hero-title" class="t-display-hero hero__title">
        <span
          v-for="(line, i) in showreel.headline"
          :key="line.text"
          class="hero__line"
          :style="{ '--i': i }"
        >
          <span
            class="hero__line-inner"
            :class="{ accent: line.accent }"
            @animationend="i === lastLine && (linesDone = true)"
          >{{ line.text }}</span>
        </span>
      </h1>
      <p class="t-body-large hero__intro">{{ showreel.intro }}</p>
      <div class="hero__ctas">
        <AppButton variant="primary" show-arrow @click="modalOpen = true">Watch Showreel</AppButton>
        <AppButton variant="outline" to="/contact">Start a Project</AppButton>
      </div>
    </div>

    <span ref="timecodeRef" class="t-mono hero__timecode" aria-hidden="true">00:00:00:00</span>

    <div class="hero__corners t-mono">
      <p><b>{{ showreel.hud.left }}</b></p>
      <p class="hero__corner-r"><b>{{ showreel.hud.right }}</b></p>
    </div>

    <VideoPlayerModal v-model:open="modalOpen" :video="reelVideo" />
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100svh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  padding: calc(var(--nav-h) + var(--space-08)) var(--gutter) var(--space-10);
  overflow: hidden;
  isolation: isolate;
  background: var(--bg);
}

/* ── Media ── */
.hero__media {
  position: absolute;
  inset: 0;
  z-index: -1;
}

.hero__poster,
.hero__loop {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero__loop {
  opacity: 0;
  transition: opacity var(--dur-slow) var(--ease-out-expo);
}

.hero__loop--ready {
  opacity: 1;
}

.hero__scrim {
  position: absolute;
  inset: 0;
  background: var(--overlay);
}

/* ── Content ── */
.hero__eyebrow {
  margin: 0 0 var(--space-05);
}

.hero__title {
  line-height: 0.95;
}

/* Each line slides up out of its own mask */
.hero__line {
  display: block;
  overflow: hidden;
}

.hero__line-inner {
  display: block;
  animation: hero-line var(--dur-slow) var(--ease-out-expo) both;
  animation-delay: calc(var(--dur-fast) + var(--i) * var(--dur-stagger));
}

@keyframes hero-line {
  from {
    transform: translateY(105%);
  }
  to {
    transform: translateY(0);
  }
}

.hero__intro {
  max-width: 44ch;
  margin-top: var(--space-06);
}

.hero__ctas {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-04);
  margin-top: var(--space-07);
}

/* ── Running timecode, top right ── */
.hero__timecode {
  position: absolute;
  top: calc(var(--nav-h) + var(--space-05));
  right: var(--gutter);
  color: var(--text-dim);
  font-variant-numeric: tabular-nums;
}

/* ── Bottom corners (wrap onto two lines on narrow phones) ── */
.hero__corners {
  position: absolute;
  left: var(--gutter);
  right: var(--gutter);
  bottom: var(--space-06);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  column-gap: var(--space-05);
}

.hero__corners p {
  margin: 0;
}

.hero__corner-r {
  margin-left: auto;
  text-align: right;
}

@media (max-width: 639px) {
  .hero__ctas > * {
    flex: 1 1 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__line-inner {
    animation: none;
  }
}
</style>
