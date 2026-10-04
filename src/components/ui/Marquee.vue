<script setup>
import Rule from './Rule.vue'

defineProps({
  items: {
    type: Array,
    required: true,
  },
  // Seconds per full loop
  speed: {
    type: Number,
    default: 40,
  },
  variant: {
    type: String,
    default: 'serif',
    validator: (v) => ['serif', 'mono'].includes(v),
  },
})
</script>

<template>
  <div class="marquee" :class="`marquee--${variant}`" :style="{ '--marquee-speed': `${speed}s` }">
    <Rule />
    <div class="marquee__inner">
      <ul class="marquee__track">
        <li v-for="item in items" :key="item" class="marquee__item">{{ item }}</li>
      </ul>
      <ul class="marquee__track" aria-hidden="true">
        <li v-for="item in items" :key="item" class="marquee__item">{{ item }}</li>
      </ul>
    </div>
    <Rule />
  </div>
</template>

<style scoped>
.marquee {
  overflow: hidden;
}

.marquee__inner {
  display: flex;
  width: max-content;
  padding-block: var(--space-04);
  animation: marquee var(--marquee-speed) var(--ease-linear) infinite;
}

.marquee__track {
  display: flex;
  flex-shrink: 0;
  list-style: none;
  margin: 0;
  padding: 0;
}

.marquee__item {
  display: flex;
  align-items: center;
  white-space: nowrap;
  color: var(--text-dim);
}

/* Gold separator between items */
.marquee__item::after {
  content: '·';
  color: var(--gold);
  padding-inline: var(--space-06);
}

.marquee--serif .marquee__item {
  font-family: var(--serif);
  font-size: var(--fs-h3);
  line-height: 1;
}

.marquee--mono .marquee__item {
  font-family: var(--mono);
  font-size: var(--fs-label);
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

@keyframes marquee {
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .marquee__inner {
    animation-play-state: paused;
  }
}
</style>
