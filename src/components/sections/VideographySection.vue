<script setup>
import SectionLabel from '../ui/SectionLabel.vue'
</script>

<template>
  <section id="videography" class="section videography-section">
    <div class="container">
      <header class="section-header">
        <div>
          <p class="section-header__num"><span>05</span> / Videography</p>
          <SectionLabel text="— 05 / Videography" />
        </div>
        <p class="t-body-small section-header__desc">
          Brand films, music videos and long-form documentary — twenty-four still photographs per second.
        </p>
      </header>

      <h2 class="t-display-h2">Moving image, <em>held still.</em></h2>

      <div class="gold-frame videography-section__reel">
        <span class="videography-section__label t-caption">— Reel · 2026 —</span>
        <span class="gold-frame__corner gold-frame__corner--tl" aria-hidden="true" />
        <span class="gold-frame__corner gold-frame__corner--br" aria-hidden="true" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.videography-section__reel {
  aspect-ratio: 16 / 9;
  margin-top: var(--space-08);
  min-height: 280px;
}

.videography-section__label {
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
