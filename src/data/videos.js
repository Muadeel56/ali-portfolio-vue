// Video catalogue for the Work page and the home page.
// `category` is a /work chapter id (see `chapters`), or null for films kept here but not shown on /work
// (they can still be opened privately with /work?film=<slug>).
// Asset paths are relative to VITE_CDN_URL and are produced by scripts/encode-videos.sh
// (see scripts/videos.csv). Files under v2/ are immutable: to change a video, give it a new slug.

import { site } from './site.js'

const CDN = import.meta.env.VITE_CDN_URL

export const cdn = (path) => `${CDN}/${path}`

// Builds the CDN paths for a slug following the encode script's naming.
// Pass { hd: false } for sources of 720p or less: the encode script makes no 1080p file for them.
const assets = (slug, { hd = true } = {}) => ({
  poster: `v2/${slug}/${slug}-poster`,
  preview: `v2/${slug}/${slug}-preview.mp4`,
  src: {
    ...(hd && { 1080: `v2/${slug}/${slug}-1080.mp4` }),
    720: `v2/${slug}/${slug}-720.mp4`,
  },
})

export const videos = [
  // ── Touchstone Communications ─────────────────────────────
  {
    slug: 'premier-league-highlights',
    title: 'Premier League Highlights',
    client: 'Touchstone Communications',
    category: 'brand',
    year: 2026,
    type: 'Corporate Event',
    duration: 109,
    aspect: '16:9',
    featured: false,
    desc: 'Full event highlight reel from Touchstone Communications Premier League — capturing energy, moments, and brand identity.',
    ...assets('premier-league-highlights'),
  },
  {
    slug: 'talha-success-story',
    title: 'Employee Success Story',
    client: 'Touchstone Communications',
    category: 'documentary',
    year: 2026,
    type: 'Corporate Documentary',
    duration: 137,
    aspect: '16:9',
    featured: false,
    desc: 'A personal story of growth and ambition — documenting a Touchstone Communications employee\'s journey.',
    ...assets('talha-success-story'),
  },
  {
    slug: 'touchstone-brand-film',
    title: 'Corporate Brand Film',
    client: 'Touchstone Communications',
    category: 'brand',
    year: 2026,
    type: 'Brand Film',
    duration: 118,
    aspect: '16:9',
    featured: true,
    desc: 'A cinematic brand documentary showcasing Touchstone Communications — culture, people, and purpose.',
    ...assets('touchstone-brand-film'),
  },
  // TODO: confirm titles and year with Ali
  {
    slug: 'premier-league-part-2',
    title: 'Premier League Highlights — Part II',
    client: 'Touchstone Communications',
    category: null,
    year: 2026,
    type: 'Corporate Event',
    duration: 98,
    aspect: '16:9',
    featured: false,
    desc: 'The second chapter of the Touchstone Premier League — night matches, team spirit, and words from CEO Yousaf H Eashai.',
    ...assets('premier-league-part-2', { hd: false }),
  },
  {
    slug: 'touchstone-office-tour',
    title: 'Touchstone — Saddar Office Tour',
    client: 'Touchstone Communications',
    category: null,
    year: 2026,
    type: 'Office Tour',
    duration: 66,
    aspect: '16:9',
    featured: false,
    desc: 'A walkthrough of Touchstone Communications\' Saddar, Rawalpindi office — the floors, the teams, and the culture.',
    ...assets('touchstone-office-tour', { hd: false }),
  },
  {
    slug: 'touchstone-intern-story',
    title: 'Touchstone — Intern Story',
    client: 'Touchstone Communications',
    category: null,
    year: 2026,
    type: 'Employer Brand',
    duration: 58,
    aspect: '9:16',
    featured: false,
    desc: 'An HR intern shares her journey at Touchstone Communications — mentorship, hands-on work, and growth.',
    ...assets('touchstone-intern-story', { hd: false }),
  },
  // ── Clothing Brand ────────────────────────────────────────
  {
    slug: 'clothing-campaign-launch',
    title: 'Campaign Launch Film',
    client: 'Clothing Brand',
    category: 'fashion',
    year: 2026,
    type: 'Fashion Film',
    duration: 33,
    aspect: '9:16',
    featured: false,
    desc: 'A cinematic launch film for a clothing brand — styled looks, movement, and mood in one cohesive cut.',
    ...assets('clothing-campaign-launch'),
  },
  {
    slug: 'clothing-brand-reel',
    title: 'Brand Highlight Reel',
    client: 'Clothing Brand',
    category: 'short-form',
    year: 2026,
    type: 'Brand Reel',
    duration: 42,
    aspect: '9:16',
    featured: false,
    desc: 'Final compiled highlight reel showcasing the best moments from the clothing brand shoot.',
    ...assets('clothing-brand-reel'),
  },
  {
    slug: 'clothing-behind-the-shoot',
    title: 'Behind the Shoot',
    client: 'Clothing Brand',
    category: 'short-form',
    year: 2026,
    type: 'Behind the Scenes',
    duration: 24,
    aspect: '9:16',
    featured: false,
    desc: 'A behind-the-scenes look at the clothing brand shoot — raw, candid, and in motion.',
    ...assets('clothing-behind-the-shoot'),
  },
  {
    slug: 'clothing-lifestyle-campaign',
    title: 'Lifestyle Campaign',
    client: 'Clothing Brand',
    category: 'fashion',
    year: 2026,
    type: 'Lifestyle',
    duration: 35,
    aspect: '9:16',
    featured: false,
    desc: 'Editorial lifestyle film for a clothing label — evoking aspiration through movement and environment.',
    ...assets('clothing-lifestyle-campaign'),
  },
  // TODO: confirm title, client and year with Ali
  {
    slug: 'eastern-wear-lookbook',
    title: 'Eastern Wear Lookbook',
    client: 'Clothing Brand',
    category: null,
    year: 2026,
    type: 'Lookbook',
    duration: 38,
    aspect: '9:16',
    featured: false,
    desc: 'A sunlit outdoor lookbook for a women\'s eastern-wear collection — prints, florals, and golden-hour movement.',
    ...assets('eastern-wear-lookbook'),
  },
  // ── Khais ─────────────────────────────────────────────────
  {
    slug: 'khais-brand-reel',
    title: 'Khais — Brand Reel',
    client: 'Khais',
    category: 'short-form',
    year: 2026,
    type: 'Brand Reel',
    duration: 23,
    aspect: '9:16',
    featured: false,
    desc: 'Second campaign reel for Khais beauty brand — product story told through texture, light, and detail.',
    ...assets('khais-brand-reel'),
  },
  {
    slug: 'khais-product-shoot',
    title: 'Khais — Product Shoot',
    client: 'Khais',
    category: 'fashion',
    year: 2026,
    type: 'Product Shoot',
    duration: 23,
    aspect: '9:16',
    featured: false,
    desc: 'Product launch film for Khais — two hero products, one visual story.',
    ...assets('khais-product-shoot'),
  },
  // ── Commercial ────────────────────────────────────────────
  {
    slug: 'tax-smart-promo',
    title: 'Tax Smart — Promo Film',
    client: 'Tax Smart',
    category: null,
    year: 2026,
    type: 'Promo Film',
    duration: 34,
    aspect: '9:16',
    featured: false,
    desc: 'Promotional video for Tax Smart — clear messaging, clean visuals, and a strong brand voice.',
    ...assets('tax-smart-promo'),
  },
  // TODO: confirm title, client and year with Ali
  {
    slug: 'mothers-day-film',
    title: 'Mother\'s Day — Corporate Film',
    client: 'Corporate Client',
    category: null,
    year: 2026,
    type: 'Corporate Film',
    duration: 88,
    aspect: '16:9',
    featured: false,
    desc: 'A warm Mother\'s Day tribute to the working mothers of an office team — candid moments, stories, and celebration.',
    ...assets('mothers-day-film'),
  },
  // ── Real Estate ───────────────────────────────────────────
  {
    slug: 'emarat-property-film',
    title: 'Emarat Developers — Property Film',
    client: 'Emarat Developers',
    category: null,
    year: 2026,
    type: 'Real Estate',
    duration: 39,
    aspect: '9:16',
    featured: false,
    desc: 'A property showcase film for Emarat Developers — architecture, space, and aspiration.',
    ...assets('emarat-property-film'),
  },
  // TODO: confirm title, client and year with Ali
  {
    slug: 'property-walkthrough',
    title: 'Waterfront Residence — Walkthrough',
    client: 'Private Client',
    category: 'brand',
    year: 2026,
    type: 'Property Tour',
    duration: 120,
    aspect: '16:9',
    featured: false,
    desc: 'An aerial-to-interior walkthrough of a waterfront apartment — skyline views, open living, and quiet bedrooms.',
    ...assets('property-walkthrough'),
  },
  // ── Short-form / Podcast ──────────────────────────────────
  // TODO: confirm titles, and whether these count as the podcast example, with Ali
  {
    slug: 'reliablebits-netsuite-vs-custom',
    title: 'ReliableBits — NetSuite vs Custom Build',
    client: 'ReliableBits',
    category: null,
    year: 2026,
    type: 'Short-form',
    duration: 102,
    aspect: '9:16',
    featured: false,
    desc: 'A punchy talking-head short for ReliableBits — captions, screen overlays, and fast pacing built for social feeds.',
    ...assets('reliablebits-netsuite-vs-custom'),
  },
  {
    slug: 'reliablebits-we-build-it',
    title: 'ReliableBits — We Build It. You Own It.',
    client: 'ReliableBits',
    category: null,
    year: 2026,
    type: 'Short-form',
    duration: 97,
    aspect: '9:16',
    featured: false,
    desc: 'Second ReliableBits short — a client story told through on-camera delivery and animated product screens.',
    ...assets('reliablebits-we-build-it'),
  },
  // TODO: confirm title, guests and year with Ali
  {
    slug: 'ioa-talks-interview',
    title: 'IOA Talks — Leaders in Islamabad',
    client: 'IOA Talks',
    category: null,
    year: 2026,
    type: 'Interview',
    duration: 73,
    aspect: '16:9',
    featured: false,
    desc: 'A two-camera sit-down conversation from IOA Talks — candid answers, archival cutaways, and the Islamabad skyline.',
    ...assets('ioa-talks-interview'),
  },
  // ── Events ────────────────────────────────────────────────
  // TODO: confirm titles, clients and year with Ali
  {
    slug: 'khushhali-anniversary-event',
    title: 'Khushhali — 26th Anniversary',
    client: 'Khushhali',
    category: null,
    year: 2026,
    type: 'Corporate Event',
    duration: 172,
    aspect: '16:9',
    featured: false,
    desc: 'Highlights from a corporate anniversary celebration — arrivals, speeches, awards, and the full team on stage.',
    ...assets('khushhali-anniversary-event'),
  },
  {
    slug: 'roots-international-event',
    title: 'Roots International — Stage Event',
    client: 'Roots International',
    category: null,
    year: 2026,
    type: 'School Event',
    duration: 167,
    aspect: '16:9',
    featured: false,
    desc: 'Stage performances, awards, and proud families — the highlights of a Roots International school event.',
    ...assets('roots-international-event'),
  },
  {
    slug: 'iftar-dinner-event',
    title: 'Iftar Dinner — Event Film',
    client: 'Corporate Client',
    category: null,
    year: 2026,
    type: 'Iftar Dinner',
    duration: 90,
    aspect: '16:9',
    featured: false,
    desc: 'An elegant corporate iftar gathering — guests, conversation, and the team together under the chandeliers.',
    ...assets('iftar-dinner-event'),
  },
  {
    slug: 'storytelling-masterclass',
    title: 'Visual Storytelling Masterclass',
    client: 'National Incubation Center',
    category: null,
    year: 2026,
    type: 'Workshop',
    duration: 61,
    aspect: '16:9',
    featured: false,
    desc: 'A workshop recap from the National Incubation Center, Islamabad — in collaboration with Sony Pakistan.',
    ...assets('storytelling-masterclass'),
  },
  // ── Documentary ───────────────────────────────────────────
  {
    slug: 'dr-shandana-healthcare',
    title: 'Dr. Shandana — Healthcare Story',
    client: 'Dr. Shandana',
    category: 'documentary',
    year: 2026,
    type: 'Healthcare',
    duration: 73,
    aspect: '16:9',
    featured: false,
    desc: 'A documentary portrait of a diagnostic center in the twin cities — healthcare, community, and compassion.',
    ...assets('dr-shandana-healthcare'),
  },
  // TODO: confirm title and year with Ali
  {
    slug: 'dr-kaleeq-health-talk',
    title: 'Dr. Kaleeq — Health Talk',
    client: 'Dr. Kaleeq',
    category: null,
    year: 2026,
    type: 'Healthcare',
    duration: 352,
    aspect: '16:9',
    featured: false,
    desc: 'A doctor\'s talk on how children can support and include children with special needs — with illustrated medical inserts.',
    ...assets('dr-kaleeq-health-talk', { hd: false }),
  },
  // TODO: from Ali — confirm the client name
  {
    slug: 'breast-cancer-awareness',
    title: 'Breast Cancer — Awareness Film',
    client: 'Awareness Campaign',
    category: 'documentary',
    year: 2026,
    type: 'Awareness',
    duration: 159,
    aspect: '16:9',
    featured: true,
    desc: 'A powerful awareness campaign film about breast cancer — stories that matter, told with care.',
    ...assets('breast-cancer-awareness'),
  },
  // ── Wedding Films ─────────────────────────────────────────
  {
    slug: 'kudsiya-bridal',
    title: 'Kudsiya — Bridal Film',
    client: 'Kudsiya',
    category: 'weddings',
    year: 2026,
    type: 'Bridal Film',
    duration: 120,
    aspect: '16:9',
    featured: true,
    desc: 'A cinematic tribute to tradition and elegance — bridal dress shoot capturing grace, detail, and emotion.',
    ...assets('kudsiya-bridal'),
  },
  // TODO: confirm title and year with Ali
  {
    slug: 'bushra-hussain-wedding',
    title: 'Bushra & Hussain — Wedding Film',
    client: 'Bushra & Hussain',
    category: 'weddings',
    year: 2026,
    type: 'Couple Shoot',
    duration: 75,
    aspect: '16:9',
    featured: false,
    desc: 'A cinematic couple shoot set against open hills — a sweeping red lehenga, quiet glances, and golden light.',
    ...assets('bushra-hussain-wedding'),
  },
]

