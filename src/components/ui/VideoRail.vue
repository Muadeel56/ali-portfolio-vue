<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import VideoCard from './VideoCard.vue'

// A horizontal, snap-scrolling strip of vertical (9:16) films, so they never
// mix into a landscape grid. Arrow buttons for mouse users; swipe on touch.
// `fit`: up to three phone-framed films side by side when they fit (no arrows),
// a swipe row on phones.
const props = defineProps({
  videos: {
    type: Array,
    required: true,
  },
  label: {
    type: String,
    default: '',
  },
  fit: {
    type: Boolean,
    default: false,
  },
})

const sizes = props.fit ? '(max-width: 639px) 62vw, (max-width: 899px) 30vw, 300px' : '(max-width: 639px) 45vw, 240px'

const emit = defineEmits(['play'])

const trackRef = ref(null)
const atStart = ref(true)
const atEnd = ref(true)

const update = () => {
  const el = trackRef.value
  if (!el) return
  atStart.value = el.scrollLeft <= 1
  atEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1
}

const page = (dir) => {
  const el = trackRef.value
  el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
}

let resizeObserver

onMounted(() => {
  update()
  resizeObserver = new ResizeObserver(update)
  resizeObserver.observe(trackRef.value)
})

onUnmounted(() => resizeObserver?.disconnect())
</script>

<template>
  <div class="video-rail" :class="{ 'video-rail--fit': fit }">
    <div v-if="label || !(atStart && atEnd)" class="video-rail__head">
      <p v-if="label" class="video-rail__label">
        {{ label }} <span>{{ String(videos.length).padStart(2, '0') }}</span>
      </p>
      <div v-if="!(atStart && atEnd)" class="video-rail__nav">
        <button type="button" class="video-rail__btn" aria-label="Scroll left" :disabled="atStart" @click="page(-1)">←</button>
        <button type="button" class="video-rail__btn" aria-label="Scroll right" :disabled="atEnd" @click="page(1)">→</button>
      </div>
    </div>

    <div ref="trackRef" class="video-rail__track" @scroll.passive="update">
      <VideoCard
        v-for="video in videos"
        :key="video.slug"
        class="video-rail__item"
        :video="video"
        aspect="9:16"
        :sizes="sizes"
        @play="emit('play', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.video-rail__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-04);
  margin-bottom: var(--space-05);
}

.video-rail__label {
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--gold);
  margin: 0;
}

.video-rail__label span {
  font-family: var(--mono);
  color: var(--muted);
  margin-left: var(--space-02);
}

.video-rail__nav {
  display: flex;
  margin-left: auto;
  gap: var(--space-02);
}

.video-rail__btn {
  width: var(--space-07);
  height: var(--space-07);
  border: 1px solid var(--rule);
  background: transparent;
  color: var(--gold);
  cursor: pointer;
  transition:
    border-color var(--dur-fast) var(--ease-out-expo),
    opacity var(--dur-fast) var(--ease-out-expo);
}

.video-rail__btn:hover:not(:disabled) {
  border-color: var(--gold);
}

.video-rail__btn:disabled {
  opacity: 0.3;
  cursor: default;
}

.video-rail__track {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: calc((100% - var(--gutter)) / 2.2);
  gap: var(--gutter);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  /* Room for the focus ring inside the scroll box */
  padding: var(--space-01);
  margin: calc(var(--space-01) * -1);
}

.video-rail__track::-webkit-scrollbar {
  display: none;
}

.video-rail__item {
  scroll-snap-align: start;
}

@media (min-width: 640px) {
  .video-rail__track {
    grid-auto-columns: calc((100% - 3 * var(--gutter)) / 3.4);
  }
}

@media (min-width: 900px) {
  .video-rail__track {
    grid-auto-columns: calc((100% - 4 * var(--gutter)) / 5);
  }
}

/* ─── fit: phone cards ─────────────────────────────────────── */
.video-rail--fit :deep(.video-card__thumb) {
  border: 1px solid var(--rule);
  border-radius: var(--radius-phone);
}

.video-rail--fit .video-rail__track {
  grid-auto-columns: calc((100% - var(--gutter)) / 1.6);
}

@media (min-width: 640px) {
  .video-rail--fit .video-rail__track {
    grid-auto-columns: calc((100% - 2 * var(--gutter)) / 3);
  }
}

/* Keep three phones a readable height on wide screens */
@media (min-width: 900px) {
  .video-rail--fit {
    max-width: calc(var(--space-11) * 6);
    margin-inline: auto;
  }
}
</style>
