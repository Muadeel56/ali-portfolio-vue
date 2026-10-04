<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { activePreviewId, previewEnter, previewLeave, vReleaseMedia } from '@/composables/useVideoPreview.js'
import { cdn, posterAttrs, filmMeta } from '@/data/videos.js'

const props = defineProps({
  // An entry from src/data/videos.js
  video: {
    type: Object,
    required: true,
  },
  aspect: {
    type: String,
    default: null,
    validator: (v) => ['16:9', '9:16'].includes(v),
  },
  // Eager, high-priority poster for cards above the fold (never shutter-revealed)
  priority: {
    type: Boolean,
    default: false,
  },
  sizes: {
    type: String,
    default: null,
  },
  // Media only: the parent shows the title and details itself
  bare: {
    type: Boolean,
    default: false,
  },
  // Doorway mode: the card is a link (e.g. /services → its /work chapter) and never plays.
  // `video` may then be poster-only: { poster, title }.
  to: {
    type: [String, Object],
    default: null,
  },
  // Caption in doorway mode, shown with an arrow (e.g. "See Weddings")
  label: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['play'])

const ratio = computed(() => props.aspect ?? props.video.aspect ?? '16:9')
const poster = computed(() => posterAttrs(props.video))
const posterSizes = computed(() => props.sizes ?? (ratio.value === '9:16' ? '(max-width: 639px) 50vw, 25vw' : '(max-width: 899px) 100vw, 50vw'))
const isPreviewing = computed(() => activePreviewId.value === props.video.slug)
const caption = computed(() => filmMeta(props.video))

// Poster missing on the CDN (e.g. not uploaded yet): show a quiet placeholder, not a broken image.
const posterFailed = ref(false)

const play = () => emit('play', props.video)

// Playable card (button) or doorway link
const rootTag = computed(() => (props.to ? RouterLink : 'article'))
const rootAttrs = computed(() =>
  props.to
    ? { to: props.to }
    : {
        role: 'button',
        tabindex: 0,
        'data-slug': props.video.slug,
        // Bare cards show no text, so they need a label; otherwise the name comes from the visible
        // title and caption (plus a hidden "Play"), so speech users can say what they see.
        'aria-label': props.bare ? `Play ${props.video.title}` : undefined,
        onClick: play,
        onKeydown: (e) => {
          if (e.key !== 'Enter' && e.key !== ' ') return
          e.preventDefault()
          play()
        },
        onMouseenter: () => previewEnter(props.video.slug),
        onMouseleave: () => previewLeave(props.video.slug),
      },
)
</script>

<template>
  <component
    :is="rootTag"
    v-bind="rootAttrs"
    class="video-card"
    :class="[`video-card--${ratio === '9:16' ? 'portrait' : 'landscape'}`, { 'video-card--link': to }]"
  >
    <!-- data-shutter: clip-path reveal on scroll (useShutter); data-cursor: the global PLAY cursor -->
    <div class="video-card__thumb" :data-shutter="priority ? undefined : ''" :data-cursor="to ? undefined : 'play'">
      <span v-if="posterFailed" class="video-card__missing" aria-hidden="true">Coming soon</span>
      <img
        v-else
        class="video-card__media"
        :src="poster.src"
        :srcset="poster.srcset"
        :sizes="posterSizes"
        :width="poster.width"
        :height="poster.height"
        :loading="priority ? 'eager' : 'lazy'"
        :fetchpriority="priority ? 'high' : 'auto'"
        decoding="async"
        :alt="to ? '' : video.title"
        @error="posterFailed = true"
      />
      <video
        v-if="isPreviewing && !to"
        v-release-media
        class="video-card__media"
        :src="cdn(video.preview)"
        autoplay
        muted
        loop
        playsinline
        preload="none"
        aria-hidden="true"
        @contextmenu.prevent
      />
    </div>

    <p v-if="to" class="video-card__caption video-card__caption--link">
      <span class="video-card__link-label">{{ label }} <span aria-hidden="true">→</span></span>
      <span>{{ video.title }}</span>
    </p>
    <template v-else-if="!bare">
      <h3 class="video-card__title"><span class="visually-hidden">Play </span>{{ video.title }}</h3>
      <p class="video-card__caption">{{ caption }}</p>
    </template>
  </component>
</template>

<style scoped>
.video-card {
  /* Captions follow the column the card sits in, not the viewport (see @container below) */
  container: card / inline-size;
  /* Keeps the visually hidden "Play" text inside the card (and inside swipe rows' scroll box) */
  position: relative;
  display: block;
  cursor: pointer;
  outline: none;
  color: inherit;
  text-decoration: none;
}

.video-card__thumb {
  position: relative;
  aspect-ratio: 16 / 9;
  background: var(--surface-2);
  overflow: hidden;
  isolation: isolate;
}

.video-card--portrait .video-card__thumb {
  aspect-ratio: 9 / 16;
}

.video-card:focus-visible .video-card__thumb {
  outline: 1px solid var(--gold);
  outline-offset: 1px;
}

/* Poster <img> and preview <video> share the same box */
.video-card__media {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-card__missing {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-family: var(--mono);
  font-size: var(--fs-caption);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
}

.video-card__title {
  font-family: var(--serif);
  font-weight: 400;
  font-size: var(--fs-body-lg);
  line-height: 1.1;
  color: var(--text);
  margin: var(--space-03) 0 0;
  transition: color var(--dur-base) var(--ease-out-expo);
}

.video-card:hover .video-card__title,
.video-card:focus-visible .video-card__title {
  color: var(--gold);
}

.video-card__caption {
  font-family: var(--mono);
  font-size: var(--fs-caption);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--muted);
  margin: var(--space-02) 0 0;
}

/* Doorway caption: gold label, then the film it shows */
.video-card__caption--link {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: var(--space-01) var(--space-04);
}

.video-card__link-label {
  color: var(--gold);
}

.video-card--link:hover .video-card__link-label,
.video-card--link:focus-visible .video-card__link-label {
  color: var(--gold-light);
}

.video-card--link:focus-visible .video-card__thumb {
  outline: 1px solid var(--gold);
  outline-offset: 1px;
}

/* ─── Container queries: phone cards and narrow rails keep a small caption;
   wider columns (stacks, leads) get the display title on one line with room to breathe ─── */
@container card (min-width: 280px) {
  .video-card__title {
    font-size: var(--fs-h3);
    margin-top: var(--space-04);
  }
}

@container card (min-width: 560px) {
  .video-card__caption {
    font-size: var(--fs-label);
  }
}
</style>
