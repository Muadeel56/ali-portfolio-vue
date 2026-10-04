<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { testimonials } from '@/data/testimonials.js'
import { prefersReducedMotion } from '@/data/videos.js'
import SectionHeader from '../ui/SectionHeader.vue'

defineProps({
  number: { type: String, required: true },
  total: { type: String, required: true },
})

const ADVANCE_MS = 8000

const index = ref(0)
const current = computed(() => testimonials[index.value])
const many = testimonials.length > 1

const go = (step) => {
  index.value = (index.value + step + testimonials.length) % testimonials.length
}

// Auto-advance: paused on hover/focus, off with reduced motion.
const autoplay = ref(false)
const paused = ref(false)
let timer

onMounted(() => {
  autoplay.value = many && !prefersReducedMotion()
  if (!autoplay.value) return
  timer = setInterval(() => {
    if (!paused.value) go(1)
  }, ADVANCE_MS)
})

onUnmounted(() => clearInterval(timer))

const onFocusOut = (e) => {
  if (!e.currentTarget.contains(e.relatedTarget)) paused.value = false
}
</script>

<template>
  <section v-if="testimonials.length" class="section testimonials" aria-labelledby="testimonials-title">
    <div class="container">
      <SectionHeader title-id="testimonials-title" :number="number" :total="total" eyebrow="Clients" title="In their words" accent="words" />

      <div
        class="testimonials__stage"
        @mouseenter="paused = true"
        @mouseleave="paused = false"
        @focusin="paused = true"
        @focusout="onFocusOut"
      >
        <!-- Announce changes only when the visitor drives them -->
        <div :aria-live="autoplay && !paused ? 'off' : 'polite'">
          <figure :key="index" class="testimonials__figure">
            <blockquote class="testimonials__quote">
              <p>“{{ current.quote }}”</p>
            </blockquote>
            <figcaption class="t-label testimonials__by">
              {{ current.name }}<span class="testimonials__role"> · {{ current.role }}, {{ current.company }}</span>
            </figcaption>
          </figure>
        </div>

        <div v-if="many" class="testimonials__controls">
          <button type="button" class="testimonials__btn" aria-label="Previous testimonial" @click="go(-1)">←</button>
          <span class="t-mono testimonials__count">
            <b>{{ String(index + 1).padStart(2, '0') }}</b> / {{ String(testimonials.length).padStart(2, '0') }}
          </span>
          <button type="button" class="testimonials__btn" aria-label="Next testimonial" @click="go(1)">→</button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.testimonials__figure {
  margin: 0;
}

.testimonials__quote {
  margin: 0;
}

.testimonials__quote p {
  font-family: var(--serif);
  font-weight: 400;
  font-size: var(--fs-h1);
  line-height: 1;
  color: var(--text);
  max-width: 22ch;
  margin: 0;
}

.testimonials__by {
  display: block;
  margin-top: var(--space-06);
}

.testimonials__role {
  color: var(--text-dim);
}

.testimonials__controls {
  display: flex;
  align-items: center;
  gap: var(--space-05);
  margin-top: var(--space-07);
}

.testimonials__btn {
  width: var(--space-07);
  height: var(--space-07);
  border: 1px solid var(--rule);
  background: transparent;
  color: var(--gold);
  cursor: pointer;
  transition: border-color var(--dur-fast) var(--ease-out-expo);
}

.testimonials__btn:hover {
  border-color: var(--gold);
}

.testimonials__count {
  margin: 0;
}
</style>
