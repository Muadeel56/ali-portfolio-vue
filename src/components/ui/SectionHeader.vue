<script setup>
import { computed } from 'vue'
import Rule from './Rule.vue'

const props = defineProps({
  number: {
    type: String,
    required: true,
  },
  total: {
    type: String,
    default: '04',
  },
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
  <header class="section-header">
    <div class="section-header__grid grid-12">
      <div class="section-header__meta">
        <p class="section-header__num">
          <span>{{ number }}</span> / {{ total }}
        </p>
        <p class="section-header__eyebrow">
          {{ eyebrow }}
          <Rule gold length="48px" />
        </p>
      </div>

      <div class="section-header__main">
        <h2 class="section-header__title">
          {{ titleParts.before }}<span v-if="titleParts.accent" class="accent">{{ titleParts.accent }}</span>{{ titleParts.after }}
        </h2>
        <p v-if="intro || $slots.default" class="section-header__intro">
          <slot>{{ intro }}</slot>
        </p>
      </div>
    </div>
    <Rule class="section-header__rule" />
  </header>
</template>

<style scoped>
.section-header {
  margin-bottom: var(--space-08);
}

.section-header__grid {
  row-gap: var(--space-05);
}

.section-header__num {
  font-family: var(--mono);
  font-size: var(--fs-label);
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--muted);
  margin: 0 0 var(--space-03);
}

.section-header__num span {
  color: var(--gold);
}

.section-header__eyebrow {
  font-family: var(--sans);
  font-weight: 500;
  font-size: var(--fs-label);
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--gold);
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: var(--space-04);
}

.section-header__title {
  font-family: var(--serif);
  font-weight: 400;
  font-size: var(--fs-h2);
  line-height: 1;
  letter-spacing: 0.01em;
  color: var(--text);
  margin: 0;
}

.section-header__intro {
  font-family: var(--sans);
  font-weight: 400;
  font-size: var(--fs-body-lg);
  line-height: 1.7;
  color: var(--text-dim);
  max-width: 56ch;
  margin: var(--space-05) 0 0;
}

.section-header__rule {
  margin-top: var(--space-06);
}

@media (min-width: 900px) {
  .section-header__grid {
    align-items: end;
  }

  .section-header__meta {
    grid-column: 1 / 5;
  }

  .section-header__main {
    grid-column: 5 / 13;
  }
}
</style>
