// Privacy-friendly analytics (Plausible: no cookies, no consent banner).
// Components call track(), never the vendor API. Everything no-ops in dev and when
// VITE_PLAUSIBLE_DOMAIN is unset. Configure a Plausible goal for each event name below.
//
// Events: 'Video Play' { slug, chapter, source }, 'Enquire Click' { service, from },
//         'WhatsApp Click' { from }, 'Form Submit' { service, budget }, 'Copy Film Link' { slug }

const DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN
const enabled = Boolean(DOMAIN) && import.meta.env.PROD

// Plausible's documented queue stub, so events fired before the script loads are kept.
const plausible = () => {
  window.plausible ??= function (...args) {
    ;(window.plausible.q ??= []).push(args)
  }
  return window.plausible
}

export const track = (event, props = {}) => {
  if (!enabled) {
    if (import.meta.env.DEV) console.debug('[analytics]', event, props)
    return
  }
  // Plausible drops empty props
  const clean = Object.fromEntries(Object.entries(props).filter(([, v]) => v != null && v !== ''))
  plausible()(event, { props: clean })
}

// Loads the script once the page is idle, so it never competes with the LCP image.
export const initAnalytics = () => {
  if (!enabled) return
  plausible()
  const load = () => {
    const script = document.createElement('script')
    script.defer = true
    script.dataset.domain = DOMAIN
    script.src = 'https://plausible.io/js/script.js'
    document.head.appendChild(script)
  }
  const idle = () => (window.requestIdleCallback ?? ((cb) => setTimeout(cb, 1500)))(load)
  if (document.readyState === 'complete') idle()
  else window.addEventListener('load', idle, { once: true })
}

// Delegated "Enquire Click": any link to /contact?service=<id>. `from` comes from the
// nearest [data-track-from] ancestor (e.g. "services", "home", "chapter", "end-screen").
export const trackEnquireClicks = () => {
  document.addEventListener('click', (e) => {
    const link = e.target.closest?.('a[href*="/contact?"]')
    if (!link) return
    const service = new URL(link.href).searchParams.get('service')
    if (!service) return
    track('Enquire Click', { service, from: link.closest('[data-track-from]')?.dataset.trackFrom ?? 'other' })
  })
}
