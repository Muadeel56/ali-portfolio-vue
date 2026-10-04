import { onMounted, onUnmounted } from 'vue'

// GSAP + ScrollTrigger, loaded on demand so they never land in the entry chunk or the LCP path.
// Every animation runs inside gsap.matchMedia(), so it reverts on unmount and when the
// reduced-motion preference changes.

let loading = null
let loaded = null

export const loadGsap = () =>
  (loading ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
    gsap.registerPlugin(ScrollTrigger)
    loaded = { gsap, ScrollTrigger }
    return loaded
  }))

// Re-measure every trigger once a new page is in place (called after each route cut).
export const refreshScrollTriggers = () => loaded?.ScrollTrigger.refresh()

// Motion tokens from main.css, in seconds for GSAP.
export const tokenSeconds = (name) =>
  (parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name)) || 0) / 1000

// Closest built-in match to --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1).
export const EASE_IN_OUT = 'power3.inOut'

const DEFAULT_CONDITIONS = {
  motion: '(prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
}

// useMotion((ctx, { gsap, ScrollTrigger, conditions }) => { … }, { scope, conditions })
// `scope` is a template ref: selector text inside the callback is limited to it.
// `conditions` are matchMedia queries; the callback runs again whenever any of them changes.
export function useMotion(setup, { scope = null, conditions = DEFAULT_CONDITIONS } = {}) {
  let mm = null
  let unmounted = false

  onMounted(() => {
    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (unmounted) return
      mm = gsap.matchMedia(scope?.value ?? undefined)
      mm.add(conditions, (ctx) => setup(ctx, { gsap, ScrollTrigger, conditions: ctx.conditions }))
    })
  })

  onUnmounted(() => {
    unmounted = true
    mm?.revert()
  })
}

// Clip-path "shutter" on video posters inside `scope`: each [data-shutter] opens from the top
// as it scrolls in. Anything already on screen when this runs is left alone, so above-the-fold
// and priority media paint immediately. Reduced motion: posters are simply visible.
export function useShutter(scope) {
  useMotion(
    (ctx, { gsap, ScrollTrigger, conditions }) => {
      if (!conditions.motion) return
      const els = gsap.utils
        .toArray('[data-shutter]', scope.value)
        .filter((el) => el.getBoundingClientRect().top > window.innerHeight)
      if (!els.length) return
      const open = (batch) =>
        gsap.to(batch, {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: tokenSeconds('--dur-slow'),
          ease: EASE_IN_OUT,
          stagger: tokenSeconds('--dur-stagger'),
          overwrite: true,
        })
      gsap.set(els, { clipPath: 'inset(0% 0% 100% 0%)' })
      // onLeave too: a jump past the poster (anchor link, fast scroll) must never leave it closed.
      ScrollTrigger.batch(els, { start: 'top 85%', once: true, onEnter: open, onLeave: open })
    },
    { scope },
  )
}

// Gentle parallax on [data-parallax] chapter numbers inside `scope`, across their section.
// Desktop only; never with reduced motion.
export function useParallax(scope) {
  useMotion(
    (ctx, { gsap, conditions }) => {
      if (!conditions.parallax) return
      gsap.utils.toArray('[data-parallax]', scope.value).forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: -15 },
          {
            yPercent: 15,
            ease: 'none',
            scrollTrigger: { trigger: el.closest('section, li') ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })
    },
    { scope, conditions: { parallax: '(min-width: 900px) and (prefers-reduced-motion: no-preference)' } },
  )
}
