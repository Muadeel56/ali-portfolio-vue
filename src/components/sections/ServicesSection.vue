<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useScrollReveal } from '@/composables/useScrollReveal.js'
import { whatsappService } from '@/composables/useWhatsApp.js'
import { services, formatPrice, serviceThumb } from '@/data/services.js'
import { site } from '@/data/site.js'
import SectionHeader from '../ui/SectionHeader.vue'
import Marquee from '../ui/Marquee.vue'
import Rule from '../ui/Rule.vue'
import VideoCard from '../ui/VideoCard.vue'

defineProps({
  number: { type: String, required: true },
  total: { type: String, required: true },
})

useScrollReveal('.services-section .reveal')

const serviceNames = services.map((s) => s.title)

// Every service is open: the page exists to compare them. /services#service-<id>
// (e.g. from the home page grading slider) is a plain anchor.
const rows = services.map((service) => ({ service, thumb: serviceThumb(service), price: formatPrice(service.priceFrom) }))

// The row in the middle of the screen sets the floating WhatsApp button's message.
const listRef = ref(null)
let observer

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) whatsappService.value = services.find((s) => `service-${s.id}` === entry.target.id) ?? null
      }
    },
    { rootMargin: '-45% 0px -45% 0px' },
  )
  for (const row of listRef.value.querySelectorAll('.services-section__item')) observer.observe(row)
})

onUnmounted(() => {
  observer?.disconnect()
  whatsappService.value = null
})
</script>

<template>
  <section
    id="services"
    class="section section--after-hero services-section"
    aria-labelledby="services-title"
    data-track-from="services"
  >
    <div class="container">
      <SectionHeader
        class="reveal"
        title-id="services-title"
        :number="number"
        :total="total"
        eyebrow="What I offer"
        title="Pick the closest fit"
        accent="closest fit"
        intro="What's included, how long it takes, and the work it looks like. Enquire opens the form with the service already selected."
      />
    </div>

    <Marquee class="services-section__marquee bleed reveal" :items="serviceNames" :speed="45" />

    <div class="container">
      <aside class="services-section__meta reveal" aria-label="Booking details">
        <div><b>Rawalpindi · PK</b>Remote delivery</div>
        <div><b>Worldwide</b>Clients accepted globally</div>
        <div><b>{{ site.availability }}</b>Quote within 24h</div>
      </aside>

      <!-- No .reveal on rows: its transform would offset the #service-id anchor scroll -->
      <ol ref="listRef" class="services-section__list">
        <li
          v-for="{ service, thumb, price } in rows"
          :id="`service-${service.id}`"
          :key="service.id"
          class="services-section__item"
        >
          <Rule />
          <article class="services-section__row grid-12" :aria-labelledby="`service-${service.id}-title`">
            <div class="services-section__text">
              <p class="services-section__num" aria-hidden="true">{{ service.num }}</p>
              <h3 :id="`service-${service.id}-title`" class="t-display-h3 services-section__title">{{ service.title }}</h3>
              <p class="t-body-small services-section__desc">{{ service.desc }}</p>

              <ul class="services-section__tags" aria-label="Deliverables">
                <li v-for="item in service.deliverables" :key="item" class="services-section__tag">{{ item }}</li>
              </ul>

              <p class="t-mono services-section__facts">
                <span>Turnaround · <b>{{ service.turnaround }}</b></span>
                <span v-if="price"><b>{{ price }}</b></span>
              </p>

              <RouterLink
                class="services-section__enquire"
                :to="{ path: '/contact', query: { service: service.id } }"
                :aria-label="`Enquire about ${service.title}`"
              >Enquire →</RouterLink>
            </div>

            <VideoCard
              v-if="thumb"
              class="services-section__thumb"
              :video="thumb.video ?? { poster: thumb.poster, title: thumb.title }"
              aspect="16:9"
              :to="thumb.to"
              :label="thumb.label"
              sizes="(min-width: 900px) 34vw, 100vw"
            />
          </article>
        </li>
      </ol>
      <Rule />
    </div>
  </section>
</template>

<style scoped>
.services-section__marquee {
  margin-bottom: var(--space-07);
}

/* ─── Meta strip ───────────────────────────────────────────── */
.services-section__meta {
  display: grid;
  gap: var(--space-05);
  margin-bottom: var(--space-07);
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

/* ─── Rows ─────────────────────────────────────────────────── */
.services-section__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.services-section__row {
  row-gap: var(--space-05);
  align-items: start;
  padding-block: var(--space-07);
}

/* Phones: thumbnail above the text */
.services-section__thumb {
  order: -1;
}

.services-section__num {
  font-family: var(--mono);
  font-size: var(--fs-label);
  letter-spacing: 0.2em;
  line-height: 1;
  color: var(--gold);
  margin: 0 0 var(--space-03);
}

.services-section__desc {
  max-width: 56ch;
  margin-top: var(--space-03);
}

.services-section__tags {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-02);
  margin: var(--space-05) 0 0;
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
}

.services-section__facts {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-01) var(--space-05);
  margin: var(--space-05) 0 0;
}

/* 44px tall hit area; the underline stays tight to the text */
.services-section__enquire {
  display: inline-flex;
  align-items: center;
  min-height: var(--tap);
  margin-top: var(--space-03);
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gold);
  text-decoration: underline;
  text-decoration-color: transparent;
  text-underline-offset: 6px;
  transition: text-decoration-color var(--dur-fast) var(--ease-out-expo);
}

.services-section__enquire:hover,
.services-section__enquire:focus-visible {
  text-decoration-color: var(--gold);
}

/* ─── Responsive ───────────────────────────────────────────── */
@media (min-width: 640px) {
  .services-section__meta {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* Text 1–7, thumbnail 8–12 */
@media (min-width: 900px) {
  .services-section__text {
    grid-column: 1 / 8;
  }

  .services-section__thumb {
    grid-column: 8 / 13;
    order: 0;
  }
}
</style>
