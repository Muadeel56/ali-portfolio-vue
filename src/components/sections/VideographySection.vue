<script setup>
import { ref, computed, nextTick } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal.js'
import { useVideoPreview, stopPreview, vReleaseMedia } from '@/composables/useVideoPreview.js'
import { videos, categoryOrder, showreel, cdn, posterAttrs, pickSource, formatDuration } from '@/data/videos.js'
import SectionLabel from '../ui/SectionLabel.vue'

useScrollReveal('.videography-section .reveal')

const { activePreviewId, onEnter, onLeave } = useVideoPreview('.vs__card[data-id]')

const reelVideo = videos.find(v => v.id === showreel.videoId)
const reelPoster = posterAttrs(reelVideo)

const gridSizes = {
  landscape: '(max-width: 639px) 100vw, (max-width: 767px) 50vw, 33vw',
  portrait: '(max-width: 767px) 50vw, (max-width: 1099px) 25vw, 20vw',
}

// Each category is split into a landscape and a portrait grid so vertical
// videos keep their 9:16 shape instead of being letterboxed.
const groupedVideos = computed(() => {
  const map = {}
  for (const v of videos) {
    if (!map[v.category]) map[v.category] = []
    map[v.category].push({ ...v, thumb: posterAttrs(v) })
  }
  return categoryOrder.filter(c => map[c]).map(c => ({
    category: c,
    count: map[c].length,
    grids: ['landscape', 'portrait']
      .map(orientation => ({ orientation, items: map[c].filter(v => v.orientation === orientation) }))
      .filter(g => g.items.length),
  }))
})

// ── Player ────────────────────────────────────────────────
// No <video> exists until the visitor clicks; each video gets its own element
// (keyed by id) so switching tears down the previous download.
const playerRef = ref(null)
const isPlaying = ref(false)
const isBuffering = ref(false)
const activeVideo = ref(null)
const activeSrc = ref('')

