<script setup>
import { useRouter } from 'vue-router'
import AppButton from '../ui/AppButton.vue'

const router = useRouter()

const scrollTo = (path) => {
  router.push(path)
}
</script>

<template>
  <section id="hero" class="hero section--flush-top">
    <div class="grain" aria-hidden="true" />
    <div class="grain grain--fine" aria-hidden="true" />

    <div class="hero__content">
      <h1 class="hero__headline t-display-hero heading">
        I film the silence
        <span class="hero__headline-accent accent">between emotions</span>
      </h1>
      <div class="hero__ctas ctas">
        <AppButton variant="primary" show-arrow @click="scrollTo('/videography')">
          View Work
        </AppButton>
        <!-- Ghost on desktop, outline look on mobile (see CSS) -->
        <AppButton variant="ghost" class="hero__cta-contact" @click="scrollTo('/contact')">
          Get in Touch
        </AppButton>
      </div>
    </div>

    <div class="hero__corner-l t-mono" aria-hidden="true">
      <b>Rawalpindi · Pakistan</b>
      Remote · Worldwide
    </div>
    <div class="hero__corner-r t-mono" aria-hidden="true">Videography · Editing</div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100svh;
  min-height: 100dvh;
  background: var(--bg);
  overflow: hidden;
  isolation: isolate;
}

.grain {
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.18;
  mix-blend-mode: overlay;
  pointer-events: none;
  /* Fade the grain out at the bottom so the hero meets the page without a seam */
  -webkit-mask-image: linear-gradient(to bottom, var(--bg) 60%, transparent);
  mask-image: linear-gradient(to bottom, var(--bg) 60%, transparent);
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.85 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  background-size: 220px 220px;
}

.grain--fine {
  opacity: 0.1;
  mix-blend-mode: soft-light;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='2.6' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.7 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  background-size: 180px 180px;
}

/* ── Content ── */
.hero__content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, calc(-50% - 36px));
  z-index: 10;
  width: 100%;
  max-width: 1120px;
  text-align: center;
  padding: 0 var(--gutter);
}

.hero__headline {
  line-height: 0.95;
}

.hero__headline-accent {
  display: block;
}

.hero__ctas {
  margin-top: var(--space-07);
  display: inline-flex;
  gap: var(--space-04);
  align-items: center;
}

/* ── Bottom corners (desktop) ── */
.hero__corner-l,
.hero__corner-r {
  position: absolute;
  bottom: var(--space-07);
  z-index: 10;
  line-height: 1.7;
  pointer-events: none;
}

.hero__corner-l {
  left: var(--gutter);
}

.hero__corner-l b {
  display: block;
}

.hero__corner-r {
  right: var(--gutter);
  text-align: right;
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.heading {
  animation: fadeUp var(--dur-slow) var(--ease-out-expo) var(--dur-fast) both;
}

.ctas {
  animation: fadeUp var(--dur-slow) var(--ease-out-expo) var(--dur-base) both;
}

/* ── Mobile ── */
@media (max-width: 899px) {
  .hero__corner-l,
  .hero__corner-r {
    display: none;
  }

  .hero__content {
    left: 0;
    right: 0;
    transform: translateY(calc(-50% - 16px));
  }

  .hero__ctas {
    margin-top: var(--space-06);
    flex-direction: column;
    gap: var(--space-03);
    width: 100%;
    max-width: 320px;
    margin-inline: auto;
    display: flex;
  }

  .hero__ctas :deep(.btn) {
    width: 100%;
  }

  /* Outline look for the single contact button */
  .hero__ctas :deep(.hero__cta-contact) {
    color: var(--gold);
    border-color: var(--gold);
  }

  .hero__ctas :deep(.hero__cta-contact:hover) {
    background: var(--gold);
    color: var(--bg);
  }
}
</style>