// The five chapters of the Work page, in page order. Each is tied to one service (`serviceId`)
// and shows at most three films: `filmSlugs` sets the order and the first one is the lead.
// `previewVideoId` plays on the home page chapter rows; `navLabel` is the short sticky-bar label.
// TODO: from Ali — confirm chapter descriptions and film picks (a third wedding film from Phase 0).
export const chapters = [
  {
    id: 'brand',
    number: '01',
    title: 'Brand & Corporate',
    navLabel: 'Brand',
    desc: 'Brand films and corporate stories for companies that want to be remembered.',
    serviceId: 'corporate',
    filmSlugs: ['touchstone-brand-film', 'premier-league-highlights', 'property-walkthrough'],
    previewVideoId: 'touchstone-brand-film',
  },
  {
    id: 'fashion',
    number: '02',
    title: 'Fashion & Beauty',
    navLabel: 'Fashion',
    desc: 'Campaign films and product shoots for labels, cut for texture, light and movement.',
    serviceId: 'corporate',
    filmSlugs: ['clothing-campaign-launch', 'clothing-lifestyle-campaign', 'khais-product-shoot'],
    previewVideoId: 'clothing-campaign-launch',
  },
  {
    id: 'documentary',
    number: '03',
    title: 'Documentary & Stories',
    navLabel: 'Documentary',
    desc: 'Longer stories about people, health and the work they do.',
    serviceId: 'documentary',
    filmSlugs: ['dr-shandana-healthcare', 'breast-cancer-awareness', 'talha-success-story'],
    previewVideoId: 'breast-cancer-awareness',
  },
  {
    id: 'short-form',
    number: '04',
    title: 'Short Form & Reels',
    navLabel: 'Short Form',
    desc: 'Vertical reels and social cuts built for the feed.',
    serviceId: 'short-form',
    filmSlugs: ['clothing-brand-reel', 'khais-brand-reel', 'clothing-behind-the-shoot'],
    previewVideoId: 'clothing-brand-reel',
  },
  {
    id: 'weddings',
    number: '05',
    title: 'Weddings',
    navLabel: 'Weddings',
    desc: 'Bridal films and couple shoots, cut for the feeling of the day.',
    serviceId: 'wedding',
    filmSlugs: ['kudsiya-bridal', 'bushra-hussain-wedding'],
    previewVideoId: 'kudsiya-bridal',
  },
]

