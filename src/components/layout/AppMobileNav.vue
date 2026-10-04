<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { navLinks } from '@/data/navLinks.js'
import { site } from '@/data/site.js'
import AppButton from '../ui/AppButton.vue'
import Rule from '../ui/Rule.vue'

const route = useRoute()
const isOpen = ref(false)
const timeLine = ref('')

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

const toggle = () => {
  isOpen.value = !isOpen.value
}

const close = () => {
  isOpen.value = false
}

const onKeydown = (e) => {
  if (e.key === 'Escape' && isOpen.value) close()
}

// Close the menu whenever a navigation happens (link click, back/forward)
watch(() => route.fullPath, close)

watch(isOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  clearInterval(timer)
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <header class="mobile-nav" :class="{ 'mobile-nav--open': isOpen }">
    <nav class="mobile-nav__bar">
      <RouterLink to="/" class="mobile-nav__logo" @click="close">Ali's Portfolio</RouterLink>

      <button
        type="button"
        class="mobile-nav__hamburger"
        :class="{ 'mobile-nav__hamburger--open': isOpen }"
        :aria-expanded="isOpen"
        aria-controls="mobile-menu"
        :aria-label="isOpen ? 'Close menu' : 'Open menu'"
        @click="toggle"
      >
        <span />
        <span />
        <span />
      </button>
    </nav>

    <Transition name="menu">
      <div v-if="isOpen" id="mobile-menu" class="mobile-nav__menu">
        <p class="mobile-nav__eyebrow">Menu · 05</p>

        <ul class="mobile-nav__links">
          <li v-for="link in navLinks" :key="link.id">
            <RouterLink
              :to="link.path"
              class="mobile-nav__link"
              :class="{ 'mobile-nav__link--active': route.path === link.path }"
              @click="close"
            >
              {{ link.label }}
            </RouterLink>
          </li>
        </ul>

        <Rule class="mobile-nav__rule" />
        <div class="mobile-nav__cta-wrap">
          <AppButton variant="outline" class="mobile-nav__cta" show-arrow to="/contact" @click="close">
            Book a Session
          </AppButton>
          <div class="mobile-nav__foot">
            <span><b>Rawalpindi</b> · {{ timeLine }}</span>
            <span>{{ site.availability }}</span>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.mobile-nav {
  display: none;
}

@media (max-width: 899px) {
  .mobile-nav {
    display: block;
  }
}

.mobile-nav__bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 110;
  height: var(--nav-height-mobile);
  padding: 0 var(--gutter);
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mobile-nav__logo {
  font-family: var(--serif);
  font-weight: 400;
  font-size: var(--fs-h3);
  line-height: 1;
  color: var(--gold);
  letter-spacing: 0.01em;
  white-space: nowrap;
  text-decoration: none;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
}

.mobile-nav__hamburger {
  width: 24px;
  height: 14px;
  position: relative;
  cursor: pointer;
  background: transparent;
  border: 0;
  padding: 0;
}

.mobile-nav__hamburger span {
  position: absolute;
  left: 0;
  width: 24px;
  height: 1px;
  background: var(--gold);
  transition:
    top var(--dur-base) var(--ease-out-expo),
    transform var(--dur-base) var(--ease-out-expo),
    opacity var(--dur-base) var(--ease-out-expo);
}

.mobile-nav__hamburger span:nth-child(1) {
  top: 0;
}

.mobile-nav__hamburger span:nth-child(2) {
  top: 7px;
}

.mobile-nav__hamburger span:nth-child(3) {
  top: 14px;
}

.mobile-nav__hamburger--open span:nth-child(1) {
  top: 7px;
  transform: rotate(45deg);
}

.mobile-nav__hamburger--open span:nth-child(2) {
  opacity: 0;
}

.mobile-nav__hamburger--open span:nth-child(3) {
  top: 7px;
  transform: rotate(-45deg);
}

.mobile-nav__menu {
  position: fixed;
  top: var(--nav-height-mobile);
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 109;
  display: flex;
  flex-direction: column;
  padding: 0 var(--gutter);
  background: var(--bg);
  overflow: hidden;
}

.mobile-nav__eyebrow {
  margin: 24px 0 0;
  font-family: var(--sans);
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--gold);
  display: inline-flex;
  align-items: center;
  gap: 12px;
  align-self: flex-start;
  position: relative;
  z-index: 2;
}

.mobile-nav__eyebrow::after {
  content: '';
  width: 32px;
  height: 1px;
  background: var(--gold);
}

.mobile-nav__links {
  list-style: none;
  margin: 0;
  padding: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
  position: relative;
  z-index: 2;
}

.mobile-nav__link {
  font-family: var(--sans);
  font-weight: 500;
  font-size: var(--fs-label);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-dim);
  text-decoration: none;
  cursor: pointer;
  transition: color var(--dur-fast) var(--ease-out-expo);
  position: relative;
  padding: 4px 0;
  border: none;
  background: none;
}

.mobile-nav__link:hover,
.mobile-nav__link--active {
  color: var(--gold);
}

.mobile-nav__link--active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 16px;
  height: 1px;
  background: var(--gold);
}

.mobile-nav__rule {
  position: relative;
  z-index: 2;
}

.mobile-nav__cta-wrap {
  padding: 24px 0 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  position: relative;
  z-index: 2;
}

.mobile-nav__cta {
  width: 100%;
}

.mobile-nav__foot {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-family: var(--mono);
  font-size: var(--fs-caption);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
}

.mobile-nav__foot b {
  color: var(--text-dim);
  font-weight: 500;
}

.menu-enter-active,
.menu-leave-active {
  transition:
    opacity var(--dur-base) var(--ease-out-expo),
    transform var(--dur-base) var(--ease-out-expo);
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
