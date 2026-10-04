<script setup>
import { ref, computed } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal.js'
import { useVideoPreview, stopPreview, vReleaseMedia } from '@/composables/useVideoPreview.js'
import { videos, categoryOrder, showreel, posterAttrs, pickSource, formatDuration } from '@/data/videos.js'
import SectionHeader from '../ui/SectionHeader.vue'
import VideoCard from '../ui/VideoCard.vue'
import VideoPlayerModal from '../ui/VideoPlayerModal.vue'
import Rule from '../ui/Rule.vue'

useScrollReveal('.videography-section .reveal')

// Sets up in-view previews on touch devices; cards handle hover themselves.
useVideoPreview('.video-card[data-id]')

const reelVideo = videos.find(v => v.id === showreel.videoId)
const reelPoster = posterAttrs(reelVideo)
const reelCaption = `${reelVideo.category} · ${reelVideo.tag.split('·')[0].trim()} · Showreel`

const gridSizes = {
  landscape: '(max-width: 639px) 100vw, (max-width: 899px) 50vw, 58vw',
  portrait: '(max-width: 639px) 50vw, (max-width: 899px) 33vw, 25vw',
}

// Each category is split into a landscape and a portrait grid so vertical
// videos keep their 9:16 shape instead of being letterboxed.
const groupedVideos = computed(() => {
  const map = {}
  for (const v of videos) {
    if (!map[v.category]) map[v.category] = []
    map[v.category].push(v)
  }
  return categoryOrder.filter(c => map[c]).map(c => ({
    category: c,
    count: map[c].length,
    grids: ['landscape', 'portrait']
      .map(orientation => ({ orientation, items: map[c].filter(v => v.orientation === orientation) }))
      .filter(g => g.items.length),
  }))
})

// ── Showreel (inline) ─────────────────────────────────────
// No <video> exists until the visitor clicks.
const reelPlaying = ref(false)
const reelBuffering = ref(false)
const reelSrc = ref('')

const playReel = () => {
  if (reelPlaying.value) return
  stopPreview()
  reelSrc.value = pickSource(reelVideo)
  reelPlaying.value = true
  reelBuffering.value = true
}

// ── Cards → modal ─────────────────────────────────────────
const modalOpen = ref(false)
const modalVideo = ref(null)

const openVideo = (video) => {
  stopPreview()
  reelPlaying.value = false
  modalVideo.value = video
  modalOpen.value = true
}
</script>

