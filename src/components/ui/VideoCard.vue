<script setup>
import { computed, ref } from 'vue'
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
})

const emit = defineEmits(['play'])

const ratio = computed(() => props.aspect ?? props.video.aspect)
const poster = computed(() => posterAttrs(props.video))
const posterSizes = computed(() => props.sizes ?? (ratio.value === '9:16' ? '(max-width: 639px) 50vw, 25vw' : '(max-width: 899px) 100vw, 50vw'))
const isPreviewing = computed(() => activePreviewId.value === props.video.slug)
const caption = computed(() => filmMeta(props.video))

// Poster missing on the CDN (e.g. not uploaded yet): show a quiet placeholder, not a broken image.
const posterFailed = ref(false)

const play = () => emit('play', props.video)
</script>

<template>
  <article
    class="video-card"
    :class="`video-card--${ratio === '9:16' ? 'portrait' : 'landscape'}`"
    role="button"
    tabindex="0"
    :data-slug="video.slug"
    :aria-label="`Play ${video.title}`"
    @click="play"
    @keydown.enter.prevent="play"
    @keydown.space.prevent="play"
    @mouseenter="previewEnter(video.slug)"
    @mouseleave="previewLeave(video.slug)"
  >
    <!-- data-shutter: clip-path reveal on scroll (useShutter); data-cursor: the global PLAY cursor -->
    <div class="video-card__thumb" :data-shutter="priority ? undefined : ''" data-cursor="play">
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
        :alt="video.title"
        @error="posterFailed = true"
      />
      <video
        v-if="isPreviewing"
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

    <template v-if="!bare">
      <h3 class="video-card__title">{{ video.title }}</h3>
      <p class="video-card__caption">{{ caption }}</p>
    </template>
  </article>
</template>

<style scoped>
.video-card {
  cursor: pointer;
  outline: none;
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
  font-size: var(--fs-h3);
  line-height: 1.1;
  color: var(--text);
  margin: var(--space-04) 0 0;
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
</style>
