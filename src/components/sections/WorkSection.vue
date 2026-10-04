<script setup>
import { ref, computed } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal.js'
import { useVideoPreview, stopPreview, vReleaseMedia } from '@/composables/useVideoPreview.js'
import { RouterLink, useRoute } from 'vue-router'
import { videos, categoryOrder, chapters, showreel, findVideo, posterAttrs, pickSource, formatDuration } from '@/data/videos.js'
import SectionHeader from '../ui/SectionHeader.vue'
import VideoCard from '../ui/VideoCard.vue'
import VideoPlayerModal from '../ui/VideoPlayerModal.vue'
import VideoRail from '../ui/VideoRail.vue'
import AppButton from '../ui/AppButton.vue'
import Rule from '../ui/Rule.vue'

useScrollReveal('.work-section .reveal')

// Sets up in-view previews on touch devices; cards handle hover themselves.
const { refresh: refreshPreviews } = useVideoPreview('.video-card[data-id]')

const reelVideo = videos.find(v => v.id === showreel.videoId)
const reelPoster = posterAttrs(reelVideo)
const reelCaption = `${reelVideo.category} · ${reelVideo.tag.split('·')[0].trim()} · Showreel`

const landscapeSizes = '(max-width: 639px) 100vw, (max-width: 899px) 50vw, (max-width: 1280px) 33vw, 420px'
const leadSizes = '(max-width: 899px) 100vw, (max-width: 1280px) 66vw, 850px'

// Each chapter: a lead film shown large, the other landscape films in an even grid,
// and vertical films in their own rail, so the two shapes never mix.
const groupedChapters = chapters
  .map(chapter => {
    const films = categoryOrder
      .filter(c => chapter.categories.includes(c))
      .flatMap(c => videos.filter(v => v.category === c))
    const lead = findVideo(chapter.leadId) ?? films.find(v => v.orientation === 'landscape') ?? films[0]
    return {
      ...chapter,
      count: films.length,
      lead,
      landscape: films.filter(v => v.orientation === 'landscape' && v !== lead),
      portrait: films.filter(v => v.orientation === 'portrait' && v !== lead),
    }
  })
  .filter(chapter => chapter.count)

// ── Tabs ──────────────────────────────────────────────────
// The URL hash picks the tab (/work#brand), so links from the home page,
// the services page and back/forward all work. No hash, or #all, shows the index.
const route = useRoute()
const tabs = [{ id: 'all', title: 'All', count: videos.length }, ...groupedChapters]
const activeId = computed(() => {
  const id = route.hash.slice(1)
  return groupedChapters.some(c => c.id === id) ? id : 'all'
})
const activeChapter = computed(() => groupedChapters.find(c => c.id === activeId.value))

// CLIENT · YEAR · LENGTH
const filmMeta = (video) =>
  [video.category, (video.tag ?? '').split('·')[0].trim(), formatDuration(video.duration)].filter(Boolean).join(' · ')

