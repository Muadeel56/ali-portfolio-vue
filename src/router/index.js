import { createRouter, createWebHistory, START_LOCATION } from 'vue-router'
import { beginCut, endCut, transitionDone, navOffset } from '@/composables/useRouteTransition.js'
import { site } from '@/data/site.js'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: `${site.name} — Videographer & Editor` },
  },
  {
    path: '/work',
    name: 'work',
    component: () => import('@/views/WorkView.vue'),
    meta: { title: 'Work' },
  },
  {
    path: '/videography',
    redirect: (to) => ({ path: '/work', hash: to.hash, query: to.query }),
  },
  {
    path: '/services',
    name: 'services',
    component: () => import('@/views/ServicesView.vue'),
    meta: { title: 'Services' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: { title: 'About' },
  },
  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/views/ContactView.vue'),
    meta: { title: 'Contact' },
  },
  // Must stay last
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Page not found' },
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
  const title = to.meta.title
  document.title = to.name === 'home' ? title : `${title} — ${site.name}`
})

export default router
