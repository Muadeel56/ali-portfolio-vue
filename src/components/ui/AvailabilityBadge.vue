<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { site } from '@/data/site.js'

// Pulsing gold dot + site.availability. The one place availability is rendered.
const props = defineProps({
  // Optional internal route (e.g. '/contact'); plain text otherwise
  to: {
    type: [String, Object],
    default: null,
  },
})

// A span, not a <p>: no default margin, so parents can position it freely
const tag = computed(() => (props.to ? RouterLink : 'span'))
</script>

<template>
  <component :is="tag" v-bind="to ? { to } : {}" class="t-mono availability" :class="{ 'availability--link': to }">
    <span class="availability__dot" aria-hidden="true" />
    <b>{{ site.availability }}</b>
  </component>
</template>

<style scoped>
.availability {
  display: inline-flex;
  align-items: center;
  gap: var(--space-02);
  line-height: 1.4;
  text-decoration: none;
}

.availability__dot {
  width: var(--space-02);
  height: var(--space-02);
  border-radius: 50%;
  background: var(--gold);
  flex-shrink: 0;
  animation: availability-blink var(--dur-loop) var(--ease-in-out) infinite;
}

.availability--link:hover b {
  color: var(--gold);
}

@keyframes availability-blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

/* Static dot (the global reduced-motion rule would leave it at a random frame) */
@media (prefers-reduced-motion: reduce) {
  .availability__dot {
    animation: none;
  }
}
</style>
