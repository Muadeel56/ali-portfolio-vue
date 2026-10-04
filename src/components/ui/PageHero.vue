<script setup>
import { computed } from 'vue'
import Rule from './Rule.vue'

// Opening block for every inner page: eyebrow, the page's <h1>, an intro and a mono meta row.
// The title slides up out of a mask like the home hero (CSS only, instant with reduced motion).
const props = defineProps({
  eyebrow: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  // Word or phrase inside `title` rendered in gold
  accent: {
    type: String,
    default: '',
  },
  intro: {
    type: String,
    default: '',
  },
  // Short facts along the bottom rule, e.g. ['05 chapters', 'Remote worldwide']
  meta: {
    type: Array,
    default: () => [],
  },
})

const titleParts = computed(() => {
  const i = props.accent ? props.title.indexOf(props.accent) : -1
  if (i === -1) return { before: props.title, accent: '', after: '' }
  return {
    before: props.title.slice(0, i),
    accent: props.accent,
    after: props.title.slice(i + props.accent.length),
  }
})
</script>

<template>
  <header class="page-hero">
    <div class="container">
      <p class="t-label page-hero__eyebrow">
        {{ eyebrow }}
        <Rule gold length="48px" />
      </p>

      <div class="page-hero__grid grid-12">
        <h1 class="t-display-hero page-hero__title">
          <span class="page-hero__mask">
            <span class="page-hero__line">
              {{ titleParts.before }}<span v-if="titleParts.accent" class="accent">{{ titleParts.accent }}</span>{{ titleParts.after }}
            </span>
          </span>
        </h1>
        <p v-if="intro || $slots.default" class="t-body-large page-hero__intro">
          <slot>{{ intro }}</slot>
        </p>
      </div>

      <Rule class="page-hero__rule" />
      <ul v-if="meta.length" class="t-mono page-hero__meta">
        <li v-for="item in meta" :key="item">{{ item }}</li>
      </ul>
    </div>
  </header>
</template>

<style scoped>
.page-hero {
  padding: calc(var(--nav-h) + var(--space-09)) var(--gutter) 0;
}

.page-hero__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: var(--space-04);
  margin: 0 0 var(--space-06);
}

.page-hero__grid {
  row-gap: var(--space-06);
  align-items: end;
}

.page-hero__title {
  line-height: 0.92;
}

/* The whole title slides up out of its mask, like the home hero lines */
.page-hero__mask {
  display: block;
  overflow: hidden;
  /* Room for descenders inside the mask */
  padding-bottom: 0.06em;
}

.page-hero__line {
  display: block;
  animation: page-hero-line var(--dur-slow) var(--ease-out-expo) both;
  animation-delay: var(--dur-fast);
}

@keyframes page-hero-line {
  from {
    transform: translateY(105%);
  }
  to {
    transform: translateY(0);
  }
}

.page-hero__intro {
  max-width: 48ch;
  margin: 0;
}

.page-hero__rule {
  margin-top: var(--space-08);
}

.page-hero__meta {
  list-style: none;
  margin: 0;
  padding: var(--space-04) 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-02) var(--space-06);
}

/* Gold dot between facts */
.page-hero__meta li + li::before {
  content: '·';
  color: var(--gold);
  margin-right: var(--space-06);
}

@media (min-width: 900px) {
  .page-hero__title {
    grid-column: 1 / 9;
  }

  .page-hero__intro {
    grid-column: 9 / 13;
    padding-bottom: var(--space-03);
  }
}

@media (prefers-reduced-motion: reduce) {
  .page-hero__line {
    animation: none;
  }
}
</style>
