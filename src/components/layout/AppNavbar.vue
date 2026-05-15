<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { navLinks } from '@/data/navLinks.js'
import AppButton from '../ui/AppButton.vue'

const router = useRouter()
const timeLine = ref('')
const activeLink = ref('videography')
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

const scrollTo = (id) => {
  activeLink.value = id
  router.push({ path: '/', hash: `#${id}` })
}

const onScroll = () => {
  isScrolled.value = window.scrollY >= SCROLL_THRESHOLD
}

const updateActiveFromScroll = () => {
  const offset = 96
  const ids = navLinks.map((link) => link.id)

  for (let i = ids.length - 1; i >= 0; i--) {
    const el = document.getElementById(ids[i])
    if (el && el.getBoundingClientRect().top <= offset) {
      activeLink.value = ids[i]
      return
    }
  }

  activeLink.value = 'videography'
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('scroll', updateActiveFromScroll, { passive: true })

  const hash = router.currentRoute.value.hash.replace('#', '')
  if (hash && navLinks.some((link) => link.id === hash)) {
    activeLink.value = hash
  }
})

onUnmounted(() => {
  clearInterval(timer)
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('scroll', updateActiveFromScroll)
})
</script>

<template>
  <header
    class="nav"
    :class="isScrolled ? 'nav--scrolled' : 'nav--transparent'"
  >
    <a href="/" class="nav__logo" @click.prevent="scrollTo('hero')">Ali's Portfolio</a>

    <ul class="nav__links">
      <li v-for="link in navLinks" :key="link.id">
        <button
          type="button"
          class="nav__link"
          :class="{ 'nav__link--active': activeLink === link.id }"
          @click="scrollTo(link.id)"
        >
          {{ link.label }}
        </button>
      </li>
    </ul>

    <div class="nav__right">
      <div class="nav__time">
        <b>Karachi · PKT</b>
        {{ timeLine }} — Available
      </div>
      <AppButton variant="outline" class="btn--compact" @click="scrollTo('contact')">
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
  height: 72px;
  padding: 0 clamp(1.5rem, 5.5vw, 5rem);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  transition:
    background 200ms ease,
    border-color 200ms ease,
    backdrop-filter 200ms ease;
}

.nav--transparent {
  background: transparent;
  border-bottom: 1px solid transparent;
}

.nav--scrolled {
  background: rgba(8, 8, 8, 0.92);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.nav__logo {
  justify-self: start;
  font-family: var(--serif);
  font-style: italic;
  font-weight: 700;
  font-size: 22px;
  line-height: 1;
  color: var(--gold);
  letter-spacing: 0.01em;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  transition: color 200ms ease;
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
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--text-dim);
  text-decoration: none;
  cursor: pointer;
  transition: color 200ms ease;
  position: relative;
  padding: 4px 0;
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
  bottom: -3px;
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
  font-size: 10px;
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
  font-size: 9px;
}

@media (max-width: 900px) {
  .nav {
    display: none;
  }
}
</style>
