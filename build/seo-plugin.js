import { runnerImport } from 'vite'
import { fileURLToPath } from 'node:url'

// Build-time SEO from the app's own data, so nothing is written twice:
// - Open Graph / Twitter / canonical tags with absolute URLs (VITE_SITE_URL)
// - JSON-LD: Person + ProfessionalService (from site.js, services.js, contact.js)
// - sitemap.xml and robots.txt
// Link previews (WhatsApp, LinkedIn, X) don't run JS, so these static tags serve every page.

const root = fileURLToPath(new URL('..', import.meta.url))

// The indexable routes (the 404 is noindex). Keep in sync with src/router/index.js.
const ROUTES = ['/', '/work', '/services', '/about', '/contact']

const load = async (path) => (await runnerImport(`${root}${path}`, { root, configFile: false })).module

const jsonLd = async (siteUrl) => {
  const [{ site }, { services, formatPrice }, { socials, EMAIL }] = await Promise.all([
    load('src/data/site.js'),
    load('src/data/services.js'),
    load('src/data/contact.js'),
  ])
  const [city, country] = site.location.split(',').map((s) => s.trim())
  const person = {
    '@type': 'Person',
    '@id': `${siteUrl}/#person`,
    name: site.name,
    jobTitle: 'Video Editor & Colorist',
    url: `${siteUrl}/`,
    email: `mailto:${EMAIL}`,
    address: { '@type': 'PostalAddress', addressLocality: city, addressCountry: country === 'Pakistan' ? 'PK' : country },
    sameAs: socials.map((s) => s.href),
  }
  const business = {
    '@type': 'ProfessionalService',
    '@id': `${siteUrl}/#business`,
    name: `${site.name} — Video Editing & Colour Grading`,
    url: `${siteUrl}/`,
    image: `${siteUrl}/og.jpg`,
    founder: { '@id': person['@id'] },
    address: person.address,
    areaServed: 'Worldwide',
    makesOffer: services.map((s) => ({
      '@type': 'Offer',
      url: `${siteUrl}/services#service-${s.id}`,
      ...(s.priceFrom && {
        priceSpecification: {
          '@type': 'PriceSpecification',
          minPrice: s.priceFrom.amount,
          priceCurrency: s.priceFrom.currency ?? 'USD',
          description: formatPrice(s.priceFrom),
        },
      }),
      itemOffered: { '@type': 'Service', name: s.title, description: s.desc },
    })),
  }
  return { '@context': 'https://schema.org', '@graph': [person, business] }
}

const sitemap = (siteUrl) => {
  const lastmod = new Date().toISOString().slice(0, 10)
  const urls = ROUTES.map((path) => `  <url><loc>${siteUrl}${path}</loc><lastmod>${lastmod}</lastmod></url>`).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

const robots = (siteUrl) => `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`

export function seo(siteUrlEnv) {
  const siteUrl = (siteUrlEnv || 'http://localhost:5173').replace(/\/$/, '')
  return {
    name: 'seo',
    configResolved(config) {
      if (config.command === 'build' && !siteUrlEnv) {
        config.logger.warn('[seo] VITE_SITE_URL is not set: canonical, Open Graph and sitemap URLs point to localhost.')
      }
    },
    async transformIndexHtml(html) {
      const meta = (attrs) => ({ tag: 'meta', attrs, injectTo: 'head' })
      const title = html.match(/<title>(.*?)<\/title>/)?.[1].replaceAll('&amp;', '&') ?? ''
      const description = html.match(/<meta name="description" content="(.*?)"/)?.[1] ?? ''
      return [
        { tag: 'link', attrs: { rel: 'canonical', href: `${siteUrl}/` }, injectTo: 'head' },
        meta({ property: 'og:type', content: 'website' }),
        meta({ property: 'og:site_name', content: 'Ali Hassan' }),
        meta({ property: 'og:title', content: title }),
        meta({ property: 'og:description', content: description }),
        meta({ property: 'og:url', content: `${siteUrl}/` }),
        meta({ property: 'og:image', content: `${siteUrl}/og.jpg` }),
        meta({ property: 'og:image:width', content: '1200' }),
        meta({ property: 'og:image:height', content: '630' }),
        meta({ property: 'og:image:alt', content: 'Ali Hassan — video editor and colorist' }),
        meta({ name: 'twitter:card', content: 'summary_large_image' }),
        meta({ name: 'twitter:title', content: title }),
        meta({ name: 'twitter:description', content: description }),
        meta({ name: 'twitter:image', content: `${siteUrl}/og.jpg` }),
        {
          tag: 'script',
          attrs: { type: 'application/ld+json' },
          children: JSON.stringify(await jsonLd(siteUrl)),
          injectTo: 'head',
        },
      ]
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap(siteUrl) })
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots(siteUrl) })
    },
  }
}
