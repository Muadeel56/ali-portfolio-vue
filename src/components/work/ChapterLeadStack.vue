<script setup>
import { computed } from 'vue'
import VideoCard from '../ui/VideoCard.vue'

// Desktop: the lead film over 8 of 12 columns, the others stacked in the remaining 4.
// The stack never mixes shapes: two 16:9 films stack, two 9:16 films sit side by side.
const props = defineProps({
  films: { type: Array, required: true },
  flip: { type: Boolean, default: false },
  priority: { type: Boolean, default: false },
})

const emit = defineEmits(['play'])

const lead = computed(() => props.films[0])
const stack = computed(() => props.films.slice(1))
const stackPortrait = computed(() => stack.value.length > 1 && stack.value.every((v) => v.aspect === '9:16'))

const leadSizes = '(max-width: 899px) 100vw, (max-width: 1280px) 66vw, 850px'
const stackSizes = computed(() =>
  stackPortrait.value ? '(max-width: 899px) 50vw, (max-width: 1280px) 16vw, 200px' : '(max-width: 899px) 100vw, (max-width: 1280px) 33vw, 420px',
)

if (import.meta.env.DEV) {
  console.assert(
    stack.value.every((v) => v.aspect === stack.value[0]?.aspect),
    `ChapterLeadStack: mixed shapes in the stack (${stack.value.map((v) => v.slug).join(', ')})`,
  )
}
</script>

<template>
  <div class="lead-stack grid-12" :class="{ 'lead-stack--flip': flip }">
    <VideoCard
      class="lead-stack__lead"
      :video="lead"
      aspect="16:9"
      :sizes="leadSizes"
      :priority="priority"
      @play="emit('play', $event)"
    />
    <div v-if="stack.length" class="lead-stack__stack" :class="{ 'lead-stack__stack--pair': stackPortrait }">
      <VideoCard
        v-for="video in stack"
        :key="video.slug"
        :video="video"
        :sizes="stackSizes"
        @play="emit('play', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.lead-stack {
  row-gap: var(--space-07);
  align-items: start;
}

.lead-stack__stack {
  display: grid;
  gap: var(--space-07);
}

.lead-stack__stack--pair {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: var(--gutter);
}

/* Tablet: the stack sits side by side under the lead */
@media (min-width: 640px) {
  .lead-stack__stack:not(.lead-stack__stack--pair) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: var(--gutter);
  }
}

@media (min-width: 900px) {
  .lead-stack__lead {
    grid-column: 1 / 9;
  }

  .lead-stack__stack {
    grid-column: 9 / 13;
    gap: var(--space-06);
  }

  /* Desktop: back to one column beside the lead */
  .lead-stack__stack:not(.lead-stack__stack--pair) {
    grid-template-columns: minmax(0, 1fr);
  }

  .lead-stack--flip .lead-stack__lead {
    grid-column: 5 / 13;
    grid-row: 1;
  }

  .lead-stack--flip .lead-stack__stack {
    grid-column: 1 / 5;
    grid-row: 1;
  }
}
</style>
