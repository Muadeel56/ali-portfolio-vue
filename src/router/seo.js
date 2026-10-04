import { site } from '@/data/site.js'

// Absolute site URL for canonical links and og:url. VITE_SITE_URL in production;
// falls back to the current origin so previews and localhost still get valid URLs.
export const SITE_URL = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '')

const upsert = (selector, create) => {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  return el
}

const setMeta = (attr, key, content) => {
  upsert(`meta[${attr}="${key}"]`, () => {
    const m = document.createElement('meta')
    m.setAttribute(attr, key)
    return m
  }).setAttribute('content', content)
}

// Title, description, canonical and og:url for a route. Crawlers that run JS (Google) read these;
// link previews (WhatsApp, LinkedIn, X) only ever see the static tags in index.html.
export const applyPageMeta = (route) => {
  const { title, description, noindex } = route.meta
  const fullTitle = route.name === 'home' ? title : `${title} — ${site.name}`
  document.title = fullTitle
  if (description) {
    setMeta('name', 'description', description)
    setMeta('property', 'og:description', description)
  }
  setMeta('property', 'og:title', fullTitle)

  const canonical = upsert('link[rel="canonical"]', () => {
    const l = document.createElement('link')
    l.rel = 'canonical'
    return l
  })
  // The 404 has no canonical URL of its own (NotFoundView also adds noindex)
  if (noindex) {
    canonical.remove()
    return
  }
  const url = `${SITE_URL}${route.path === '/' ? '/' : route.path}`
  canonical.href = url
  setMeta('property', 'og:url', url)
}
