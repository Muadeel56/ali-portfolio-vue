<script setup>
import { computed, ref } from 'vue'
import { activePreviewId, previewEnter, previewLeave, vReleaseMedia } from '@/composables/useVideoPreview.js'
import { cdn, posterAttrs, formatDuration } from '@/data/videos.js'

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
  // Eager, high-priority poster for cards above the fold
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

const ratio = computed(() => props.aspect ?? (props.video.orientation === 'portrait' ? '9:16' : '16:9'))
const poster = computed(() => posterAttrs(props.video))
const posterSizes = computed(() => props.sizes ?? (ratio.value === '9:16' ? '(max-width: 639px) 50vw, 25vw' : '(max-width: 899px) 100vw, 50vw'))
const isPreviewing = computed(() => activePreviewId.value === props.video.id)

// CLIENT · YEAR · TYPE · LENGTH (`tag` is "2026 · Corporate Event")
const caption = computed(() => {
  const [year, type] = (props.video.tag ?? '').split('·').map((part) => part.trim())
  return [props.video.category, year, type, formatDuration(props.video.duration)].filter(Boolean).join(' · ')
})

// "Play" cursor label follows the pointer (shown on fine pointers only, see CSS)
const thumbRef = ref(null)

// Poster missing on the CDN (e.g. not uploaded yet): show a quiet placeholder, not a broken image.
const posterFailed = ref(false)
const onPointerMove = (e) => {
  const rect = thumbRef.value.getBoundingClientRect()
  thumbRef.value.style.setProperty('--cx', `${e.clientX - rect.left}px`)
  thumbRef.value.style.setProperty('--cy', `${e.clientY - rect.top}px`)
}

const play = () => emit('play', props.video)
</script>

<template>
  <article
    class="video-card"
    :class="`video-card--${ratio === '9:16' ? 'portrait' : 'landscape'}`"
    role="button"
    tabindex="0"
    :data-id="video.id"
    :aria-label="`Play ${video.title}`"
    @click="play"
    @keydown.enter.prevent="play"
    @keydown.space.prevent="play"
    @mouseenter="previewEnter(video.id)"
    @mouseleave="previewLeave(video.id)"
  >
    <div ref="thumbRef" class="video-card__thumb" @pointermove="onPointerMove">
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
      <span class="video-card__cursor" aria-hidden="true">Play</span>
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

.video-card__cursor {
  display: none;
}

@media (hover: hover) and (pointer: fine) {
  .video-card__thumb {
    cursor: none;
  }

  .video-card__cursor {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    transform: translate(calc(var(--cx, 50%) - 50%), calc(var(--cy, 50%) - 50%));
    padding: var(--space-02) var(--space-03);
    background: var(--overlay);
    border: 1px solid var(--gold);
    color: var(--gold);
    font-family: var(--mono);
    font-weight: 500;
    font-size: var(--fs-caption);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    line-height: 1;
    pointer-events: none;
    opacity: 0;
    transition: opacity var(--dur-fast) var(--ease-out-expo);
  }

  .video-card__thumb:hover .video-card__cursor {
    opacity: 1;
  }
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