<template>
  <section id="videography" class="section videography-section">
    <div class="container">
      <SectionHeader
        class="reveal"
        number="02"
        eyebrow="Work"
        title="Selected Work"
        accent="Work"
        intro="Motion pictures that move people. Each film crafted with intention — from pre-production to the final color grade."
      />

      <!-- Showreel player: bleeds to the container edges -->
      <figure class="vs__reel reveal">
        <div class="vs__player" @click="playReel">
          <img
            v-if="!reelPlaying"
            class="vs__poster"
            :src="reelPoster.large"
            :srcset="reelPoster.srcset"
            sizes="(max-width: 1280px) 100vw, 1280px"
            :width="reelPoster.width"
            :height="reelPoster.height"
            fetchpriority="high"
            decoding="async"
            alt=""
          />

          <div v-if="!reelPlaying" class="vs__hud-top" aria-hidden="true">
            <div>
              <b>{{ showreel.hud.left }}</b>
              {{ showreel.hud.leftSub }}
            </div>
            <div class="vs__hud-right">
              <b>{{ showreel.hud.right }}</b>
              {{ showreel.hud.rightSub }}
            </div>
          </div>

          <Transition name="fade">
            <div v-if="!reelPlaying" class="vs__cover">
              <button class="vs__play-btn" aria-label="Play showreel" @click.stop="playReel">
                <span class="vs__triangle" aria-hidden="true" />
              </button>
              <span class="vs__play-label">Watch Showreel</span>
            </div>
          </Transition>

          <Transition name="fade">
            <video
              v-if="reelPlaying"
              v-release-media
              class="vs__video"
              :src="reelSrc"
              :poster="reelPoster.large"
              autoplay
              controls
              playsinline
              @waiting="reelBuffering = true"
              @playing="reelBuffering = false"
              @canplay="reelBuffering = false"
            />
          </Transition>

          <Transition name="fade">
            <div v-if="reelPlaying && reelBuffering" class="vs__buffering" aria-label="Loading video">
              <span class="vs__spinner" aria-hidden="true" />
            </div>
          </Transition>

          <div v-if="!reelPlaying" class="vs__hud-bottom" aria-hidden="true">
            <h3 class="vs__reel-title">{{ showreel.title }}</h3>
          </div>
        </div>
        <figcaption class="vs__caption">
          <span>{{ reelCaption }}</span>
          <span>{{ showreel.meta }} · {{ formatDuration(reelVideo.duration) }}</span>
        </figcaption>
      </figure>

      <!-- Video cards grouped by category -->
      <div v-for="group in groupedVideos" :key="group.category" class="vs__group reveal">
        <div class="vs__group-header">
          <span class="vs__group-label">{{ group.category }}</span>
          <span class="vs__group-count">{{ String(group.count).padStart(2, '0') }}</span>
        </div>
        <Rule />
        <div
          v-for="grid in group.grids"
          :key="grid.orientation"
          class="vs__grid grid-12"
          :class="`vs__grid--${grid.orientation}`"
        >
          <VideoCard
            v-for="video in grid.items"
            :key="video.id"
            :video="video"
            :sizes="gridSizes[grid.orientation]"
            @play="openVideo"
          />
        </div>
      </div>

      <!-- Footer -->
      <div class="vs__foot reveal">
        <Rule />
        <p class="vs__count">
          <b>{{ String(videos.length).padStart(2, '0') }}</b> films
        </p>
      </div>
    </div>

    <VideoPlayerModal v-model:open="modalOpen" :video="modalVideo" />
  </section>
</template>

<style scoped>
/* ─── Transitions ──────────────────────────────────────────── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--dur-base) var(--ease-out-expo);
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ─── Showreel player ──────────────────────────────────────── */
.vs__reel {
  margin: 0;
}

.vs__player {
  position: relative;
  aspect-ratio: 16 / 9;
  background: var(--surface);
  overflow: hidden;
  isolation: isolate;
  cursor: pointer;
}

.vs__poster,
.vs__video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.vs__video {
  object-fit: contain;
  background: var(--bg);
  z-index: 2;
}

.vs__caption {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--space-02) var(--space-05);
  margin-top: var(--space-04);
  font-family: var(--mono);
  font-size: var(--fs-caption);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
}

/* HUD overlays (labels sit on solid plates, not gradients) */
.vs__hud-top,
.vs__hud-bottom {
  position: absolute;
  left: var(--space-04);
  right: var(--space-04);
  z-index: 3;
  display: flex;
  justify-content: space-between;
  pointer-events: none;
}

.vs__hud-top {
  top: var(--space-04);
  align-items: flex-start;
  font-family: var(--mono);
  font-size: var(--fs-caption);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-dim);
  line-height: 1.6;
}

.vs__hud-top > div {
  background: var(--overlay);
  padding: var(--space-02) var(--space-03);
}

.vs__hud-top b {
  display: block;
  color: var(--gold);
  font-weight: 500;
}

.vs__hud-right {
  text-align: right;
}

.vs__hud-bottom {
  bottom: var(--space-04);
  align-items: flex-end;
}

.vs__reel-title {
  font-family: var(--serif);
  font-weight: 400;
  font-size: var(--fs-h3);
  line-height: 1;
  color: var(--text);
  margin: 0;
  background: var(--overlay);
  padding: var(--space-02) var(--space-03);
}

/* Play cover */
.vs__cover {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-04);
}