export const findVideo = (slug) => videos.find((v) => v.slug === slug) ?? null
export const findChapter = (id) => chapters.find((c) => c.id === id) ?? null
export const chapterFilms = (chapter) => (chapter?.filmSlugs ?? []).map(findVideo).filter(Boolean)
export const chapterForVideo = (video) => (video?.category ? findChapter(video.category) : null)

// Featured films on the home page, in data order (the first one is shown large).
// The showreel film is left out so it doesn't repeat the hero. TODO: from Ali — pick the final three.
export const featuredVideos = videos.filter((v) => v.featured)

if (import.meta.env.DEV) {
  const slugs = videos.map((v) => v.slug)
  for (const slug of slugs) console.assert(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug), `videos.js: bad slug "${slug}"`)
  console.assert(new Set(slugs).size === slugs.length, 'videos.js: duplicate slugs')
  for (const chapter of chapters) {
    console.assert(chapter.filmSlugs.length <= 3, `videos.js: chapter "${chapter.id}" has more than 3 films`)
    for (const slug of chapter.filmSlugs) {
      console.assert(findVideo(slug)?.category === chapter.id, `videos.js: "${slug}" missing or not in chapter "${chapter.id}"`)
    }
  }
  for (const v of videos) {
    console.assert(!v.category || findChapter(v.category)?.filmSlugs.includes(v.slug), `videos.js: "${v.slug}" not listed in its chapter`)
  }
}

