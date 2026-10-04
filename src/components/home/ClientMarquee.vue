<script setup>
import { clients } from '@/data/clients.js'
import Marquee from '../ui/Marquee.vue'
</script>

<template>
  <section class="client-marquee" aria-label="Clients">
    <p class="t-caption client-marquee__label container">Trusted by</p>
    <Marquee :items="clients" variant="mono" :speed="60" pause-on-hover>
      <template #item="{ item, duplicate }">
        <!-- Accessible names on the first track only; the duplicate track is aria-hidden -->
        <span
          v-if="item.logo"
          class="client-marquee__logo"
          :style="{ '--logo': `url(${item.logo})` }"
          :role="duplicate ? undefined : 'img'"
          :aria-label="duplicate ? undefined : item.name"
        />
        <span v-else class="client-marquee__name">{{ item.name }}</span>
      </template>
    </Marquee>
  </section>
</template>

<style scoped>
.client-marquee {
  padding-block: var(--space-08) 0;
}

.client-marquee__label {
  display: block;
  padding-inline: var(--gutter);
  margin-bottom: var(--space-04);
}

/* Logos are used as a mask, so a monochrome SVG takes the token colour: --text-dim, --text on hover */
.client-marquee__logo {
  display: block;
  height: var(--space-06);
  width: calc(var(--space-06) * 4);
  background: var(--text-dim);
  -webkit-mask: var(--logo) center / contain no-repeat;
  mask: var(--logo) center / contain no-repeat;
  transition: background-color var(--dur-fast) var(--ease-out-expo);
}

.client-marquee__name {
  color: var(--text-dim);
  transition: color var(--dur-fast) var(--ease-out-expo);
}

.client-marquee__logo:hover {
  background: var(--text);
}

.client-marquee__name:hover {
  color: var(--text);
}
</style>