.vs__play-btn {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 1px solid var(--gold);
  background: var(--overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color var(--dur-base) var(--ease-out-expo);
}

.vs__play-btn:hover {
  background: var(--gold);
}

.vs__play-btn:hover .vs__triangle {
  border-left-color: var(--bg);
}

.vs__triangle {
  width: 0;
  height: 0;
  border-left: 18px solid var(--gold);
  border-top: 11px solid transparent;
  border-bottom: 11px solid transparent;
  margin-left: 5px;
}

.vs__play-label {
  font-family: var(--mono);
  font-weight: 500;
  font-size: var(--fs-caption);
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--gold);
  line-height: 1;
  background: var(--overlay);
  padding: var(--space-02) var(--space-03);
}

/* Buffering spinner */
.vs__buffering {
  position: absolute;
  inset: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.vs__spinner {
  width: 36px;
  height: 36px;
  border: 1px solid var(--gold-dim);
  border-top-color: var(--gold);
  border-radius: 50%;
  animation: vs-spin var(--dur-slow) var(--ease-linear) infinite;
}

@keyframes vs-spin {
  to { transform: rotate(360deg); }
}

/* ─── Category groups ──────────────────────────────────────── */
.vs__group {
  margin-top: var(--space-09);
}

.vs__group-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding-bottom: var(--space-04);
}

.vs__group-label {
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--gold);
}

.vs__group-count {
  font-family: var(--mono);
  font-size: var(--fs-label);
  color: var(--muted);
}

/* ─── Video grids (12 columns) ─────────────────────────────── */
.vs__grid {
  row-gap: var(--space-07);
  margin-top: var(--space-06);
}

/* Portrait: two-up on phones */
.vs__grid--portrait {
  align-items: end;
}

.vs__grid--portrait > * {
  grid-column: span 6;
}

@media (min-width: 640px) {
  .vs__grid--landscape > * {
    grid-column: span 6;
  }

  /* Tablet: 5 + 4 columns, leaving a 3-column gutter of air on each row */
  .vs__grid--portrait > :nth-child(odd) {
    grid-column: 1 / span 5;
  }

  .vs__grid--portrait > :nth-child(even) {
    grid-column: 7 / span 4;
  }
}

/* Desktop: landscape cards alternate 7/5 and 5/7 for an asymmetric rhythm */
@media (min-width: 900px) {
  .vs__grid--landscape > :nth-child(4n + 1),
  .vs__grid--landscape > :nth-child(4n + 4) {
    grid-column: span 7;
  }

  .vs__grid--landscape > :nth-child(4n + 2),
  .vs__grid--landscape > :nth-child(4n + 3) {
    grid-column: span 5;
  }

  /* A lone last card sits on the first 7 columns */
  .vs__grid--landscape > :last-child:nth-child(4n + 1) {
    grid-column: 1 / 8;
  }

  /* Portrait rows step down 4 / 3 / 3 columns with a 2-column offset at the end */
  .vs__grid--portrait > :nth-child(3n + 1) {
    grid-column: 1 / span 4;
  }

  .vs__grid--portrait > :nth-child(3n + 2) {
    grid-column: 6 / span 3;
  }

  .vs__grid--portrait > :nth-child(3n + 3) {
    grid-column: 10 / span 3;
  }
}

/* HUD labels crowd the player on phones */
@media (max-width: 639px) {
  .vs__hud-top,
  .vs__play-label {
    display: none;
  }
}

/* ─── Footer ───────────────────────────────────────────────── */
.vs__foot {
  margin-top: var(--space-09);
}

.vs__count {
  font-family: var(--mono);
  font-size: var(--fs-caption);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
  margin: var(--space-04) 0 0;
}

.vs__count b {
  color: var(--gold);
  font-weight: 500;
}

@media (min-width: 900px) {
  .vs__hud-top,
  .vs__hud-bottom {
    left: var(--space-05);
    right: var(--space-05);
  }

  .vs__hud-top {
    top: var(--space-05);
  }

  .vs__hud-bottom {
    bottom: var(--space-05);
  }

  .vs__play-btn {
    width: 80px;
    height: 80px;
  }

  .vs__triangle {
    border-left-width: 22px;
    border-top-width: 14px;
    border-bottom-width: 14px;
    margin-left: 6px;
  }
}
</style>
