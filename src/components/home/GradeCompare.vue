<script setup>
import { ref, computed } from 'vue'
import { gradingPairs } from '@/data/grading.js'
import { cdn } from '@/data/videos.js'
import SectionHeader from '../ui/SectionHeader.vue'
import AppButton from '../ui/AppButton.vue'

defineProps({
  number: { type: String, required: true },
  total: { type: String, required: true },
})

const current = ref(0)
const pair = computed(() => gradingPairs[current.value])
const pos = ref(50)

const image = (base) => ({
  src: cdn(`${base}-1280.webp`),
  srcset: `${cdn(`${base}-640.webp`)} 640w, ${cdn(`${base}-1280.webp`)} 1280w`,
})

// Pointer dragging anywhere on the frame. Keyboard, touch-AT and screen readers use the range input.
const frameRef = ref(null)
let dragging = false

const setFromPointer = (e) => {
  const rect = frameRef.value.getBoundingClientRect()
  pos.value = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100))
}

const onPointerDown = (e) => {
  dragging = true
  frameRef.value.setPointerCapture(e.pointerId)
  setFromPointer(e)
}

const onPointerMove = (e) => {
  if (dragging) setFromPointer(e)
}

const onPointerUp = () => {
  dragging = false
}
</script>

<template>
  <section id="grading" class="section grade-compare" aria-labelledby="grade-title">
    <div class="container">
      <SectionHeader
        title-id="grade-title"
        :number="number"
        :total="total"
        eyebrow="Colour"
        title="Before and after the grade"
        accent="the grade"
        intro="Drag across the frame to compare the flat camera file with the finished grade."
      />

      <figure class="grade-compare__figure">
        <div
          ref="frameRef"
          class="grade-compare__frame"
          data-cursor="drag"
          :style="{ '--pos': `${pos}%` }"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
        >
          <img
            class="grade-compare__img"
            :class="{ 'grade-compare__img--flat': pair.placeholder }"
            v-bind="image(pair.before)"
            sizes="(max-width: 1280px) 100vw, 1280px"
            width="1280"
            height="720"
            loading="lazy"
            decoding="async"
            :alt="`${pair.project}, ungraded`"
          />
          <img
            class="grade-compare__img grade-compare__img--after"
            v-bind="image(pair.after)"
            sizes="(max-width: 1280px) 100vw, 1280px"
            width="1280"
            height="720"
            loading="lazy"
            decoding="async"
            :alt="`${pair.project}, graded`"
          />

          <span class="t-label grade-compare__tag grade-compare__tag--before" aria-hidden="true">Before</span>
          <span class="t-label grade-compare__tag grade-compare__tag--after" aria-hidden="true">After</span>

          <input
            v-model.number="pos"
            class="grade-compare__range"
            type="range"
            min="0"
            max="100"
            step="1"
            aria-label="Before and after color grade"
            :aria-valuetext="`${Math.round(pos)}% before`"
          />
          <span class="grade-compare__handle" aria-hidden="true" />
        </div>

        <figcaption class="grade-compare__caption">
          <span class="t-mono"><b>{{ pair.project }}</b></span>
          <span v-if="gradingPairs.length > 1" class="grade-compare__dots">
            <button
              v-for="(p, i) in gradingPairs"
              :key="p.id"
              type="button"
              class="grade-compare__dot"
              :aria-label="`Show ${p.project}`"
              :aria-pressed="i === current"
              @click="current = i"
            />
          </span>
        </figcaption>
      </figure>

      <div class="grade-compare__ctas">
        <AppButton variant="primary" :to="{ path: '/contact', query: { service: 'color-grading' } }" show-arrow>
          Grade my footage
        </AppButton>
        <AppButton variant="ghost" :to="{ path: '/services', hash: '#service-color-grading' }">Color grading service</AppButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.grade-compare__figure {
  margin: 0;
}

.grade-compare__frame {
  position: relative;
  aspect-ratio: 16 / 9;
  background: var(--surface-2);
  overflow: hidden;
  cursor: ew-resize;
  touch-action: pan-y;
  user-select: none;
}

.grade-compare__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

/* Placeholder only: fakes a flat log image until real ungraded frames arrive (see grading.js) */
.grade-compare__img--flat {
  filter: saturate(0.25) contrast(0.7) brightness(1.15);
}

.grade-compare__img--after {
  clip-path: inset(0 0 0 var(--pos));
}

.grade-compare__tag {
  position: absolute;
  top: var(--space-04);
  padding: var(--space-02) var(--space-03);
  background: var(--overlay);
  pointer-events: none;
}

.grade-compare__tag--before {
  left: var(--space-04);
}

.grade-compare__tag--after {
  right: var(--space-04);
}

/* The real control: covers the frame for assistive tech, but pointer input goes to the frame */
.grade-compare__range {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  pointer-events: none;
}

.grade-compare__handle {
  position: absolute;
  top: 0;
  bottom: 0;
  left: var(--pos);
  width: 1px;
  background: var(--gold);
  pointer-events: none;
}

.grade-compare__handle::after {
  content: '↔';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: var(--space-07);
  height: var(--space-07);
  display: grid;
  place-items: center;
  border: 1px solid var(--gold);
  border-radius: 50%;
  background: var(--overlay);
  color: var(--gold);
  font-size: var(--fs-body);
}

.grade-compare__range:focus-visible + .grade-compare__handle::after {
  outline: 1px solid var(--gold);
  outline-offset: var(--space-01);
  background: var(--gold);
  color: var(--bg);
}

.grade-compare__caption {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-04);
  margin-top: var(--space-04);
}

.grade-compare__dots {
  display: flex;
  gap: var(--space-03);
}

.grade-compare__dot {
  width: var(--space-03);
  height: var(--space-03);
  padding: 0;
  border: 1px solid var(--gold);
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
}

.grade-compare__dot[aria-pressed='true'] {
  background: var(--gold);
}

.grade-compare__ctas {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-04);
  margin-top: var(--space-07);
}
</style>
