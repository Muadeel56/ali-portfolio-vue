<script setup>
import { useRouter } from 'vue-router'
import { useScrollReveal } from '@/composables/useScrollReveal.js'
import SectionHeader from '../ui/SectionHeader.vue'
import AppButton from '../ui/AppButton.vue'
import Rule from '../ui/Rule.vue'

const router = useRouter()
const cdnUrl = import.meta.env.VITE_CDN_URL

useScrollReveal('.about-section .reveal')

const scrollTo = (path) => {
  router.push(path)
}
</script>

<template>
  <section id="about" class="section about-section">
    <div class="container">
      <SectionHeader
        class="reveal"
        number="01"
        eyebrow="About"
        title="Create and combine frames"
        accent="frames"
      />

      <div class="about-section__grid grid-12">
        <div class="about-section__text reveal">
          <p class="about-section__body t-body-large">
            Every frame is a decision. I work at the intersection of technical craft and raw emotion —
            composing shots that don't just document a moment, but make you feel it.
          </p>
          <p class="about-section__body t-body-large">
            From intimate weddings and brand campaigns to cinematic short films, I bring a director's
            eye and a documentarian's patience to every project. Six years in, the obsession with
            light, motion, and storytelling hasn't dimmed.
          </p>

          <Rule class="about-section__rule" />

          <div class="about-section__stats">
            <span class="about-section__stat">200+ Weddings</span>
            <span class="about-section__stat-sep" aria-hidden="true">·</span>
            <span class="about-section__stat">50+ Events</span>
            <span class="about-section__stat-sep" aria-hidden="true">·</span>
            <span class="about-section__stat">6+ Years</span>
          </div>

          <div class="about-section__ctas">
            <AppButton variant="outline" show-arrow @click="scrollTo('/videography')">
              See My Work
            </AppButton>
          </div>
        </div>

        <figure class="about-section__media reveal">
          <div class="about-section__image">
            <img
              class="about-section__photo"
              :src="`${cdnUrl}/photos/ali-profile.jpeg`"
              width="900"
              height="1200"
              decoding="async"
              alt="Ali — Photographer & Videographer"
            />
            <div class="about-section__badge">
              <p class="about-section__badge-num">6+</p>
              <p class="about-section__badge-lbl">Years</p>
            </div>
          </div>
          <figcaption class="about-section__caption">Ali · 2026 · Self portrait</figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-section__grid {
  row-gap: var(--space-08);
  align-items: start;
}

/* ── Text column ── */
.about-section__body {
  max-width: 52ch;
}

.about-section__body + .about-section__body {
  margin-top: var(--space-04);
}

.about-section__rule {
  margin-top: var(--space-07);
}

.about-section__stats {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-02) var(--space-03);
  padding-top: var(--space-06);
}

.about-section__stat {
  font-family: var(--mono);
  font-size: var(--fs-label);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-dim);
  white-space: nowrap;
}

.about-section__stat-sep {
  color: var(--gold);
}

.about-section__ctas {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-04);
  margin-top: var(--space-06);
}

/* ── Image column ── */
.about-section__media {
  margin: 0;
}

.about-section__image {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  background: var(--surface-2);
  outline: 1px solid var(--gold);
  outline-offset: 1px;
}

.about-section__photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

.about-section__badge {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 2;
  min-width: 96px;
  padding: var(--space-04) var(--space-05);
  text-align: center;
  background: var(--bg);
  border-top: 1px solid var(--gold);
  border-left: 1px solid var(--gold);
}

.about-section__badge-num {
  font-family: var(--serif);
  font-weight: 400;
  font-size: var(--fs-h3);
  line-height: 1;
  color: var(--gold);
  margin: 0;
}

.about-section__badge-lbl {
  font-family: var(--mono);
  font-size: var(--fs-caption);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin: var(--space-02) 0 0;
  line-height: 1;
}

.about-section__caption {
  font-family: var(--mono);
  font-size: var(--fs-caption);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
  margin-top: var(--space-04);
}

@media (max-width: 639px) {
  .about-section__ctas {
    flex-direction: column;
  }

  .about-section__ctas :deep(.btn) {
    width: 100%;
  }
}

@media (min-width: 640px) and (max-width: 899px) {
  .about-section__media {
    grid-column: 3 / 11;
  }
}

/* Asymmetric split: text 1–6, portrait 8–12 */
@media (min-width: 900px) {
  .about-section__text {
    grid-column: 1 / 7;
  }

  .about-section__media {
    grid-column: 8 / 13;
  }
}
</style>
