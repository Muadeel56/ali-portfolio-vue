<script setup>
import { onMounted, onUnmounted } from 'vue'
import AppButton from '../components/ui/AppButton.vue'

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
        <p class="t-label">Error · Page not found</p>
        <h1 class="t-display-hero not-found__code">404</h1>
        <p class="t-body-large not-found__copy">This shot didn't make the cut.</p>
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

.not-found__code {
  margin-top: var(--space-04);
  line-height: 0.9;
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