export const showreel = {
  // Plays the Premier League film until Ali sends a dedicated 60–90s reel.
  videoSlug: 'premier-league-highlights',
  // Short silent loop behind the home hero (scripts/encode-videos.sh --loop).
  // TODO: from Ali — once the loop cut is encoded and uploaded, set
  //   loop: 'v2/showreel/showreel-loop.mp4', loopPoster: 'v2/showreel/showreel-loop-poster'
  // Until then the hero falls back to the reel film's 5s preview and poster.
  loop: null,
  loopPoster: null,
  hud: { left: 'Rawalpindi · Remote Worldwide', right: site.availability },
  // Home hero headline, one entry per line. TODO: from Ali — confirm copy.
  eyebrow: 'Videographer & Editor',
  headline: [{ text: 'Raw footage,' }, { text: 'cut into films' }, { text: 'people feel.', accent: true }],
  intro: 'Weddings, brands and documentaries, edited and graded in Rawalpindi for clients worldwide.',
  title: 'A year, in motion.',
  meta: 'Selected Works · 2025–2026',
}

// Poster <img> attributes. The size suffix is the long side, so portrait posters
// are 360w / 720w and landscape posters are 640w / 1280w.
export const posterAttrs = (video) => {
  const small = cdn(`${video.poster}-640.webp`)
  const large = cdn(`${video.poster}-1280.webp`)
  const portrait = video.aspect === '9:16'
  const [w1, w2] = portrait ? [360, 720] : [640, 1280]
  return {
    src: small,
    large,
    srcset: `${small} ${w1}w, ${large} ${w2}w`,
    width: w1,
    height: portrait ? 640 : 360,
  }
}

// True for data saver and 2G/3G connections.
export const isSlowConnection = () => {
  const conn = navigator.connection
  return Boolean(conn?.saveData) || ['slow-2g', '2g', '3g'].includes(conn?.effectiveType)
}

export const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

// Chooses 720p for small/dense screens, slow connections and data saver; otherwise 1080p.
export const pickSource = (video) => {
  const small = window.innerWidth * window.devicePixelRatio <= 1440
  return cdn(isSlowConnection() || small ? video.src[720] : (video.src[1080] ?? video.src[720]))
}

export const formatDuration = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`

// CLIENT · YEAR · TYPE · LENGTH, the caption under every film.
export const filmMeta = (video) =>
  [video.client, video.year, video.type, formatDuration(video.duration)].filter(Boolean).join(' · ')
