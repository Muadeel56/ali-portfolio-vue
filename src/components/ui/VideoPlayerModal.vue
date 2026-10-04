<script setup>
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'
import { vReleaseMedia } from '@/composables/useVideoPreview.js'
import { pickSource, filmMeta, chapterForVideo } from '@/data/videos.js'
import { findService } from '@/data/services.js'
import { site } from '@/data/site.js'
import { track } from '@/composables/useAnalytics.js'
import { whatsappService } from '@/composables/useWhatsApp.js'
import AppButton from './AppButton.vue'
import Rule from './Rule.vue'

// Full-screen player. `playlist` enables Prev/Next (←/→, swipe) within it.
// On /work, open/video are bound to ?film= (see useFilmQuery.js); elsewhere they're local state.
const open = defineModel('open', { type: Boolean, default: false })
const film = defineModel('video', { type: Object, default: null })

const props = defineProps({
  playlist: {
    type: Array,
    default: () => [],
  },
  // Analytics only: where the player was opened from ('work', 'home', 'hero' or 'link')
  source: {
    type: String,
    default: 'work',
  },
})

// ── Playlist ──────────────────────────────────────────────
const index = computed(() => props.playlist.findIndex((v) => v.slug === film.value?.slug))
const hasPlaylist = computed(() => props.playlist.length > 1 && index.value !== -1)
const neighbour = (step) => props.playlist[(index.value + step + props.playlist.length) % props.playlist.length]
const prevFilm = computed(() => (hasPlaylist.value ? neighbour(-1) : null))
const nextFilm = computed(() => (hasPlaylist.value ? neighbour(1) : null))
const pad = (n) => String(n).padStart(2, '0')

const go = (step) => {
  const target = step < 0 ? prevFilm.value : nextFilm.value
  if (target) film.value = target
}

// ── End screen ───────────────────────────────────────────
const ended = ref(false)
const failed = ref(false)
const service = computed(() => findService(chapterForVideo(film.value)?.serviceId))
const enquiry = computed(() =>
  service.value
    ? { label: `Like this? Enquire about ${service.value.title}`, to: { path: '/contact', query: { service: service.value.id } } }
    : { label: 'Start a project', to: '/contact' },
)

const dialogRef = ref(null)
const closeRef = ref(null)
const videoRef = ref(null)
const enquiryRef = ref(null)
const announcement = ref('')

const onEnded = () => {
  ended.value = true
  announcement.value = `Film ended. ${enquiry.value.label}.`
  nextTick(() => enquiryRef.value?.$el?.focus())
}

// ── Analytics: one "Video Play" per film per open (Prev/Next counts as a new film) ──
let trackedSlug = null

const onPlay = () => {
  ended.value = false
  if (film.value.slug === trackedSlug) return
  trackedSlug = film.value.slug
  track('Video Play', { slug: film.value.slug, chapter: film.value.category, source: props.source })
}

const watchAgain = () => {
  ended.value = false
  const video = videoRef.value
  if (!video) return
  video.currentTime = 0
  video.play().catch(() => {})
  video.focus()
}

// ── Copy link ─────────────────────────────────────────────
// Always the /work URL, so a link copied from the home page opens the same film.
const copied = ref(false)
let copiedTimer

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(`${location.origin}/work?film=${film.value.slug}`)
  } catch {
    return
  }
  copied.value = true
  announcement.value = 'Link copied'
  track('Copy Film Link', { slug: film.value.slug })
  clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => {
    copied.value = false
  }, 2000)
}

const close = () => {
  open.value = false
}

// ── Keyboard: Esc, ←/→, focus trap ────────────────────────
const FOCUSABLE = 'button:not([disabled]), a[href], video[controls], [tabindex]:not([tabindex="-1"])'

const trapFocus = (e) => {
  const items = [...dialogRef.value.querySelectorAll(FOCUSABLE)].filter((el) => el.getClientRects().length)
  if (!items.length) return
  const first = items[0]
  const last = items.at(-1)
  const inside = dialogRef.value.contains(document.activeElement)
  if (e.shiftKey && (document.activeElement === first || !inside)) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && (document.activeElement === last || !inside)) {
    e.preventDefault()
    first.focus()
  }
}

const onKeydown = (e) => {
  if (!dialogRef.value) return
  if (e.key === 'Escape') {
    close()
  } else if (e.key === 'Tab') {
    trapFocus(e)
  } else if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !e.altKey && !e.metaKey && !e.ctrlKey) {
    // On the <video> the arrows seek
    if (document.activeElement?.tagName === 'VIDEO') return
    e.preventDefault()
    go(e.key === 'ArrowLeft' ? -1 : 1)
  }
}

// ── Swipe (touch only, never on the native controls bar) ──
const CONTROLS_H = 56
const SWIPE_MIN = 50
let swipeStart = null

const onPointerDown = (e) => {
  swipeStart = null
  if (e.pointerType !== 'touch' || !hasPlaylist.value) return
  const rect = e.currentTarget.getBoundingClientRect()
  if (e.clientY > rect.bottom - CONTROLS_H) return
  swipeStart = { x: e.clientX, y: e.clientY }
}

