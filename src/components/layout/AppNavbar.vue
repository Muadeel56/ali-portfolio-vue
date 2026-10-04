<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { navLinks } from '@/data/navLinks.js'
import AppButton from '../ui/AppButton.vue'

const route = useRoute()
const timeLine = ref('')
const isScrolled = ref(false)

const SCROLL_THRESHOLD = 80

const updateTime = () => {
  const now = new Date()
  timeLine.value = now.toLocaleTimeString('en-GB', {
    timeZone: 'Asia/Karachi',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

let timer

const onScroll = () => {
  isScrolled.value = window.scrollY >= SCROLL_THRESHOLD
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  clearInterval(timer)
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <header class="nav" :class="{ 'nav--scrolled': isScrolled }">
    <RouterLink to="/" class="nav__logo">Ali's Portfolio</RouterLink>

    <ul class="nav__links">
      <li v-for="link in navLinks" :key="link.id">
        <RouterLink
          :to="link.path"
          class="nav__link"
          :class="{ 'nav__link--active': route.path === link.path }"
        >
          {{ link.label }}
        </RouterLink>
      </li>
    </ul>

    <div class="nav__right">
      <div class="nav__time">
        <b>Rawalpindi · PKT</b>
        {{ timeLine }} — Remote
      </div>
      <AppButton variant="outline" class="btn--compact" to="/contact">
        Book a Session
      </AppButton>
    </div>
  </header>
</template>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: var(--nav-height-desktop);
  padding: 0 calc(var(--gutter) + env(safe-area-inset-right)) 0 calc(var(--gutter) + env(safe-area-inset-left));
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  background: var(--bg);
  border-bottom: 1px solid transparent;
  transition: border-color var(--dur-base) var(--ease-out-expo);
}

.nav--scrolled {
  border-bottom-color: var(--rule);
}

.nav__logo {
  justify-self: start;
  font-family: var(--serif);
  font-weight: 400;
  font-size: var(--fs-h3);
  line-height: 1;
  color: var(--gold);
  letter-spacing: 0.01em;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  transition: color var(--dur-fast) var(--ease-out-expo);
  background: none;
  border: none;
  /* 44px tall hit area */
  padding: 10px 0;
}

.nav__logo:hover {
  color: var(--gold-light);
}

.nav__links {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 40px;
  align-items: center;
  justify-self: center;
}

.nav__link {
  font-family: var(--sans);
  font-weight: 500;
  font-size: var(--fs-label);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-dim);
  text-decoration: none;
  cursor: pointer;
  transition: color var(--dur-fast) var(--ease-out-expo);
  position: relative;
  /* Taller hit area for touch laptops and tablets in landscape */
  display: inline-block;
  padding: 15px 0;
  border: none;
  background: none;
}

.nav__link:hover,
.nav__link--active {
  color: var(--gold);
}

.nav__link--active::after {
  content: '';
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 1px;
  background: var(--gold);
}

.nav__right {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 24px;
  justify-self: end;
}

.nav__time {
  font-family: var(--mono);
  font-size: var(--fs-caption);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
  line-height: 1.4;
  text-align: right;
}

.nav__time b {
  color: var(--text-dim);
  font-weight: 500;
  display: block;
}

/* Desktop only: AppMobileNav covers smaller screens */
.nav {
  display: none;
}

@media (min-width: 900px) {
  .nav {
    display: grid;
  }
}
</style>
