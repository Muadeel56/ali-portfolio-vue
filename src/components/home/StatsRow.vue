<script setup>
import { ref } from 'vue'
import { site } from '@/data/site.js'
import { useMotion, tokenSeconds } from '@/composables/useMotion.js'

// 40+ films · 6 brands · 3 countries. The DOM always holds the final values (screen readers,
// SEO, no JS); the visible, aria-hidden copy counts up once when the row scrolls into view.
const rootRef = ref(null)
const finalText = (stat) => `${stat.value}${stat.suffix ?? ''}`

useMotion(
  (ctx, { gsap, conditions }) => {
    const items = gsap.utils.toArray('.stats-row__item', rootRef.value)
    items.forEach((item, i) => {
      const scrollTrigger = { trigger: item, start: 'top 90%', once: true }
      if (conditions.reduced) {
        gsap.from(item, { opacity: 0, duration: tokenSeconds('--dur-base'), scrollTrigger })
        return
      }
      const stat = site.stats[i]
      const num = item.querySelector('.stats-row__num')
      const counter = { value: 0 }
      gsap.to(counter, {
        value: stat.value,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger,
        onUpdate: () => {
          num.textContent = `${Math.round(counter.value)}${stat.suffix ?? ''}`
        },
      })
    })
    // Interrupted (unmount, preference change): put the final values back
    return () => {
      items.forEach((item, i) => {
        item.querySelector('.stats-row__num').textContent = finalText(site.stats[i])
      })
    }
  },
  { scope: rootRef },
)
</script>

<template>
  <section v-if="site.stats.length" ref="rootRef" class="stats-row" aria-label="In numbers">
    <ul class="stats-row__list container">
      <li v-for="stat in site.stats" :key="stat.label" class="stats-row__item">
        <span class="visually-hidden">{{ finalText(stat) }} {{ stat.label }}</span>
        <span class="stats-row__visual" aria-hidden="true">
          <span class="t-display-h2 stats-row__num">{{ finalText(stat) }}</span>
          <span class="t-label stats-row__label">{{ stat.label }}</span>
        </span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.stats-row {
  padding-block: var(--space-08) 0;
}

.stats-row__list {
  list-style: none;
  margin: 0 auto;
  padding: 0 var(--gutter);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-05) var(--space-08);
}

.stats-row__visual {
  display: inline-flex;
  align-items: baseline;
  gap: var(--space-03);
}

/* Fixed-width digits so the row doesn't jitter while counting */
.stats-row__num {
  font-variant-numeric: tabular-nums;
}

.stats-row__label {
  color: var(--text-dim);
}
</style>