const pad = (n) => String(n).padStart(2, '0')

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
  <section id="work" class="section work-section">
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

      <!-- Category tabs: real links to /work#<id>. data-anchor-offset: anchor scrolling clears the sticky bar. -->
      <nav class="ws__bar" aria-label="Work categories" data-anchor-offset>
        <div class="ws__bar-track">
          <RouterLink
            v-for="tab in tabs"
            :key="tab.id"
            :to="{ hash: `#${tab.id}` }"
            class="ws__bar-link"
            :class="{ 'is-active': activeId === tab.id }"
            :aria-current="activeId === tab.id ? 'page' : undefined"
          >
            {{ tab.title }} <span class="ws__bar-count">{{ pad(tab.count) }}</span>
          </RouterLink>
        </div>
      </nav>

      <!-- Stable anchor target: its id follows the tab, so /work#brand always has an element to scroll to,
           even while the panels cross-fade. -->
      <div :id="activeId" class="ws__panels">
        <Transition name="fade" mode="out-in" @after-enter="refreshPreviews">
          <!-- One category -->
          <section
            v-if="activeChapter"
            :key="activeChapter.id"
            class="ws__panel"
            :aria-labelledby="`${activeChapter.id}-title`"
          >
            <header class="ws__chapter-header grid-12">
              <p class="ws__chapter-num">{{ activeChapter.number }}</p>
              <div class="ws__chapter-main">
                <h3 :id="`${activeChapter.id}-title`" class="ws__chapter-title">{{ activeChapter.title }}</h3>
                <p class="ws__chapter-desc">{{ activeChapter.desc }}</p>
              </div>
              <p class="ws__chapter-count"><b>{{ pad(activeChapter.count) }}</b> films</p>
            </header>
            <Rule />

            <article class="ws__lead grid-12">
              <VideoCard
                class="ws__lead-media"
                :video="activeChapter.lead"
                aspect="16:9"
                :sizes="leadSizes"
                bare
                @play="openVideo"
              />
              <div class="ws__lead-info">
                <p class="ws__lead-eyebrow">Lead film</p>
                <h4 class="ws__lead-title">{{ activeChapter.lead.title }}</h4>
                <p class="ws__lead-meta">{{ filmMeta(activeChapter.lead) }}</p>
                <p class="ws__lead-desc">{{ activeChapter.lead.desc }}</p>
                <AppButton variant="outline" show-arrow @click="openVideo(activeChapter.lead)">Watch film</AppButton>
              </div>
            </article>

            <template v-if="activeChapter.landscape.length">
              <p class="ws__sub">More films <span>{{ pad(activeChapter.landscape.length) }}</span></p>
              <div class="ws__grid grid-12">
                <VideoCard
                  v-for="video in activeChapter.landscape"
                  :key="video.id"
                  :video="video"
                  aspect="16:9"
                  :sizes="landscapeSizes"
                  @play="openVideo"
                />
              </div>
            </template>

            <VideoRail v-if="activeChapter.portrait.length" class="ws__rail" :videos="activeChapter.portrait" @play="openVideo" />
          </section>

          <!-- All: an index of every category, each with its lead film -->
          <div v-else key="all" class="ws__panel ws__index">
            <article
              v-for="(chapter, i) in groupedChapters"
              :key="chapter.id"
              class="ws__index-item grid-12"
              :class="{ 'ws__index-item--flip': i % 2 }"
              :aria-labelledby="`${chapter.id}-index-title`"
            >
              <VideoCard
                class="ws__index-media"
                :video="chapter.lead"
                aspect="16:9"
                :sizes="leadSizes"
                bare
                @play="openVideo"
              />
              <div class="ws__index-info">
                <p class="ws__chapter-num">{{ chapter.number }}</p>
                <h3 :id="`${chapter.id}-index-title`" class="ws__chapter-title">{{ chapter.title }}</h3>
                <p class="ws__chapter-desc">{{ chapter.desc }}</p>
                <p class="ws__chapter-count"><b>{{ pad(chapter.count) }}</b> films</p>
                <AppButton variant="ghost" show-arrow :to="{ hash: `#${chapter.id}` }">
                  View all {{ chapter.count }} films
                </AppButton>
              </div>
            </article>
          </div>
        </Transition>
      </div>

      <!-- Footer -->
      <div class="ws__foot reveal">
        <Rule />
        <p class="ws__count">
          <b>{{ pad(videos.length) }}</b> films
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

/* ─── Sticky chapter bar ──────────────────────────────────── */
.ws__bar {
  position: sticky;
  top: var(--nav-h);
  z-index: 5;
  margin-top: var(--space-08);
  background: var(--bg);
  border-block: 1px solid var(--rule);
}

/* Scrolls sideways on phones instead of wrapping */
/* Fixed height so .ws__panels' scroll-margin can clear it exactly */
.ws__bar-track {
  display: flex;
  align-items: center;
  gap: var(--space-06);
  height: var(--space-07);
  overflow-x: auto;
  scrollbar-width: none;
}

.ws__bar-track::-webkit-scrollbar {
  display: none;
}

.ws__bar-link {
  flex-shrink: 0;
  position: relative;
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-dim);
  text-decoration: none;
  white-space: nowrap;
  transition: color var(--dur-fast) var(--ease-out-expo);
}

.ws__bar-link:hover,
.ws__bar-link.is-active {
  color: var(--gold);
}

.ws__bar-count {
  font-family: var(--mono);
  color: var(--muted);
  margin-left: var(--space-01);
}

/* ─── Panels ───────────────────────────────────────────────── */
.ws__panels {
  min-height: 60vh;
  /* Native #hash jumps land below the navbar and the sticky category bar (+ its 2 border px) */
  scroll-margin-top: calc(var(--nav-h) + var(--space-07) + 2px);
}