const onPointerUp = (e) => {
  if (!swipeStart) return
  const dx = e.clientX - swipeStart.x
  const dy = e.clientY - swipeStart.y
  swipeStart = null
  if (Math.abs(dx) > SWIPE_MIN && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1)
}

// ── Open / close side effects ─────────────────────────────
let returnFocusTo = null
let savedScroll = 0
let savedTitle = ''
let lastSlug = null

const app = () => document.getElementById('app')

const lockPage = () => {
  returnFocusTo = document.activeElement
  savedScroll = window.scrollY
  savedTitle = document.title
  document.body.style.overflow = 'hidden'
  document.documentElement.classList.add('is-modal-open')
  app()?.setAttribute('inert', '')
  window.addEventListener('keydown', onKeydown)
}

const unlockPage = () => {
  document.body.style.overflow = ''
  document.documentElement.classList.remove('is-modal-open')
  app()?.removeAttribute('inert')
  window.removeEventListener('keydown', onKeydown)
  if (window.scrollY !== savedScroll) window.scrollTo({ top: savedScroll, behavior: 'instant' })
  document.title = savedTitle
}

// Back to the card of the film last shown (after Prev/Next), else whatever opened the player.
const restoreFocus = () => {
  const card = lastSlug && app()?.querySelector(`[data-slug="${CSS.escape(lastSlug)}"]`)
  const target = card ?? returnFocusTo
  target?.focus?.({ preventScroll: true })
  returnFocusTo = null
}

const isOpen = computed(() => open.value && Boolean(film.value))

watch(
  isOpen,
  (now, before) => {
    if (now) {
      lockPage()
      nextTick(() => closeRef.value?.focus())
    } else if (before) {
      unlockPage()
      restoreFocus()
      trackedSlug = null
      whatsappService.value = null
    }
  },
  { immediate: true },
)

watch(
  film,
  (video) => {
    ended.value = false
    failed.value = false
    if (!video) return
    lastSlug = video.slug
    if (isOpen.value) document.title = `${video.title} — ${site.name}`
  },
  { immediate: true },
)

// WhatsApp messages mention the service of the film on screen
watch(
  [isOpen, service],
  ([now, current]) => {
    if (now) whatsappService.value = current
  },
  { immediate: true },
)

onUnmounted(() => {
  clearTimeout(copiedTimer)
  if (isOpen.value) {
    unlockPage()
    whatsappService.value = null
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        ref="dialogRef"
        class="player-modal"
        role="dialog"
        aria-modal="true"
        :aria-label="film.title"
      >
        <div class="player-modal__content">
          <div class="player-modal__bar player-modal__fade">
            <p class="player-modal__title">
              {{ film.title }}
              <span class="player-modal__meta">{{ filmMeta(film) }}</span>
            </p>

            <div class="player-modal__actions">
              <template v-if="hasPlaylist">
                <button
                  type="button"
                  class="player-modal__btn"
                  :aria-label="`Previous film: ${prevFilm.title}`"
                  @click="go(-1)"
                >‹ Prev</button>
                <span class="t-mono player-modal__count"><b>{{ pad(index + 1) }}</b> / {{ pad(playlist.length) }}</span>
                <button
                  type="button"
                  class="player-modal__btn"
                  :aria-label="`Next film: ${nextFilm.title}`"
                  @click="go(1)"
                >Next ›</button>
              </template>
              <button type="button" class="player-modal__btn" @click="copyLink">
                {{ copied ? 'Copied' : 'Copy link' }}
              </button>
              <button ref="closeRef" type="button" class="player-modal__btn player-modal__btn--close" @click="close">
                Close <span aria-hidden="true">✕</span>
              </button>
            </div>
          </div>
          <Rule class="player-modal__fade" />

          <div class="player-modal__stage" @pointerdown="onPointerDown" @pointerup="onPointerUp" @pointercancel="onPointerUp">
            <!-- Letterbox bars slide in from the edges to frame the film as the player opens -->
            <span class="player-modal__letterbox player-modal__letterbox--top" aria-hidden="true" />
            <span class="player-modal__letterbox player-modal__letterbox--bottom" aria-hidden="true" />

            <p v-if="failed" class="player-modal__error player-modal__fade" role="alert">This film couldn't be loaded. Please try again later.</p>
            <!-- No download button and no "Save video as…" menu -->
            <video
              v-else
              :key="film.slug"
              ref="videoRef"
              v-release-media
              class="player-modal__video player-modal__fade"
              :class="{ 'player-modal__video--portrait': film.aspect === '9:16' }"
              :src="pickSource(film)"
              controls
              controlslist="nodownload"
              autoplay
              playsinline
              @contextmenu.prevent
              @error="failed = true"
              @ended="onEnded"
              @play="onPlay"
            />

            <Transition name="end">
              <div v-if="ended" class="player-modal__end" data-track-from="end-screen">
                <AppButton ref="enquiryRef" variant="primary" show-arrow :to="enquiry.to">{{ enquiry.label }}</AppButton>
                <div class="player-modal__end-links">
                  <button type="button" class="player-modal__btn" @click="watchAgain">Watch again</button>
                  <button v-if="nextFilm" type="button" class="player-modal__btn" @click="go(1)">
                    Next: {{ nextFilm.title }}
                  </button>
                </div>
              </div>
            </Transition>
          </div>
        </div>

        <p class="visually-hidden" aria-live="polite">{{ announcement }}</p>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.player-modal {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: var(--bg);
}

/* ─── Letterbox bars ──────────────────────────────────────── */
.player-modal__letterbox {
  position: absolute;
  left: 0;
  right: 0;
  height: var(--gutter);
  background: var(--bg);
  pointer-events: none;
  transition: transform var(--dur-letterbox) var(--ease-in-out) calc(var(--dur-fast) / 2);
}

.player-modal__letterbox--top {
  top: 0;
  border-bottom: 1px solid var(--rule);
  transform-origin: top;
}

.player-modal__letterbox--bottom {
  bottom: 0;
  border-top: 1px solid var(--rule);
  transform-origin: bottom;
}

/* ─── Content ─────────────────────────────────────────────── */
.player-modal__content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* Fades up once the bars are in */
.player-modal__fade {
  transition: opacity var(--dur-base) var(--ease-out-expo) var(--dur-letterbox);
}

.player-modal__bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-03) var(--space-04);
  padding: calc(var(--space-04) + env(safe-area-inset-top)) calc(var(--gutter) + env(safe-area-inset-right)) var(--space-04)
    calc(var(--gutter) + env(safe-area-inset-left));
}

.player-modal__title {
  font-family: var(--mono);
  font-size: var(--fs-caption);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin: 0;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.player-modal__meta {
  color: var(--muted);
  margin-left: var(--space-03);
}

.player-modal__actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-02);
}

