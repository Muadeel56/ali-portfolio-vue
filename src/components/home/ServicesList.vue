<script setup>
import { RouterLink } from 'vue-router'
import { services } from '@/data/services.js'
import SectionHeader from '../ui/SectionHeader.vue'
import Rule from '../ui/Rule.vue'

defineProps({
  number: { type: String, required: true },
  total: { type: String, required: true },
})
</script>

<template>
  <section class="section services-list" aria-labelledby="services-list-title">
    <div class="container">
      <SectionHeader
        title-id="services-list-title"
        :number="number"
        :total="total"
        eyebrow="Services"
        title="What I can cut for you"
        accent="cut"
        intro="Pick the closest fit and the enquiry form opens with it selected."
      />

      <ol class="services-list__list">
        <li v-for="service in services" :key="service.id" class="services-list__item">
          <div class="services-list__row">
            <span class="services-list__num">{{ service.num }}</span>
            <div class="services-list__body">
              <h3 class="t-display-h3 services-list__title">{{ service.title }}</h3>
              <p class="t-body-small services-list__desc">{{ service.desc }}</p>
            </div>
            <div class="services-list__links">
              <RouterLink
                :to="{ path: '/work', hash: `#${service.chapter}` }"
                class="services-list__link"
                :aria-label="`See ${service.title} work`"
              >See work</RouterLink>
              <RouterLink
                :to="{ path: '/contact', query: { service: service.id } }"
                class="services-list__link services-list__link--primary"
                :aria-label="`Enquire about ${service.title}`"
              >Enquire →</RouterLink>
            </div>
          </div>
          <Rule />
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.services-list__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.services-list__row {
  display: grid;
  grid-template-columns: var(--space-07) 1fr;
  gap: var(--space-04);
  padding-block: var(--space-06);
}

.services-list__num {
  font-family: var(--mono);
  font-size: var(--fs-label);
  letter-spacing: 0.2em;
  color: var(--gold);
  padding-top: var(--space-02);
}

.services-list__desc {
  max-width: 60ch;
  margin-top: var(--space-03);
}

.services-list__links {
  grid-column: 2;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-05);
}

.services-list__link {
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-dim);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  padding-bottom: var(--space-01);
  transition:
    color var(--dur-fast) var(--ease-out-expo),
    border-color var(--dur-fast) var(--ease-out-expo);
}

.services-list__link--primary {
  color: var(--gold);
}

.services-list__link:hover,
.services-list__link:focus-visible {
  color: var(--gold);
  border-bottom-color: var(--gold);
}

@media (min-width: 900px) {
  .services-list__row {
    grid-template-columns: var(--space-09) 1fr auto;
    gap: var(--space-06);
    align-items: start;
  }

  .services-list__links {
    grid-column: 3;
    padding-top: var(--space-02);
  }
}
</style>
