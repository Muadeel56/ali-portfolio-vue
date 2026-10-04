<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { findService } from '@/data/services.js'
import Rule from '../ui/Rule.vue'

const props = defineProps({
  chapter: { type: Object, required: true },
})

const service = computed(() => findService(props.chapter.serviceId))
</script>

<template>
  <header class="chapter-opener" data-track-from="chapter">
    <div class="chapter-opener__grid grid-12">
      <!-- data-parallax: gentle drift on desktop (useParallax) -->
      <p class="t-display-hero chapter-opener__num" data-parallax>{{ chapter.number }}</p>
      <div class="chapter-opener__main">
        <h2 :id="`${chapter.id}-title`" class="t-display-h2">{{ chapter.title }}</h2>
        <p class="t-body-small chapter-opener__desc">{{ chapter.desc }}</p>
        <RouterLink
          v-if="service"
          class="t-label chapter-opener__service"
          :to="{ path: '/contact', query: { service: service.id } }"
        >Service: {{ service.title }} <span aria-hidden="true">→</span></RouterLink>
      </div>
    </div>
    <Rule class="chapter-opener__rule" />
  </header>
</template>

<style scoped>
.chapter-opener__grid {
  row-gap: var(--space-03);
  align-items: end;
}

.chapter-opener__num {
  color: var(--gold);
  line-height: 0.8;
}

.chapter-opener__desc {
  max-width: 52ch;
  margin-top: var(--space-03);
}

.chapter-opener__service {
  /* 44px tall hit area */
  display: inline-flex;
  align-items: center;
  gap: 0.5ch;
  min-height: var(--tap);
  margin-top: var(--space-03);
  text-decoration: underline;
  text-decoration-color: transparent;
  text-underline-offset: 6px;
  transition: text-decoration-color var(--dur-fast) var(--ease-out-expo);
}

.chapter-opener__service:hover,
.chapter-opener__service:focus-visible {
  text-decoration-color: var(--gold);
}

.chapter-opener__rule {
  margin-top: var(--space-06);
  margin-bottom: var(--space-07);
}

@media (min-width: 900px) {
  .chapter-opener__num {
    grid-column: 1 / 4;
  }

  .chapter-opener__main {
    grid-column: 4 / 11;
  }
}
</style>