const play = (video) => {
  stopPreview()
  activeVideo.value = video
  activeSrc.value = pickSource(video)
  isPlaying.value = true
  isBuffering.value = true
  nextTick(() => {
    playerRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}
</script>

<template>
  <section id="videography" class="section videography-section">
    <div class="container">

      <!-- Header -->
      <div class="vs__head reveal">
        <div>
          <SectionLabel text="Work" />
          <h2 class="vs__heading">Selected Work</h2>
        </div>
        <div class="vs__head-right">
          <p class="vs__sub">Motion pictures that move people. Each film crafted with intention — from pre-production to the final color grade.</p>
        </div>
      </div>

      <!-- Showreel player -->
      <div
        ref="playerRef"
        class="vs__player reveal"
        :class="{ 'vs__player--portrait': isPlaying && activeVideo.orientation === 'portrait' }"
        @click="!isPlaying && play(reelVideo)"
      >
        <span class="vs__corner vs__corner--tl" aria-hidden="true" />
        <span class="vs__corner vs__corner--br" aria-hidden="true" />

        <!-- Showreel poster (pre-play) -->
        <img
          v-if="!isPlaying"
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

        <!-- HUD top -->
        <div class="vs__hud-top" aria-hidden="true">
          <div class="vs__hud-left">
            <b>{{ showreel.hud.left }}</b>
            {{ showreel.hud.leftSub }}
          </div>
          <div class="vs__hud-right">
            <b>{{ showreel.hud.right }}</b>
            {{ showreel.hud.rightSub }}
          </div>
        </div>

        <!-- Cover (pre-play) -->
        <Transition name="fade">
          <div v-if="!isPlaying" class="vs__cover">
            <button class="vs__play-btn" aria-label="Play showreel" @click.stop="play(reelVideo)">
              <span class="vs__triangle" aria-hidden="true" />
            </button>
            <span class="vs__play-label">Watch Showreel</span>
          </div>
        </Transition>

        <!-- Video (post-play) -->
        <Transition name="fade">
          <video
            v-if="isPlaying"
            :key="activeVideo.id"
            v-release-media
            class="vs__iframe"
            :src="activeSrc"
            :poster="posterAttrs(activeVideo).large"
            autoplay
            controls
            playsinline
            @waiting="isBuffering = true"
            @playing="isBuffering = false"
            @canplay="isBuffering = false"
          />
        </Transition>

        <!-- Buffering spinner -->
        <Transition name="fade">
          <div v-if="isPlaying && isBuffering" class="vs__buffering" aria-label="Loading video">
            <span class="vs__spinner" aria-hidden="true" />
          </div>
        </Transition>

        <!-- HUD bottom -->
        <div v-if="!isPlaying" class="vs__hud-bottom" aria-hidden="true">
          <h3 class="vs__reel-title">{{ showreel.title }}</h3>
          <div class="vs__reel-meta">
            <b>Selected works</b>
            {{ showreel.meta }}
          </div>
        </div>
      </div>

      <!-- Video cards grouped by category -->
      <div v-for="group in groupedVideos" :key="group.category" class="vs__group reveal">
        <div class="vs__group-header">
          <span class="vs__group-label">{{ group.category }}</span>
          <span class="vs__group-count">{{ String(group.count).padStart(2, '0') }}</span>
        </div>
        <div
          v-for="grid in group.grids"
          :key="grid.orientation"
          class="vs__grid"
          :class="`vs__grid--${grid.orientation}`"
        >
          <div
            v-for="video in grid.items"
            :key="video.id"
            class="vs__card"
            role="button"
            tabindex="0"
            :data-id="video.id"
            :aria-label="`Play ${video.title}`"
            @click="play(video)"
            @keydown.enter="play(video)"
            @mouseenter="onEnter(video.id)"
            @mouseleave="onLeave(video.id)"
          >
            <div class="vs__thumb">
              <img
                class="vs__thumb-media"
                :src="video.thumb.src"
                :srcset="video.thumb.srcset"
                :sizes="gridSizes[grid.orientation]"
                :width="video.thumb.width"
                :height="video.thumb.height"
                loading="lazy"
                decoding="async"
                :alt="video.title"
              />
              <video
                v-if="activePreviewId === video.id"
                v-release-media
                class="vs__thumb-media"
                :src="cdn(video.preview)"
                autoplay
                muted
                loop
                playsinline
                preload="none"
                aria-hidden="true"
              />
              <span class="vs__plate" aria-hidden="true">{{ video.tag }}</span>
              <div class="vs__vplay" aria-hidden="true">
                <span class="vs__vtri" />
              </div>
              <span class="vs__duration" aria-hidden="true">{{ formatDuration(video.duration) }}</span>
              <span class="vs__pcorner vs__pcorner--tl" aria-hidden="true" />
              <span class="vs__pcorner vs__pcorner--br" aria-hidden="true" />
            </div>
            <div class="vs__vmeta">
              <h4 class="vs__vtitle">{{ video.title }}</h4>
              <p class="vs__vsub">{{ video.sub }}</p>
              <p class="vs__vdesc">{{ video.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="vs__foot reveal">
        <span class="vs__count">
          <b>{{ String(videos.length).padStart(2, '0') }}</b>
          &nbsp;films
        </span>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* ─── Transitions ──────────────────────────────────────────── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ─── Header ───────────────────────────────────────────────── */
.vs__head {
  display: flex;
  flex-direction: column;
  gap: var(--space-06);
  padding-bottom: var(--space-07);
  border-bottom: 1px solid var(--border);
}

.vs__heading {
  font-family: var(--serif);
  font-weight: 700;
  font-size: clamp(2rem, 4vw, 3.25rem);
  line-height: 1.1;
  letter-spacing: -0.005em;
  color: var(--text);
  margin: var(--space-05) 0 0;
}

.vs__sub {
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-dim);
  margin: 0;
  max-width: 400px;
}

.vs__stats {
  display: flex;
  gap: var(--space-06);
  margin-top: var(--space-05);
}

.vs__stats div {
  line-height: 1.4;
}

.vs__stats b {
  display: block;
  font-family: var(--serif);
  font-weight: 700;
  font-size: 1.375rem;
  color: var(--gold);
  margin-bottom: 4px;
}

.vs__stats span {
  font-size: 9px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--muted);
}

/* ─── Showreel player ──────────────────────────────────────── */
.vs__player {
  position: relative;
  margin-top: var(--space-07);
  scroll-margin-top: 80px;
  aspect-ratio: 16 / 9;
  background: radial-gradient(80% 70% at 50% 40%, #161412 0%, #0f0f0f 60%, #0a0a0a 100%);
  border: 1px solid var(--border);
  overflow: hidden;
  isolation: isolate;
  cursor: pointer;
}

.vs__player--portrait {
  aspect-ratio: 9 / 16;
  width: auto;
  height: min(80vh, 150vw);
  margin-inline: auto;
  cursor: default;
}

/* Showreel poster sits under the scanline/vignette overlays */
.vs__poster {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.vs__player::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.012) 0 1px,
    transparent 1px 4px
  );
  pointer-events: none;
  z-index: 1;
}

.vs__player::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(closest-side at 50% 50%, transparent 25%, rgba(0, 0, 0, 0.55) 100%),
    linear-gradient(180deg, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.45) 100%);
  pointer-events: none;
  z-index: 1;
}

