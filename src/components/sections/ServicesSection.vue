<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useScrollReveal } from '@/composables/useScrollReveal.js'
import SectionHeader from '../ui/SectionHeader.vue'
import Marquee from '../ui/Marquee.vue'
import Rule from '../ui/Rule.vue'

const router = useRouter()
useScrollReveal('.services-section .reveal')

const services = ref([
  {
    id: 1,
    num: '01',
    title: 'Wedding Film Edit',
    desc: 'Raw footage transformed into a cinematic wedding film — highlights, full ceremony cuts, and reception edits. Color graded, synced to music, and delivered in broadcast-ready formats.',
    tags: ['Highlight reel', 'Full ceremony cut', 'Color grading', 'Music sync'],
  },
  {
    id: 2,
    num: '02',
    title: 'Corporate & Brand Video Edit',
    desc: 'Polished edits for brand films, product launches, and corporate presentations. Clean pacing, branded motion graphics, and multiple revision rounds included.',
    tags: ['Brand films', 'Motion graphics', 'Multiple revisions', 'Branded delivery'],
  },
  {
    id: 3,
    num: '03',
    title: 'Short Form Content Edit',
    desc: 'Reels, TikToks, and social-first vertical cuts built for engagement — fast-paced editing, trending formats, captions, and platform-optimised delivery.',
    tags: ['Reels & TikToks', 'Vertical format', 'Captions & text', 'Fast turnaround'],
  },
  {
    id: 4,
    num: '04',
    title: 'Documentary & Long-Form Edit',
    desc: 'Story-driven editing for documentaries, interviews, and long-form content. Narrative structure, pacing, sound design, and colour work handled end-to-end.',
    tags: ['Story structure', 'Interview cutting', 'Sound design', 'Colour grade'],
  },
  {
    id: 5,
    num: '05',
    title: 'Color Grading',
    desc: 'Standalone colour grading for footage already shot. LUT creation, scene-by-scene correction, and cinematic grade delivery — compatible with Premiere, Resolve, and Final Cut.',
    tags: ['Scene correction', 'LUT creation', 'Cinematic grade', 'All NLE formats'],
  },
  {
    id: 6,
    num: '06',
    title: 'Podcast Video Edit',
    desc: 'Multi-camera podcast edits with jump-cut cleaning, lower thirds, intro/outro, and highlight clip exports for social distribution.',
    tags: ['Multi-cam sync', 'Jump-cut clean', 'Lower thirds', 'Highlight clips'],
  },
])

const serviceNames = services.value.map((s) => s.title)

const active = ref(0)

const toggle = (i) => {
  active.value = active.value === i ? null : i
}

const scrollToContact = () => {
  router.push('/contact')
}
</script>

<template>
  <section id="services" class="section services-section">
    <div class="container">
      <SectionHeader
        class="reveal"
        number="03"
        eyebrow="What I Offer"
        title="Services"
        accent="Services"
        intro="Editing, grading and finishing — from wedding films to brand work and short-form, delivered remotely to clients worldwide."
      />
    </div>

    <Marquee class="services-section__marquee reveal" :items="serviceNames" :speed="45" />

    <div class="container">
      <div class="services-section__grid grid-12">
        <!-- Accordion list -->
        <div class="services-section__list reveal">
          <Rule />
          <template v-for="(service, i) in services" :key="service.id">
            <div
              class="services-section__row"
              :class="{ 'is-active': active === i }"
              role="button"
              :aria-expanded="active === i"
              :tabindex="0"
              @click="toggle(i)"
              @keydown.enter.prevent="toggle(i)"
              @keydown.space.prevent="toggle(i)"
            >
              <span class="services-section__num" aria-hidden="true">{{ service.num }}</span>

              <div class="services-section__body">
                <h3 class="services-section__title">
                  {{ service.title }}
                  <span class="services-section__arrow" aria-hidden="true">→</span>
                </h3>

                <Transition name="slide">
                  <div v-if="active === i" class="services-section__expanded">
                    <p class="services-section__desc">{{ service.desc }}</p>
                    <div class="services-section__tags">
                      <span v-for="tag in service.tags" :key="tag" class="services-section__tag">{{ tag }}</span>
                    </div>
                    <a
                      class="services-section__enquire services-section__enquire--mobile"
                      href="/contact"
                      @click.stop.prevent="scrollToContact"
                    >Enquire →</a>
                  </div>
                </Transition>
              </div>

              <a
                class="services-section__enquire services-section__enquire--desktop"
                href="/contact"
                @click.stop.prevent="scrollToContact"
              >Enquire →</a>
            </div>
            <Rule />
          </template>
        </div>

        <!-- Meta column -->
        <aside class="services-section__meta reveal">
          <div><b>Rawalpindi · PK</b>Remote delivery</div>
          <div><b>Worldwide</b>Clients accepted globally</div>
          <div><b>2026</b>Booking now open</div>
        </aside>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ─── Slide transition ─────────────────────────────────────── */
