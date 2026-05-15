<script setup>
import SectionLabel from '../ui/SectionLabel.vue'
</script>

<template>
  <section id="photography" class="section photography-section">
    <div class="container">
      <header class="section-header">
        <div>
          <p class="section-header__num"><span>04</span> / Photography</p>
          <SectionLabel text="— 04 / Selected Work" />
        </div>
        <p class="t-body-small section-header__desc">
          Selected stills from a six-year practice in long-form documentary and fashion.
        </p>
      </header>

      <h2 class="t-display-h2">Selected work, <em>2019 — present</em></h2>

      <div class="photography-section__grid">
        <div
          v-for="n in 6"
          :key="n"
          class="gold-frame photography-section__plate"
        >
          <span class="photography-section__caption t-caption">Plate {{ String(n).padStart(2, '0') }} —</span>
          <span class="gold-frame__corner gold-frame__corner--tl" aria-hidden="true" />
          <span class="gold-frame__corner gold-frame__corner--br" aria-hidden="true" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.photography-section__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-05);
  margin-top: var(--space-08);
}

@media (min-width: 900px) {
  .photography-section__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.photography-section__plate {
  aspect-ratio: 4 / 5;
  min-height: 200px;
}

.photography-section__caption {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-header__desc {
  margin: 0;
  max-width: 480px;
}
</style>