/* Gold corner accents */
.vs__corner {
  position: absolute;
  width: 36px;
  height: 36px;
  z-index: 4;
  pointer-events: none;
}

.vs__corner--tl {
  top: -1px;
  left: -1px;
  border-top: 1px solid var(--gold);
  border-left: 1px solid var(--gold);
}

.vs__corner--br {
  bottom: -1px;
  right: -1px;
  border-bottom: 1px solid var(--gold);
  border-right: 1px solid var(--gold);
}

/* HUD overlays */
.vs__hud-top {
  position: absolute;
  top: 14px;
  left: 16px;
  right: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  z-index: 3;
  pointer-events: none;
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-dim);
  line-height: 1.6;
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
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  z-index: 3;
  pointer-events: none;
}

.vs__reel-title {
  font-family: var(--serif);
  font-weight: 700;
  font-size: clamp(1rem, 2.5vw, 2rem);
  color: var(--text);
  margin: 0;
  line-height: 1.1;
}

.vs__reel-meta {
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
  text-align: right;
  line-height: 1.7;
}

.vs__reel-meta b {
  display: block;
  color: var(--gold);
  font-weight: 500;
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
  border: 2px solid var(--gold);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: relative;
  transition: background 250ms ease;
}

.vs__play-btn::after {
  content: '';
  position: absolute;
  inset: -10px;
  border-radius: 50%;
  border: 1px solid rgba(201, 168, 76, 0.3);
  animation: vs-pulse 2.4s ease-in-out infinite;
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

@keyframes vs-pulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50%       { transform: scale(1.15); opacity: 0; }
}

.vs__play-label {
  font-weight: 500;
  font-size: 10px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--gold);
  line-height: 1;
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
  border: 2px solid rgba(201, 168, 76, 0.2);
  border-top-color: var(--gold);
  border-radius: 50%;
  animation: vs-spin 0.8s linear infinite;
}

@keyframes vs-spin {
  to { transform: rotate(360deg); }
}

/* Iframe fills entire player once active */
.vs__iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: none;
  z-index: 2;
}

/* ─── Category groups ──────────────────────────────────────── */
.vs__group {
  margin-top: var(--space-07);
}

.vs__group-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: var(--space-04);
  border-bottom: 1px solid var(--border);
  margin-bottom: var(--space-05);
}

.vs__group-label {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--gold);
}

.vs__group-count {
  font-family: var(--serif);
  font-size: 0.875rem;
  color: var(--muted);
}

/* ─── Video grid ───────────────────────────────────────────── */
.vs__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-07);
}

.vs__grid--portrait {
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-04);
}

.vs__grid + .vs__grid {
  margin-top: var(--space-06);
}

.vs__card {
  cursor: pointer;
  outline: none;
}

.vs__card:focus-visible .vs__thumb {
  outline: 1px solid var(--gold);
  outline-offset: -2px;
}

