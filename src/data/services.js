// Shared by the home page, the /services page and the contact form.
// `id` is used in /contact?service=<id>; `chapter` is a /work chapter id (see `chapters` in videos.js).
// `workLink` overrides the "See work" target; with neither set, "See work" is hidden.
export const services = [
  {
    id: 'wedding',
    num: '01',
    title: 'Wedding Film Edit',
    desc: 'Raw footage transformed into a cinematic wedding film — highlights, full ceremony cuts, and reception edits. Color graded, synced to music, and delivered in broadcast-ready formats.',
    tags: ['Highlight reel', 'Full ceremony cut', 'Color grading', 'Music sync'],
    chapter: 'weddings',
  },
  {
    id: 'corporate',
    num: '02',
    title: 'Corporate & Brand Video Edit',
    desc: 'Polished edits for brand films, product launches, and corporate presentations. Clean pacing, branded motion graphics, and multiple revision rounds included.',
    tags: ['Brand films', 'Motion graphics', 'Multiple revisions', 'Branded delivery'],
    chapter: 'brand',
  },
  {
    id: 'short-form',
    num: '03',
    title: 'Short Form Content Edit',
    desc: 'Reels, TikToks, and social-first vertical cuts built for engagement — fast-paced editing, trending formats, captions, and platform-optimised delivery.',
    tags: ['Reels & TikToks', 'Vertical format', 'Captions & text', 'Fast turnaround'],
    chapter: 'short-form',
  },
  {
    id: 'documentary',
    num: '04',
    title: 'Documentary & Long-Form Edit',
    desc: 'Story-driven editing for documentaries, interviews, and long-form content. Narrative structure, pacing, sound design, and colour work handled end-to-end.',
    tags: ['Story structure', 'Interview cutting', 'Sound design', 'Colour grade'],
    chapter: 'documentary',
  },
  {
    id: 'color-grading',
    num: '05',
    title: 'Color Grading',
    desc: 'Standalone colour grading for footage already shot. LUT creation, scene-by-scene correction, and cinematic grade delivery — compatible with Premiere, Resolve, and Final Cut.',
    tags: ['Scene correction', 'LUT creation', 'Cinematic grade', 'All NLE formats'],
    chapter: null,
    // The before/after slider on the home page
    workLink: '/#grading',
  },
  {
    id: 'podcast',
    num: '06',
    title: 'Podcast Video Edit',
    desc: 'Multi-camera podcast edits with jump-cut cleaning, lower thirds, intro/outro, and highlight clip exports for social distribution.',
    tags: ['Multi-cam sync', 'Jump-cut clean', 'Lower thirds', 'Highlight clips'],
    // TODO: from Ali — a podcast sample, then a podcast chapter on /work
    chapter: null,
  },
]

export const findService = (id) => services.find((s) => s.id === id) ?? null

// Where a service's "See work" link points, or null to hide it.
export const serviceWorkLink = (service) =>
  service.workLink ?? (service.chapter ? { path: '/work', hash: `#${service.chapter}` } : null)
