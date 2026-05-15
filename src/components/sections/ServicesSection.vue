<script setup>
import SectionLabel from '../ui/SectionLabel.vue'
</script>

<template>
  <section id="services" class="section services-section">
    <div class="container">
      <header class="section-header">
        <div>
          <p class="section-header__num"><span>03</span> / Services</p>
          <SectionLabel text="— 03 / Services" />
        </div>
        <p class="t-body-small section-header__desc">
          Editorial commissions, brand films, music videos and select wedding work.
        </p>
      </header>

      <h2 class="t-display-h2">What I <em>offer.</em></h2>

      <ul class="services-section__list">
        <li class="services-section__item">
          <span class="t-label">Photography</span>
          <p class="t-body-small">Editorial, portrait and documentary stills.</p>
        </li>
        <li class="services-section__item">
          <span class="t-label">Videography</span>
          <p class="t-body-small">Brand films, music videos and long-form documentary.</p>
        </li>
        <li class="services-section__item">
          <span class="t-label">Direction</span>
          <p class="t-body-small">Concept through final grade — one voice, start to finish.</p>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.services-section__list {
  list-style: none;
  margin: var(--space-08) 0 0;
  padding: 0;
  display: grid;
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
}

.services-section__item {
  background: var(--surface);
  padding: var(--space-06);
  display: flex;
  flex-direction: column;
  gap: var(--space-03);
}

@media (min-width: 768px) {
  .services-section__list {
    grid-template-columns: repeat(3, 1fr);
  }
}

.section-header__desc {
  margin: 0;
  max-width: 480px;
}
</style>