.vs__thumb {
  position: relative;
  aspect-ratio: 16 / 9;
  background: radial-gradient(80% 60% at 50% 40%, #232120 0%, #1a1a1a 60%, #131313 100%);
  overflow: hidden;
  isolation: isolate;
}

.vs__grid--portrait .vs__thumb {
  aspect-ratio: 9 / 16;
}

/* Poster <img> and hover/in-view preview <video> share the same box */
.vs__thumb-media {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.vs__thumb::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.012) 0 1px,
    transparent 1px 4px
  );
  z-index: 1;
}

.vs__thumb::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(closest-side at 50% 60%, transparent 35%, rgba(0, 0, 0, 0.5) 100%);
  z-index: 1;
}

.vs__vplay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid var(--gold);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  background: rgba(8, 8, 8, 0.4);
  transition: background 200ms ease;
}

.vs__card:hover .vs__vplay {
  background: var(--gold);
}

.vs__card:hover .vs__vtri {
  border-left-color: var(--bg);
}

.vs__vtri {
  width: 0;
  height: 0;
  border-left: 10px solid var(--gold);
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  margin-left: 3px;
}

.vs__duration {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(8, 8, 8, 0.8);
  padding: 4px 8px;
  font-size: 10px;
  color: var(--text-dim);
  z-index: 3;
  line-height: 1;
  border: 1px solid rgba(30, 30, 30, 0.6);
}

.vs__plate {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 8px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(201, 168, 76, 0.7);
  z-index: 3;
}

/* Corner ticks on card hover */
.vs__pcorner {
  position: absolute;
  width: 18px;
  height: 18px;
  z-index: 3;
  opacity: 0;
  transition: opacity 200ms ease;
  pointer-events: none;
}

.vs__pcorner--tl {
  top: 6px;
  left: 6px;
  border-top: 1px solid var(--gold);
  border-left: 1px solid var(--gold);
}

.vs__pcorner--br {
  bottom: 6px;
  right: 6px;
  border-bottom: 1px solid var(--gold);
  border-right: 1px solid var(--gold);
}

.vs__card:hover .vs__pcorner {
  opacity: 1;
}

/* Card meta */
.vs__vmeta {
  margin-top: var(--space-03);
}

.vs__cat {
  font-weight: 500;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gold);
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  line-height: 1;
}

.vs__cat::before {
  content: '';
  width: 16px;
  height: 1px;
  background: var(--gold);
}

.vs__vtitle {
  font-family: var(--serif);
  font-weight: 400;
  font-size: 1.125rem;
  line-height: 1.3;
  color: var(--text);
  margin: var(--space-02) 0 0;
  transition: color 200ms ease;
}

.vs__card:hover .vs__vtitle {
  color: var(--gold);
}

.vs__vsub {
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
  margin: var(--space-02) 0 0;
}

.vs__vdesc {
  font-size: 11px;
  line-height: 1.5;
  color: var(--text-dim);
  margin: var(--space-02) 0 0;
}

/* ─── Footer ───────────────────────────────────────────────── */
.vs__foot {
  margin-top: var(--space-07);
  display: flex;
  flex-direction: column;
  gap: var(--space-04);
  align-items: center;
  text-align: center;
  padding-top: var(--space-05);
  border-top: 1px solid var(--border);
}

.vs__count {
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
  line-height: 1;
}

.vs__count b {
  color: var(--gold);
  font-weight: 500;
}

/* ─── Responsive ───────────────────────────────────────────── */
@media (min-width: 640px) {
  .vs__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-05);
  }
}

@media (min-width: 768px) {
  .vs__head {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
  }

  .vs__grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-04);
    margin-top: var(--space-04);
  }

  .vs__grid--portrait {
    grid-template-columns: repeat(4, 1fr);
  }

  .vs__corner {
    width: 48px;
    height: 48px;
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

  .vs__hud-top {
    top: 24px;
    left: 24px;
    right: 24px;
    font-size: 10px;
  }

  .vs__hud-bottom {
    bottom: 24px;
    left: 24px;
    right: 24px;
  }

  .vs__pcorner {
    width: 22px;
    height: 22px;
  }

  .vs__foot {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
}

@media (min-width: 1100px) {
  .vs__grid--portrait {
    grid-template-columns: repeat(5, 1fr);
  }
}
</style>
