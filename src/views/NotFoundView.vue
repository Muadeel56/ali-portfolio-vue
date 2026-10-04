<script setup>
import { onMounted, onUnmounted } from 'vue'
import AppButton from '../components/ui/AppButton.vue'
import Rule from '../components/ui/Rule.vue'

// Cloudflare Pages serves index.html (200) for unknown paths, so tell crawlers not to index this page.
let robots

onMounted(() => {
  robots = document.createElement('meta')
  robots.name = 'robots'
  robots.content = 'noindex'
  document.head.appendChild(robots)
})

onUnmounted(() => {
  robots?.remove()
})
</script>

<template>
  <main class="page-main not-found">
    <section class="section not-found__section">
      <div class="container">
        <p class="t-label not-found__eyebrow">
          Error · Page not found
          <Rule gold length="48px" />
        </p>
        <h1 class="t-display-hero not-found__code">404</h1>
        <p class="t-body-large not-found__copy">This shot didn't make the cut.</p>
        <Rule class="not-found__rule" />
        <p class="t-mono not-found__meta" aria-hidden="true"><b>00:00:04:04</b> · Missing frame · Reel ends here</p>
        <div class="not-found__actions">
          <AppButton variant="primary" to="/" show-arrow>Back home</AppButton>
          <AppButton variant="outline" to="/work">See the work</AppButton>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.not-found__section {
  min-height: 100svh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  padding-top: calc(var(--nav-h) + var(--space-08));
}

.not-found__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: var(--space-04);
}

.not-found__code {
  margin-top: var(--space-05);
  line-height: 0.85;
  color: var(--surface-3);
  -webkit-text-stroke: 1px var(--gold);
}

.not-found__rule {
  margin-top: var(--space-07);
}

.not-found__meta {
  margin: var(--space-04) 0 0;
}

.not-found__copy {
  margin-top: var(--space-05);
}

.not-found__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-04);
  margin-top: var(--space-07);
}
</style>
