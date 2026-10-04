<script setup>
import { processSteps } from '@/data/process.js'
import SectionHeader from '../ui/SectionHeader.vue'
import Rule from '../ui/Rule.vue'

defineProps({
  number: { type: String, required: true },
  total: { type: String, required: true },
})
</script>

<template>
  <section class="section process-steps" aria-labelledby="process-title">
    <div class="container">
      <SectionHeader
        title-id="process-title"
        :number="number"
        :total="total"
        eyebrow="Process"
        title="From footage to final cut"
        accent="final cut"
        intro="A clear path with fixed checkpoints, so you always know what happens next."
      />

      <ol class="process-steps__list">
        <li v-for="step in processSteps" :key="step.num" class="process-steps__step">
          <div class="process-steps__marker">
            <span class="process-steps__num">{{ step.num }}</span>
            <Rule gold class="process-steps__rule" />
          </div>
          <h3 class="t-display-h3 process-steps__title">{{ step.title }}</h3>
          <p class="t-body-small process-steps__desc">{{ step.desc }}</p>
          <p class="t-mono process-steps__time"><b>{{ step.time }}</b></p>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.process-steps__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--space-07);
}

.process-steps__marker {
  display: flex;
  align-items: center;
  gap: var(--space-04);
}

.process-steps__num {
  font-family: var(--mono);
  font-size: var(--fs-label);
  letter-spacing: 0.2em;
  color: var(--gold);
}

.process-steps__rule {
  flex: 1;
}

.process-steps__title {
  margin-top: var(--space-05);
}

.process-steps__desc {
  margin-top: var(--space-03);
  max-width: 36ch;
}

.process-steps__time {
  margin: var(--space-04) 0 0;
}

/* Desktop: one row of four, the rules joining into a single line */
@media (min-width: 900px) {
  .process-steps__list {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    column-gap: 0;
  }

  .process-steps__step {
    padding-right: var(--gutter);
  }

  .process-steps__marker {
    margin-right: calc(var(--gutter) * -1);
  }

  .process-steps__step:last-child .process-steps__marker {
    margin-right: 0;
  }
}
</style>
