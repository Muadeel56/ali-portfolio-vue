<script setup>
import VideoRail from '../ui/VideoRail.vue'

// Three phone-shaped films side by side; a swipe row on phones.
defineProps({
  films: { type: Array, required: true },
})

const emit = defineEmits(['play'])
</script>

<template>
  <VideoRail :videos="films" fit @play="emit('play', $event)" />
</template>
