<script setup>
import { useScrollReveal } from '@/composables/useScrollReveal.js'
import { about } from '@/data/about.js'
import SectionHeader from '../ui/SectionHeader.vue'
import AppButton from '../ui/AppButton.vue'
import Rule from '../ui/Rule.vue'

defineProps({
  // Numbering for the "Approach" block, e.g. 01 / 02
  number: { type: String, required: true },
  total: { type: String, required: true },
})

const cdnUrl = import.meta.env.VITE_CDN_URL

useScrollReveal('.about-section .reveal')
</script>

<template>
  <div class="about-section">
    <!-- ── Bio: portrait left, words right ── -->
    <section class="section section--after-hero about-section__bio" aria-label="Biography">
      <div class="container">
        <div class="about-section__grid grid-12">
          <figure class="about-section__media reveal">
            <div class="about-section__image">
              <img
                class="about-section__photo"
                :src="`${cdnUrl}/photos/ali-profile.jpeg`"
                width="900"
                height="1200"
                fetchpriority="high"
                decoding="async"
                alt="Ali Hassan, videographer and editor"
              />
              <div class="about-section__badge">
                <p class="about-section__badge-num">{{ about.years }}</p>
                <p class="about-section__badge-lbl">Years</p>
              </div>
            </div>
            <figcaption class="t-mono about-section__caption">Ali Hassan · Portrait · 2026</figcaption>
          </figure>

          <div class="about-section__text reveal">
            <blockquote class="about-section__quote">
              <p class="t-display-h2">“{{ about.pullQuote }}”</p>
            </blockquote>

            <p v-for="para in about.bio" :key="para" class="t-body-large about-section__body">{{ para }}</p>

            <dl class="about-section__facts">
              <div v-for="fact in about.facts" :key="fact.label" class="about-section__fact">
                <dt class="t-mono">{{ fact.label }}</dt>
                <dd>{{ fact.value }}</dd>
              </div>
            </dl>

            <div class="about-section__ctas">
              <AppButton variant="primary" show-arrow to="/work">See the work</AppButton>
              <AppButton variant="outline" to="/contact">Start a project</AppButton>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── Approach: three principles ── -->
    <section class="section section--flush-top about-section__approach" aria-labelledby="approach-title">
      <div class="container">
        <SectionHeader
          class="reveal"
          title-id="approach-title"
          :number="number"
          :total="total"
          eyebrow="Approach"
          title="How I cut a film"
          accent="cut"
          intro="Three habits that shape every project, whatever the footage."
        />

        <ol class="about-section__principles grid-12">
          <li v-for="item in about.principles" :key="item.num" class="about-section__principle reveal">
            <span class="t-display-hero about-section__principle-num" aria-hidden="true">{{ item.num }}</span>
            <Rule gold length="48px" />
            <h3 class="t-display-h3 about-section__principle-title">{{ item.title }}</h3>
            <p class="t-body-small about-section__principle-desc">{{ item.desc }}</p>
          </li>
        </ol>
      </div>
    </section>
  </div>
</template>

<style scoped>
.about-section__grid {
  row-gap: var(--space-08);
  align-items: start;
}

/* ── Portrait ── */
.about-section__media {
  margin: 0;
}

.about-section__image {
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  background: var(--surface-2);
  overflow: hidden;
}

/* Monochrome to sit with the palette; colour returns on hover */
.about-section__photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  filter: grayscale(1) contrast(1.05);
  transition: filter var(--dur-slow) var(--ease-out-expo);
}

.about-section__image:hover .about-section__photo {
  filter: none;
}

.about-section__badge {
  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 2;
  padding: var(--space-04) var(--space-05);
  text-align: center;
  background: var(--bg);
  border-top: 1px solid var(--gold);
  border-left: 1px solid var(--gold);
}

.about-section__badge-num {
  font-family: var(--serif);
  font-weight: 400;
  font-size: var(--fs-h2);
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
  display: block;
  margin-top: var(--space-04);
}

/* ── Words ── */
.about-section__quote {
  margin: 0 0 var(--space-06);
}

.about-section__quote p {
  color: var(--gold);
  max-width: 16ch;
}

.about-section__body {
  max-width: 54ch;
}

.about-section__body + .about-section__body {
  margin-top: var(--space-04);
}

.about-section__facts {
  display: grid;
  grid-template-columns: 1fr;
  margin: var(--space-07) 0 0;
  border-top: 1px solid var(--rule);
}

.about-section__fact {
  padding: var(--space-04) var(--space-04) var(--space-04) 0;
  border-bottom: 1px solid var(--rule);
}

.about-section__fact dt {
  display: block;
}

.about-section__fact dd {
  margin: var(--space-01) 0 0;
  font-size: var(--fs-body);
  color: var(--text);
}

.about-section__ctas {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-04);
  margin-top: var(--space-07);
}

/* ── Principles ── */
.about-section__principles {
  list-style: none;
  margin: 0;
  padding: 0;
  row-gap: var(--space-08);
}

.about-section__principle {
  display: flex;
  flex-direction: column;
  gap: var(--space-04);
}

.about-section__principle-num {
  color: var(--surface-3);
  -webkit-text-stroke: 1px var(--gold-dim);
  line-height: 0.8;
}

.about-section__principle-title {
  margin-top: var(--space-02);
}

.about-section__principle-desc {
  max-width: 40ch;
}

/* Phones: full-width CTAs, one fact per row */
.about-section__ctas > * {
  flex: 1 1 100%;
}

@media (min-width: 640px) {
  .about-section__ctas > * {
    flex: 0 1 auto;
  }

  .about-section__facts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  /* Tablet: inset portrait (the 900px layout below takes over) */
  .about-section__media {
    grid-column: 2 / 12;
  }
}

/* Portrait 1–5, words 7–12; principles in three columns */
@media (min-width: 900px) {
  .about-section__media {
    grid-column: 1 / 6;
    position: sticky;
    top: calc(var(--nav-h) + var(--space-06));
  }

  .about-section__text {
    grid-column: 7 / 13;
  }

  .about-section__principle {
    grid-column: span 4;
  }
}
</style>
