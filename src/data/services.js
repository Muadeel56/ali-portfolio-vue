import { findChapter, chapterFilms } from './videos.js'
import { gradingPairs } from './grading.js'

// Shared by the home page, the /services page and the contact form.
// `id` is used in /contact?service=<id>; `chapter` is a /work chapter id (see `chapters` in videos.js).
// `workLink` overrides the "See work" target; with neither set, "See work" is hidden.
// `turnaround` is always shown. `priceFrom` is optional: { amount, currency } or null to hide it.
// TODO: from Ali — real turnaround per service, "from" prices (or keep them hidden), confirm deliverables.
export const services = [
  {
    id: 'wedding',
    num: '01',
    title: 'Wedding Film Edit',
    desc: 'Raw footage transformed into a cinematic wedding film — highlights, full ceremony cuts, and reception edits. Color graded, synced to music, and delivered in broadcast-ready formats.',
    deliverables: ['Highlight reel', 'Full ceremony cut', 'Color grading', 'Music sync'],
    turnaround: '7–10 days',
    priceFrom: null,
    chapter: 'weddings',
  },
  {
    id: 'corporate',
    num: '02',
    title: 'Corporate & Brand Video Edit',
    desc: 'Polished edits for brand films, product launches, and corporate presentations. Clean pacing, branded motion graphics, and multiple revision rounds included.',
    deliverables: ['Brand films', 'Motion graphics', 'Multiple revisions', 'Branded delivery'],
    turnaround: '5–7 days',
    priceFrom: null,
    chapter: 'brand',
  },
  {
    id: 'short-form',
    num: '03',
    title: 'Short Form Content Edit',
    desc: 'Reels, TikToks, and social-first vertical cuts built for engagement — fast-paced editing, trending formats, captions, and platform-optimised delivery.',
    deliverables: ['Reels & TikToks', 'Vertical format', 'Captions & text', 'Fast turnaround'],
    turnaround: '2–3 days',
    priceFrom: null,
    chapter: 'short-form',
  },
  {
    id: 'documentary',
    num: '04',
    title: 'Documentary & Long-Form Edit',
    desc: 'Story-driven editing for documentaries, interviews, and long-form content. Narrative structure, pacing, sound design, and colour work handled end-to-end.',
    deliverables: ['Story structure', 'Interview cutting', 'Sound design', 'Colour grade'],
    turnaround: '2–4 weeks',
    priceFrom: null,
    chapter: 'documentary',
  },
  {
    id: 'color-grading',
    num: '05',
    title: 'Color Grading',
    desc: 'Standalone colour grading for footage already shot. LUT creation, scene-by-scene correction, and cinematic grade delivery — compatible with Premiere, Resolve, and Final Cut.',
    deliverables: ['Scene correction', 'LUT creation', 'Cinematic grade', 'All NLE formats'],
    turnaround: '3–5 days',
    priceFrom: null,
    chapter: null,
    // The before/after slider on the home page
    workLink: '/#grading',
  },
  {
    id: 'podcast',
    num: '06',
    title: 'Podcast Video Edit',
    desc: 'Multi-camera podcast edits with jump-cut cleaning, lower thirds, intro/outro, and highlight clip exports for social distribution.',
    deliverables: ['Multi-cam sync', 'Jump-cut clean', 'Lower thirds', 'Highlight clips'],
    turnaround: '3–5 days',
    priceFrom: null,
    // TODO: from Ali — a podcast sample, then a podcast chapter on /work
    chapter: null,
  },
]

export const findService = (id) => services.find((s) => s.id === id) ?? null

// Where a service's "See work" link points, or null to hide it.
export const serviceWorkLink = (service) =>
  service.workLink ?? (service.chapter ? { path: '/work', hash: `#${service.chapter}` } : null)

// "From $250". Components never format prices themselves.
export const formatPrice = (priceFrom) =>
  priceFrom
    ? `From ${new Intl.NumberFormat('en-US', { style: 'currency', currency: priceFrom.currency ?? 'USD', maximumFractionDigits: 0 }).format(priceFrom.amount)}`
    : null

// The /services thumbnail: the lead film of the service's chapter, linking to that chapter.
// Colour grading uses the graded frame of the home page slider. Null when there's nothing to show.
export const serviceThumb = (service) => {
  if (service.id === 'color-grading' && gradingPairs[0]) {
    return { poster: gradingPairs[0].after, title: gradingPairs[0].project, label: 'See the grade', to: service.workLink }
  }
  const chapter = findChapter(service.chapter)
  const film = chapterFilms(chapter)[0]
  if (!film) return null
  return { video: film, title: film.title, label: `See ${chapter.title}`, to: { path: '/work', hash: `#${chapter.id}` } }
}

if (import.meta.env.DEV) {
  for (const s of services) {
    console.assert(s.turnaround, `services.js: "${s.id}" has no turnaround`)
    console.assert(!s.chapter || findChapter(s.chapter), `services.js: "${s.id}" chapter "${s.chapter}" not found`)
  }
}
