<script setup>
import { ref, computed } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal.js'
import { useVideoPreview, stopPreview, vReleaseMedia } from '@/composables/useVideoPreview.js'
import { useFilmQuery } from '@/composables/useFilmQuery.js'
import { useShutter, useParallax } from '@/composables/useMotion.js'
import { chapters, chapterFilms, chapterForVideo, showreel, findVideo, posterAttrs, pickSource, formatDuration } from '@/data/videos.js'
import { site } from '@/data/site.js'
import PageHero from '../ui/PageHero.vue'
import VideoPlayerModal from '../ui/VideoPlayerModal.vue'
import WorkChapterNav from '../work/WorkChapterNav.vue'
import WorkChapter from '../work/WorkChapter.vue'

useScrollReveal('.work-section .reveal')

// Sets up in-view previews on touch devices; cards handle hover themselves.
useVideoPreview('.work-section .video-card[data-slug]')

const rootRef = ref(null)
useShutter(rootRef)
useParallax(rootRef)

const reelVideo = findVideo(showreel.videoSlug)
const reelPoster = posterAttrs(reelVideo)
const reelCaption = `${reelVideo.client} · ${reelVideo.year} · Showreel`

// All-9:16 chapters use the phone layout. Lead/stack chapters alternate sides,
// counting only lead/stack chapters so a phone chapter doesn't break the rhythm.
let stackCount = 0
const sections = chapters.map((chapter) => {
  const films = chapterFilms(chapter)
  const phones = films.every((v) => v.aspect === '9:16')
  return { chapter, films, phones, flip: phones ? false : stackCount++ % 2 === 1 }
})

const pad = (n) => String(n).padStart(2, '0')
const heroMeta = [
  `${pad(chapters.length)} chapters`,
  `${pad(sections.reduce((n, s) => n + s.films.length, 0))} films`,
  site.reach,
]

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

// ── Cards → modal (?film=<slug>) ──────────────────────────
const { open: modalOpen, video: modalVideo, openFilm } = useFilmQuery()

// Prev/Next walk the film's chapter; archived films (no chapter) play alone.
const playlist = computed(() => {
  const film = modalVideo.value
  if (!film) return []
  const chapter = chapterForVideo(film)
  return chapter ? chapterFilms(chapter) : [film]
})

const openVideo = (video) => {
  stopPreview()
  reelPlaying.value = false
  openFilm(video)
}
</script>

<template>
  <PageHero
    eyebrow="Work"
    title="Selected work"
    accent="work"
    intro="Motion pictures that move people. Each film crafted with intention — from the first cut to the final colour grade."
    :meta="heroMeta"
  />
  <section id="work" ref="rootRef" class="section section--after-hero work-section" aria-label="Films by chapter">
    <div class="container">

      <!-- Showreel player: bleeds to the container edges -->
      <figure class="ws__reel reveal">
        <div class="ws__player" @click="playReel">
          <img
            v-if="!reelPlaying"
            class="ws__poster"
            :src="reelPoster.large"
            :srcset="reelPoster.srcset"
            sizes="(max-width: 1280px) 100vw, 1280px"
            :width="reelPoster.width"
            :height="reelPoster.height"
            fetchpriority="high"
            decoding="async"
            alt=""
          />

          <div v-if="!reelPlaying" class="ws__hud-top" aria-hidden="true">
            <div>
              <b>{{ showreel.hud.left }}</b>
              {{ showreel.hud.leftSub }}
            </div>
            <div class="ws__hud-right">
              <b>{{ showreel.hud.right }}</b>
              {{ showreel.hud.rightSub }}
            </div>
          </div>

          <Transition name="fade">
            <div v-if="!reelPlaying" class="ws__cover">
              <button class="ws__play-btn" aria-label="Play showreel" @click.stop="playReel">
                <span class="ws__triangle" aria-hidden="true" />
              </button>
              <span class="ws__play-label">Watch Showreel</span>
            </div>
          </Transition>

          <Transition name="fade">
            <video
              v-if="reelPlaying"
              v-release-media
              class="ws__video"
              :src="reelSrc"
              :poster="reelPoster.large"
              autoplay
              controls
              controlslist="nodownload"
              playsinline
              @contextmenu.prevent
              @waiting="reelBuffering = true"
              @playing="reelBuffering = false"
              @canplay="reelBuffering = false"
            />
          </Transition>

          <Transition name="fade">
            <div v-if="reelPlaying && reelBuffering" class="ws__buffering" aria-label="Loading video">
              <span class="ws__spinner" aria-hidden="true" />
            </div>
          </Transition>

          <div v-if="!reelPlaying" class="ws__hud-bottom" aria-hidden="true">
            <h3 class="ws__reel-title">{{ showreel.title }}</h3>
          </div>
        </div>
        <figcaption class="ws__caption">
          <span>{{ reelCaption }}</span>
          <span>{{ showreel.meta }} · {{ formatDuration(reelVideo.duration) }}</span>
        </figcaption>
      </figure>

      <WorkChapterNav :chapters="chapters" />

      <WorkChapter
        v-for="(section, i) in sections"
        :key="section.chapter.id"
        :chapter="section.chapter"
        :films="section.films"
        :phones="section.phones"
        :flip="section.flip"
        :priority="i === 0"
        @play="openVideo"
      />
    </div>

    <VideoPlayerModal v-model:open="modalOpen" v-model:video="modalVideo" :playlist="playlist" />
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
.ws__reel {
  margin: 0;
}

