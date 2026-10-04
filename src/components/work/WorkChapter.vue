<script setup>
import ChapterOpener from './ChapterOpener.vue'
import ChapterLeadStack from './ChapterLeadStack.vue'
import ChapterPhones from './ChapterPhones.vue'

defineProps({
  chapter: { type: Object, required: true },
  films: { type: Array, required: true },
  // All 9:16: phone cards instead of lead + stack
  phones: { type: Boolean, default: false },
  // Lead on the right (desktop)
  flip: { type: Boolean, default: false },
  // The lead may sit above the fold: load it eagerly and never shutter it
  priority: { type: Boolean, default: false },
})

const emit = defineEmits(['play'])
</script>

<template>
  <section :id="chapter.id" class="work-chapter" :aria-labelledby="`${chapter.id}-title`">
    <ChapterOpener :chapter="chapter" />
    <ChapterPhones v-if="phones" :films="films" @play="emit('play', $event)" />
    <ChapterLeadStack v-else :films="films" :flip="flip" :priority="priority" @play="emit('play', $event)" />
  </section>
</template>

<style scoped>
.work-chapter {
  padding-top: var(--space-section);
  /* #hash jumps land below the navbar and the sticky chapter bar (+ its 2 border px) */
  scroll-margin-top: calc(var(--nav-h) + var(--space-07) + 2px);
}

.work-chapter:first-of-type {
  padding-top: var(--space-08);
}
</style>