.ws__panel {
  padding-top: var(--space-08);
}

.ws__chapter-header {
  row-gap: var(--space-03);
  align-items: end;
  padding-bottom: var(--space-05);
}

.ws__chapter-num {
  font-family: var(--mono);
  font-size: var(--fs-label);
  letter-spacing: 0.2em;
  color: var(--gold);
  margin: 0;
}

.ws__chapter-title {
  font-family: var(--serif);
  font-weight: 400;
  font-size: var(--fs-h2);
  line-height: 1;
  color: var(--text);
  margin: 0;
}

.ws__chapter-desc {
  font-size: var(--fs-body);
  line-height: 1.6;
  color: var(--text-dim);
  max-width: 48ch;
  margin: var(--space-03) 0 0;
}

.ws__chapter-count {
  font-family: var(--mono);
  font-size: var(--fs-caption);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
  margin: 0;
}

.ws__chapter-count b {
  color: var(--gold);
  font-weight: 500;
}

/* ─── Lead film ────────────────────────────────────────────── */
.ws__lead {
  row-gap: var(--space-05);
  margin-top: var(--space-07);
  align-items: center;
}

.ws__lead-eyebrow {
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--gold);
  margin: 0;
}

.ws__lead-title {
  font-family: var(--serif);
  font-weight: 400;
  font-size: var(--fs-h3);
  line-height: 1.05;
  color: var(--text);
  margin: var(--space-03) 0 0;
}

.ws__lead-meta {
  font-family: var(--mono);
  font-size: var(--fs-caption);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--muted);
  margin: var(--space-02) 0 0;
}

.ws__lead-desc {
  font-size: var(--fs-body);
  line-height: 1.7;
  color: var(--text-dim);
  margin: var(--space-04) 0 var(--space-05);
}

.ws__sub {
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--gold);
  margin: var(--space-09) 0 0;
}

.ws__sub span {
  font-family: var(--mono);
  color: var(--muted);
  margin-left: var(--space-02);
}

/* ─── "All" index ──────────────────────────────────────────── */
.ws__index {
  display: grid;
  gap: var(--space-09);
}

.ws__index-item {
  row-gap: var(--space-05);
  align-items: center;
}

.ws__index-info .ws__chapter-title {
  margin-top: var(--space-03);
}

.ws__index-info .ws__chapter-count {
  margin: var(--space-04) 0 var(--space-05);
}

@media (min-width: 900px) {
  .ws__chapter-num {
    grid-column: 1 / 2;
    align-self: start;
    padding-top: var(--space-02);
  }

  .ws__chapter-main {
    grid-column: 2 / 10;
  }

  .ws__chapter-header .ws__chapter-count {
    grid-column: 10 / 13;
    justify-self: end;
  }

  .ws__lead-media,
  .ws__index-media {
    grid-column: 1 / 9;
  }

  .ws__lead-info,
  .ws__index-info {
    grid-column: 9 / 13;
  }

  /* Alternate sides down the index */
  .ws__index-item--flip .ws__index-media {
    grid-column: 5 / 13;
    grid-row: 1;
  }

  .ws__index-item--flip .ws__index-info {
    grid-column: 1 / 5;
    grid-row: 1;
  }

  .ws__index-info .ws__chapter-num {
    padding-top: 0;
  }
}

/* ─── Landscape grid: one card size everywhere ─────────────── */
.ws__grid {
  row-gap: var(--space-07);
  margin-top: var(--space-05);
  align-items: start;
}

@media (min-width: 640px) {
  .ws__grid > * {
    grid-column: span 6;
  }
}

@media (min-width: 1100px) {
  .ws__grid > * {
    grid-column: span 4;
  }
}

/* ─── Vertical rail ────────────────────────────────────────── */
.ws__rail {
  margin-top: var(--space-09);
}

/* HUD labels crowd the player on phones */
@media (max-width: 639px) {
  .ws__hud-top,
  .ws__play-label {
    display: none;
  }
}

/* ─── Footer ───────────────────────────────────────────────── */
.ws__foot {
  margin-top: var(--space-09);
}

.ws__count {
  font-family: var(--mono);
  font-size: var(--fs-caption);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
  margin: var(--space-04) 0 0;
}

.ws__count b {
  color: var(--gold);
  font-weight: 500;
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
