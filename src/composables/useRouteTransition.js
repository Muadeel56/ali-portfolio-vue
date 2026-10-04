import { ref } from 'vue'
import { prefersReducedMotion } from '@/data/videos.js'

// The "cut" between pages: the black overlay fades in, holds, then the new page cuts in.
// Driven from the router (beginCut) and from App.vue's <Transition> hooks.

// True while the black overlay is up.
export const cutting = ref(false)

let pending = null
let resolvePending = null

const cssMs = (name) => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0

const lock = (on) => document.documentElement.classList.toggle('is-cutting', on)

export function beginCut() {
  if (cutting.value || prefersReducedMotion()) return
  cutting.value = true
  lock(true)
  pending = new Promise((resolve) => {
    resolvePending = resolve
  })
}

// Clears the overlay and releases scrollBehavior. Also used when a navigation fails.
export function endCut() {
  cutting.value = false
  lock(false)
  resolvePending?.()
  pending = null
  resolvePending = null
}

// <Transition @leave>: keep the old page under the overlay until it has gone fully black and held.
export function onLeave(el, done) {
  if (!cutting.value) return done()
  setTimeout(done, cssMs('--dur-cut-out') + cssMs('--dur-cut-hold'))
}

// Resolves once the new page is in the DOM, so scrollBehavior never scrolls the old page.
export const transitionDone = () => pending ?? Promise.resolve()

// Height of the fixed navbar, plus any sticky bar marked [data-anchor-offset]
// (e.g. the Work page's chapter bar), so anchors land below both.
export const navOffset = () => cssMs('--nav-h') + (document.querySelector('[data-anchor-offset]')?.offsetHeight ?? 0)