.ws__player {
  position: relative;
  aspect-ratio: 16 / 9;
  background: var(--surface);
  overflow: hidden;
  isolation: isolate;
  cursor: pointer;
}

.ws__poster,
.ws__video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ws__video {
  object-fit: contain;
  background: var(--bg);
  z-index: 2;
}

.ws__caption {
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
.ws__hud-top,
.ws__hud-bottom {
  position: absolute;
  left: var(--space-04);
  right: var(--space-04);
  z-index: 3;
  display: flex;
  justify-content: space-between;
  pointer-events: none;
}

.ws__hud-top {
  top: var(--space-04);
  align-items: flex-start;
  font-family: var(--mono);
  font-size: var(--fs-caption);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-dim);
  line-height: 1.6;
}

.ws__hud-top > div {
  background: var(--overlay);
  padding: var(--space-02) var(--space-03);
}

.ws__hud-top b {
  display: block;
  color: var(--gold);
  font-weight: 500;
}

.ws__hud-right {
  text-align: right;
}

.ws__hud-bottom {
  bottom: var(--space-04);
  align-items: flex-end;
}

.ws__reel-title {
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
.ws__cover {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-04);
}

.ws__play-btn {
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

.ws__play-btn:hover {
  background: var(--gold);
}

.ws__play-btn:hover .ws__triangle {
  border-left-color: var(--bg);
}

.ws__triangle {
  width: 0;
  height: 0;
  border-left: 18px solid var(--gold);
  border-top: 11px solid transparent;
  border-bottom: 11px solid transparent;
  margin-left: 5px;
}

.ws__play-label {
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
.ws__buffering {
  position: absolute;
  inset: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.ws__spinner {
  width: 36px;
  height: 36px;
  border: 1px solid var(--gold-dim);
  border-top-color: var(--gold);
  border-radius: 50%;
  animation: ws-spin var(--dur-slow) var(--ease-linear) infinite;
}

@keyframes ws-spin {
  to { transform: rotate(360deg); }
}

/* HUD labels crowd the player on phones */
@media (max-width: 639px) {
  .ws__hud-top,
  .ws__play-label {
    display: none;
  }
}

@media (min-width: 900px) {
  .ws__hud-top,
  .ws__hud-bottom {
    left: var(--space-05);
    right: var(--space-05);
  }

  .ws__hud-top {
    top: var(--space-05);
  }

  .ws__hud-bottom {
    bottom: var(--space-05);
  }

  .ws__play-btn {
    width: 80px;
    height: 80px;
  }

  .ws__triangle {
    border-left-width: 22px;
    border-top-width: 14px;
    border-bottom-width: 14px;
    margin-left: 6px;
  }
}
</style>
