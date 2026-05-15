import { createRouter, createWebHistory } from 'vue-router'

// Portfolio is single-page with hash scrolling (no separate routes needed)
// But if you want separate pages, add more entries to `routes`.
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0 }
  },
})
