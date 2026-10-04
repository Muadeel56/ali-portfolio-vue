<script setup>
import { RouterLink } from 'vue-router'
import { navLinks } from '@/data/navLinks.js'
import { contactInfo, socials } from '@/data/contact.js'
import { site } from '@/data/site.js'
import { track } from '@/composables/useAnalytics.js'
import { whatsappHref } from '@/composables/useWhatsApp.js'
import Rule from '../ui/Rule.vue'
import AvailabilityBadge from '../ui/AvailabilityBadge.vue'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container">
      <Rule />
      <div class="footer__grid grid-12">
        <div class="footer__brand">
          <RouterLink to="/" class="footer__name">Ali's Portfolio</RouterLink>
          <p class="footer__tagline">Videography &amp; editing. Films that hold the silence between emotions.</p>
          <AvailabilityBadge class="footer__status" />
        </div>

        <nav class="footer__col footer__nav" aria-label="Footer">
          <p class="footer__heading">Index</p>
          <ul class="footer__list">
            <li v-for="link in navLinks" :key="link.id">
              <RouterLink :to="link.path" class="footer__link">{{ link.label }}</RouterLink>
            </li>
          </ul>
        </nav>

        <div class="footer__col footer__contact">
          <p class="footer__heading">Contact</p>
          <ul class="footer__list">
            <li v-for="item in contactInfo" :key="item.label">
              <a
                :href="item.href"
                class="footer__link"
                v-bind="item.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {}"
                @click="item.label === 'WhatsApp' && track('WhatsApp Click', { from: 'footer' })"
              >{{ item.text }}</a>
            </li>
            <li>
              <a
                :href="whatsappHref"
                class="footer__link footer__link--gold"
                target="_blank"
                rel="noopener noreferrer"
                @click="track('WhatsApp Click', { from: 'footer' })"
              >WhatsApp →</a>
            </li>
            <li v-for="social in socials" :key="social.label">
              <a :href="social.href" class="footer__link" target="_blank" rel="noopener noreferrer">{{ social.label }}</a>
            </li>
          </ul>
        </div>
      </div>
      <Rule />
      <p class="footer__legal">© {{ year }} {{ site.name }} · {{ site.location }} · {{ site.reach }}</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding-inline: var(--gutter);
  /* Below 900px: clear the floating WhatsApp button so it never covers the footer */
  padding-bottom: calc(var(--space-06) + var(--fab) + var(--space-05) + env(safe-area-inset-bottom));
}

@media (min-width: 900px) {
  .footer {
    padding-bottom: calc(var(--space-06) + env(safe-area-inset-bottom));
  }
}

.footer__grid {
  row-gap: var(--space-07);
  padding-block: var(--space-08);
}

.footer__name {
  font-family: var(--serif);
  font-weight: 400;
  font-size: var(--fs-h3);
  line-height: 1;
  color: var(--gold);
  text-decoration: none;
  /* 44px tall hit area */
  display: inline-flex;
  align-items: center;
  min-height: var(--tap);
}

.footer__tagline {
  font-size: var(--fs-body);
  line-height: 1.6;
  color: var(--text-dim);
  max-width: 32ch;
  margin: var(--space-04) 0 0;
}

.footer__status {
  margin-top: var(--space-05);
}

.footer__heading {
  font-family: var(--mono);
  font-size: var(--fs-caption);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
  margin: 0 0 var(--space-04);
}

.footer__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
}

/* 44px tall rows: comfortable tap targets without changing the type */
.footer__link {
  display: inline-flex;
  align-items: center;
  min-height: var(--tap);
  font-size: var(--fs-body);
  color: var(--text-dim);
  text-decoration: none;
  transition: color var(--dur-fast) var(--ease-out-expo);
}

.footer__link--gold {
  color: var(--gold);
}

.footer__link:hover,
.footer__link.router-link-exact-active {
  color: var(--gold);
}

.footer__legal {
  font-family: var(--mono);
  font-size: var(--fs-caption);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
  margin: var(--space-05) 0 0;
}

@media (min-width: 640px) {
  .footer__nav {
    grid-column: 1 / 7;
  }

  .footer__contact {
    grid-column: 7 / 13;
  }
}

@media (min-width: 900px) {
  .footer__brand {
    grid-column: 1 / 5;
  }

  .footer__nav {
    grid-column: 6 / 8;
  }

  .footer__contact {
    grid-column: 9 / 13;
  }
}
</style>
