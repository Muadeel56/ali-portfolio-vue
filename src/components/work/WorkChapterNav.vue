<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { navOffset } from '@/composables/useRouteTransition.js'
import { prefersReducedMotion } from '@/data/videos.js'

// Sticky chapter bar with scroll-spy. It only highlights: it never writes the hash while
// scrolling, which would trigger scrollBehavior and fight the visitor.
const props = defineProps({
  chapters: { type: Array, required: true },
})

const route = useRoute()
const activeId = ref(null)
const trackRef = ref(null)

// ── Scroll-spy ────────────────────────────────────────────
// The band runs from just under the bars to 45% down the viewport;
// the topmost chapter inside it is the current one. Its top edge sits a few px below the bars:
// after an anchor jump the previous chapter ends exactly there, and an edge touch counts as intersecting.
const EDGE = 8
const inBand = new Set()
let observer
let wide

const pick = () => {
  activeId.value = props.chapters.find((c) => inBand.has(c.id))?.id ?? null
}

const observe = () => {
  observer?.disconnect()
  inBand.clear()
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) inBand.add(entry.target.id)
        else inBand.delete(entry.target.id)
      })
      pick()
    },
    { rootMargin: `-${Math.ceil(navOffset()) + EDGE}px 0px -55% 0px` },
  )
  props.chapters.forEach((c) => {
    const el = document.getElementById(c.id)
    if (el) observer.observe(el)
  })
}

onMounted(() => {
  observe()
  // The navbar (and so the band) changes height at the desktop breakpoint
  wide = matchMedia('(min-width: 900px)')
  wide.addEventListener('change', observe)
})

onUnmounted(() => {
  observer?.disconnect()
  wide?.removeEventListener('change', observe)
})

// Keep the active link visible in the bar on phones (scrolls the bar only, never the page).
watch(activeId, (id) => {
  const track = trackRef.value
  const link = id && track?.querySelector(`[data-chapter="${id}"]`)
  if (!link) return
  const left = link.offsetLeft - track.offsetLeft
  const right = left + link.offsetWidth
  if (left >= track.scrollLeft && right <= track.scrollLeft + track.clientWidth) return
  track.scrollTo({ left: left - track.clientWidth / 2 + link.offsetWidth / 2, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
})

// Same hash again (e.g. /work#fashion, scrolled away, then "02 Fashion"): the router
// sees no navigation, so scroll there ourselves.
const onClick = (id) => {
  if (route.hash !== `#${id}`) return
  const el = document.getElementById(id)
  if (!el) return
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - navOffset(),
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
  })
}
</script>

<template>
  <!-- data-anchor-offset: anchor scrolling clears this bar as well as the navbar -->
  <nav class="chapter-nav" aria-label="Work chapters" data-anchor-offset>
    <div ref="trackRef" class="chapter-nav__track">
      <RouterLink
        v-for="chapter in chapters"
        :key="chapter.id"
        :to="{ hash: `#${chapter.id}` }"
        class="chapter-nav__link"
        :class="{ 'is-active': activeId === chapter.id }"
        :aria-current="activeId === chapter.id ? 'true' : undefined"
        :data-chapter="chapter.id"
        @click="onClick(chapter.id)"
      >
        <span class="chapter-nav__num">{{ chapter.number }}</span> {{ chapter.navLabel }}
      </RouterLink>
    </div>
  </nav>
</template>

<style scoped>
.chapter-nav {
  position: sticky;
  top: var(--nav-h);
  z-index: 5;
  margin-top: var(--space-08);
  background: var(--bg);
  border-block: 1px solid var(--rule);
}

/* Fixed height so the chapters' scroll-margin can clear it exactly.
   Scrolls sideways on phones instead of wrapping. */
.chapter-nav__track {
  display: flex;
  align-items: center;
  gap: var(--space-06);
  height: var(--space-07);
  overflow-x: auto;
  scrollbar-width: none;
}

.chapter-nav__track::-webkit-scrollbar {
  display: none;
}

.chapter-nav__link {
  flex-shrink: 0;
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-dim);
  text-decoration: none;
  white-space: nowrap;
  transition: color var(--dur-fast) var(--ease-out-expo);
}

.chapter-nav__num {
  font-family: var(--mono);
  color: var(--muted);
  margin-right: var(--space-01);
  transition: color var(--dur-fast) var(--ease-out-expo);
}

.chapter-nav__link:hover,
.chapter-nav__link.is-active,
.chapter-nav__link:hover .chapter-nav__num,
.chapter-nav__link.is-active .chapter-nav__num {
  color: var(--gold);
}
</style>
