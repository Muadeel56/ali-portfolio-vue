import { createRouter, createWebHistory, START_LOCATION } from 'vue-router'
import { beginCut, endCut, transitionDone, navOffset } from '@/composables/useRouteTransition.js'
import { site } from '@/data/site.js'
import { applyPageMeta } from './seo.js'
// Eager: / is the main landing page, and a lazy chunk would hold back its first paint (LCP)
// by a second round trip. The other pages stay lazy.
import HomeView from '@/views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    // Keep in sync with <title> in index.html
    meta: {
      title: `${site.name} — Video Editor & Colorist | Rawalpindi · Worldwide`,
      description:
        'Ali Hassan — video editor and colorist in Rawalpindi, Pakistan. Wedding, brand, documentary and short-form films, edited and graded for clients worldwide.',
    },
  },
  {
    path: '/work',
    name: 'work',
    component: () => import('@/views/WorkView.vue'),
    meta: {
      title: 'Work',
      description:
        'Selected films by Ali Hassan: brand and corporate films, fashion campaigns, documentaries, short-form reels and weddings, edited and colour graded.',
    },
  },
  {
    path: '/videography',
    redirect: (to) => ({ path: '/work', hash: to.hash, query: to.query }),
  },
  {
    path: '/services',
    name: 'services',
    component: () => import('@/views/ServicesView.vue'),
    meta: {
      title: 'Services',
      description:
        'Wedding film edits, brand and corporate videos, short-form reels, documentaries, colour grading and podcast edits. Deliverables, turnaround and a quote within 24 hours.',
    },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: {
      title: 'About',
      description: 'Ali Hassan is a video editor and colorist based in Rawalpindi, Pakistan, cutting films for clients worldwide.',
    },
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/views/ContactView.vue'),
    meta: {
      title: 'Contact',
      description: 'Send Ali Hassan a project brief: service, budget, deadline and a footage link. Reply within 24 hours, or message on WhatsApp.',
    },
  },
  // Must stay last
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Page not found', description: "This page doesn't exist. Head back to Ali Hassan's work.", noindex: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Query-only change on the same page (e.g. opening a film with ?film=): stay put.
    if (to.path === from.path && to.hash === from.hash && from !== START_LOCATION) return false
    // Wait for the "cut" to finish, or we scroll the old page.
    return transitionDone().then(() => {
      if (savedPosition) return savedPosition
      // Unknown anchors (e.g. the retired /work#events) land at the top without an error.
      if (to.hash && document.getElementById(decodeURIComponent(to.hash.slice(1)))) {
        return { el: to.hash, top: navOffset(), behavior: to.path === from.path ? 'smooth' : 'auto' }
      }
      return { top: 0 }
    })
  },
})

router.beforeEach((to, from) => {
  // No cut on the first load or for same-page changes (hash/query only).
  if (from !== START_LOCATION && to.path !== from.path) beginCut()
})

router.afterEach((to, from, failure) => {
  if (failure) {
    endCut()
    return
  }
  // Query/hash changes keep the page title (the player modal sets its own while open).
  if (from !== START_LOCATION && to.path === from.path) return
  applyPageMeta(to)
})

export default router