.slide-enter-active,
.slide-leave-active {
  transition:
    max-height var(--dur-base) var(--ease-out-expo),
    opacity var(--dur-base) var(--ease-out-expo);
  overflow: hidden;
}
.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
}
.slide-enter-to,
.slide-leave-from {
  max-height: 400px;
  opacity: 1;
}

.services-section__marquee {
  margin-bottom: var(--space-08);
}

.services-section__grid {
  row-gap: var(--space-07);
  align-items: start;
}

/* ─── Accordion list ───────────────────────────────────────── */
.services-section__row {
  display: grid;
  grid-template-columns: 56px 1fr;
  gap: var(--space-05);
  align-items: start;
  padding: var(--space-07) var(--space-04);
  cursor: pointer;
  outline: none;
  transition: background-color var(--dur-base) var(--ease-out-expo);
}

.services-section__row:focus-visible {
  outline: 1px solid var(--gold);
  outline-offset: -1px;
}

.services-section__row:hover {
  background: var(--surface-2);
}

.services-section__row.is-active {
  background: var(--surface-3);
}

/* ─── Number ───────────────────────────────────────────────── */
.services-section__num {
  font-family: var(--mono);
  font-size: var(--fs-label);
  letter-spacing: 0.2em;
  line-height: 1;
  color: var(--muted);
  padding-top: var(--space-02);
  transition: color var(--dur-base) var(--ease-out-expo);
}

/* ─── Body ─────────────────────────────────────────────────── */
.services-section__title {
  font-family: var(--serif);
  font-weight: 400;
  font-size: var(--fs-h3);
  line-height: 1.1;
  color: var(--text);
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: color var(--dur-base) var(--ease-out-expo);
}

.services-section__arrow {
  font-family: var(--sans);
  font-size: var(--fs-body);
  color: var(--gold);
  opacity: 0;
  transform: translateX(-8px);
  transition:
    opacity var(--dur-base) var(--ease-out-expo),
    transform var(--dur-base) var(--ease-out-expo);
}

.services-section__desc {
  font-size: var(--fs-body);
  line-height: 1.7;
  color: var(--text-dim);
  max-width: 56ch;
  margin: var(--space-03) 0 0;
}

.services-section__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-02);
  margin-top: var(--space-05);
}

.services-section__tag {
  border: 1px solid var(--rule);
  padding: 6px 12px;
  font-family: var(--mono);
  font-size: var(--fs-caption);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--text-dim);
  line-height: 1.2;
  transition:
    border-color var(--dur-fast) var(--ease-out-expo),
    color var(--dur-fast) var(--ease-out-expo);
}

.services-section__expanded {
  padding-bottom: var(--space-02);
}

.services-section__enquire {
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-dim);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  padding-bottom: 3px;
  line-height: 1;
  transition:
    color var(--dur-fast) var(--ease-out-expo),
    border-color var(--dur-fast) var(--ease-out-expo);
}

.services-section__enquire--mobile {
  display: inline-block;
  margin-top: var(--space-05);
}

.services-section__enquire--desktop {
  display: none;
}

/* ─── Active / hover row ───────────────────────────────────── */
.services-section__row.is-active .services-section__num,
.services-section__row:hover .services-section__num,
.services-section__row.is-active .services-section__title,
.services-section__row:hover .services-section__title,
.services-section__row.is-active .services-section__enquire,
.services-section__row:hover .services-section__enquire {
  color: var(--gold);
}

.services-section__row.is-active .services-section__enquire,
.services-section__row:hover .services-section__enquire {
  border-bottom-color: var(--gold);
}

.services-section__row.is-active .services-section__arrow,
.services-section__row:hover .services-section__arrow {
  opacity: 1;
  transform: translateX(0);
}

.services-section__row.is-active .services-section__tag {
  border-color: var(--gold-dim);
  color: var(--text);
}

/* ─── Meta ─────────────────────────────────────────────────── */
.services-section__meta {
  display: grid;
  gap: var(--space-05);
  font-family: var(--mono);
  font-size: var(--fs-caption);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
  line-height: 1.6;
}

.services-section__meta b {
  display: block;
  color: var(--text-dim);
  font-weight: 500;
}

/* ─── Responsive ───────────────────────────────────────────── */
@media (min-width: 640px) {
  .services-section__row {
    grid-template-columns: 64px 1fr auto;
    gap: var(--space-06);
  }

  .services-section__enquire--mobile {
    display: none;
  }

  .services-section__enquire--desktop {
    display: inline-block;
    align-self: center;
    white-space: nowrap;
  }

  .services-section__meta {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* List 1–8, meta 10–12 */
@media (min-width: 900px) {
  .services-section__list {
    grid-column: 1 / 9;
  }

  .services-section__meta {
    grid-column: 10 / 13;
    grid-template-columns: 1fr;
    position: sticky;
    top: calc(var(--nav-height-desktop) + var(--space-06));
  }
}
</style>
