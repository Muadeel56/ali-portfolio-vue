<script setup>
import Rule from './Rule.vue'

defineProps({
  // Strings, or objects rendered through the #item slot (keyed by `name`)
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
  pauseOnHover: {
    type: Boolean,
    default: false,
  },
})

const keyOf = (item) => (typeof item === 'string' ? item : item.name)
</script>

<template>
  <div
    class="marquee"
    :class="[`marquee--${variant}`, { 'marquee--pausable': pauseOnHover }]"
    :style="{ '--marquee-speed': `${speed}s` }"
  >
    <Rule />
    <div class="marquee__inner">
      <ul class="marquee__track">
        <li v-for="item in items" :key="keyOf(item)" class="marquee__item">
          <slot name="item" :item="item" :duplicate="false">{{ item }}</slot>
        </li>
      </ul>
      <!-- Duplicate track for the seamless loop; hidden from assistive tech -->
      <ul class="marquee__track marquee__track--dup" aria-hidden="true">
        <li v-for="item in items" :key="keyOf(item)" class="marquee__item">
          <slot name="item" :item="item" :duplicate="true">{{ item }}</slot>
        </li>
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

.marquee--pausable:hover .marquee__inner {
  animation-play-state: paused;
}

/* Reduced motion: a static, wrapping row instead of a loop */
@media (prefers-reduced-motion: reduce) {
  .marquee__inner {
    animation: none;
    width: auto;
    justify-content: center;
  }

  .marquee__track {
    flex-shrink: 1;
    flex-wrap: wrap;
    justify-content: center;
    row-gap: var(--space-03);
  }

  .marquee__track--dup {
    display: none;
  }
}
</style>