.player-modal__count {
  padding-inline: var(--space-02);
}

.player-modal__btn {
  font-family: var(--mono);
  font-size: var(--fs-label);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-dim);
  background: none;
  border: 1px solid var(--rule);
  border-radius: 0;
  min-height: var(--tap);
  padding: var(--space-02) var(--space-04);
  cursor: pointer;
  transition:
    border-color var(--dur-fast) var(--ease-out-expo),
    color var(--dur-fast) var(--ease-out-expo);
}

.player-modal__btn--close {
  color: var(--gold);
}

.player-modal__btn:hover,
.player-modal__btn:focus-visible {
  border-color: var(--gold);
  color: var(--gold);
  outline: none;
}

.player-modal__stage {
  position: relative;
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--gutter) calc(var(--gutter) + env(safe-area-inset-right)) calc(var(--gutter) + env(safe-area-inset-bottom))
    calc(var(--gutter) + env(safe-area-inset-left));
  /* Horizontal swipes reach the Prev/Next handler; vertical pans stay with the browser */
  touch-action: pan-y;
}

.player-modal__video {
  width: 100%;
  max-height: 100%;
  aspect-ratio: 16 / 9;
  background: var(--surface);
}

.player-modal__video--portrait {
  width: auto;
  height: 100%;
  aspect-ratio: 9 / 16;
}

.player-modal__error {
  font-family: var(--mono);
  font-size: var(--fs-label);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-dim);
  text-align: center;
  margin: 0;
}

/* ─── End screen: over the last frame, the controls bar stays reachable ─── */
.player-modal__end {
  position: absolute;
  inset: var(--gutter) var(--gutter) calc(var(--gutter) + var(--space-08));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-05);
  padding: var(--space-05);
  background: var(--overlay);
  text-align: center;
}

.player-modal__end-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-02);
}

.end-enter-active,
.end-leave-active {
  transition: opacity var(--dur-base) var(--ease-out-expo);
}

.end-enter-from,
.end-leave-to {
  opacity: 0;
}

/* ─── Open: backdrop → letterbox bars → film. Close: the same, reversed and faster.
   Reduced motion: the global rule in main.css makes all of this instant. ─── */
.modal-enter-active {
  transition: opacity var(--dur-fast) var(--ease-out-expo);
}

.modal-enter-from {
  opacity: 0;
}

.modal-enter-from .player-modal__letterbox,
.modal-leave-to .player-modal__letterbox {
  transform: scaleY(0);
}

.modal-enter-from .player-modal__fade,
.modal-leave-to .player-modal__fade {
  opacity: 0;
}

/* The root's transition sets how long Vue keeps the dialog: content, then bars, then backdrop */
.modal-leave-active {
  transition: opacity var(--dur-fast) var(--ease-in-out) var(--dur-fast);
}

.modal-leave-to {
  opacity: 0;
}

.modal-leave-active .player-modal__fade {
  transition: opacity var(--dur-fast) var(--ease-in-out);
}

.modal-leave-active .player-modal__letterbox {
  transition: transform var(--dur-fast) var(--ease-in-out) calc(var(--dur-fast) / 2);
}

/* Film details crowd the bar on phones */
.player-modal__meta {
  display: none;
}

@media (min-width: 640px) {
  .player-modal__meta {
    display: inline;
  }
}
</style>
