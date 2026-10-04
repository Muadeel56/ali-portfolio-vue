// Video catalogue for the Work page.
// Asset paths are relative to VITE_CDN_URL and are produced by scripts/encode-videos.sh
// (see scripts/videos.csv). Files under v2/ are immutable: to change a video, give it a new slug.

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
    id: 'premier-league-highlights',
    category: 'Touchstone Communications',
    tag: '2026 · Corporate Event',
    title: 'Premier League Highlights',
    sub: 'Corporate Event Film',
    desc: 'Full event highlight reel from Touchstone Communications Premier League — capturing energy, moments, and brand identity.',
    orientation: 'landscape',
    duration: 109,
    ...assets('premier-league-highlights'),
  },
  {
    id: 'talha-success-story',
    category: 'Touchstone Communications',
    tag: '2026 · Corporate Documentary',
    title: 'Employee Success Story',
    sub: 'Corporate Documentary',
    desc: 'A personal story of growth and ambition — documenting a Touchstone Communications employee\'s journey.',
    orientation: 'landscape',
    duration: 137,
    ...assets('talha-success-story'),
  },
  {
    id: 'touchstone-brand-film',
    category: 'Touchstone Communications',
    tag: '2026 · Brand Film',
    title: 'Corporate Brand Film',
    sub: 'Company Documentary',
    desc: 'A cinematic brand documentary showcasing Touchstone Communications — culture, people, and purpose.',
    orientation: 'landscape',
    duration: 118,
    ...assets('touchstone-brand-film'),
  },
  // TODO: confirm titles and year with Ali
  {
    id: 'premier-league-part-2',
    category: 'Touchstone Communications',
    tag: '2026 · Corporate Event',
    title: 'Premier League Highlights — Part II',
    sub: 'Corporate Event Film',
    desc: 'The second chapter of the Touchstone Premier League — night matches, team spirit, and words from CEO Yousaf H Eashai.',
    orientation: 'landscape',
    duration: 98,
    ...assets('premier-league-part-2', { hd: false }),
  },
  {
    id: 'touchstone-office-tour',
    category: 'Touchstone Communications',
    tag: '2026 · Office Tour',
    title: 'Touchstone — Saddar Office Tour',
    sub: 'Workplace Film',
    desc: 'A walkthrough of Touchstone Communications\' Saddar, Rawalpindi office — the floors, the teams, and the culture.',
    orientation: 'landscape',
    duration: 66,
    ...assets('touchstone-office-tour', { hd: false }),
  },
  {
    id: 'touchstone-intern-story',
    category: 'Touchstone Communications',
    tag: '2026 · Employer Brand',
    title: 'Touchstone — Intern Story',
    sub: 'Employer Branding Reel',
    desc: 'An HR intern shares her journey at Touchstone Communications — mentorship, hands-on work, and growth.',
    orientation: 'portrait',
    duration: 58,
    ...assets('touchstone-intern-story', { hd: false }),
  },
  // ── Clothing Brand ────────────────────────────────────────
  {
    id: 'clothing-campaign-launch',
    category: 'Clothing Brand',
    tag: '2026 · Fashion Film',
    title: 'Campaign Launch Film',
    sub: 'Fashion Campaign',
    desc: 'A cinematic launch film for a clothing brand — styled looks, movement, and mood in one cohesive cut.',
    orientation: 'portrait',
    duration: 33,
    ...assets('clothing-campaign-launch'),
  },
  {
    id: 'clothing-brand-reel',
    category: 'Clothing Brand',
    tag: '2026 · Brand Reel',
    title: 'Brand Highlight Reel',
    sub: 'Compiled Brand Reel',
    desc: 'Final compiled highlight reel showcasing the best moments from the clothing brand shoot.',
    orientation: 'portrait',
    duration: 42,
    ...assets('clothing-brand-reel'),
  },
  {
    id: 'clothing-behind-the-shoot',
    category: 'Clothing Brand',
    tag: '2026 · Behind the Scenes',
    title: 'Behind the Shoot',
    sub: 'BTS Fashion Film',
    desc: 'A behind-the-scenes look at the clothing brand shoot — raw, candid, and in motion.',
    orientation: 'portrait',
    duration: 24,
    ...assets('clothing-behind-the-shoot'),
  },
  {
    id: 'clothing-lifestyle-campaign',
    category: 'Clothing Brand',
    tag: '2026 · Lifestyle',
    title: 'Lifestyle Campaign',
    sub: 'Lifestyle Fashion Film',
    desc: 'Editorial lifestyle film for a clothing label — evoking aspiration through movement and environment.',
    orientation: 'portrait',
    duration: 35,
    ...assets('clothing-lifestyle-campaign'),
  },
  // TODO: confirm title, client and year with Ali
  {
    id: 'eastern-wear-lookbook',
    category: 'Clothing Brand',
    tag: '2026 · Lookbook',
    title: 'Eastern Wear Lookbook',
    sub: 'Outdoor Fashion Reel',
    desc: 'A sunlit outdoor lookbook for a women\'s eastern-wear collection — prints, florals, and golden-hour movement.',
    orientation: 'portrait',
    duration: 38,
    ...assets('eastern-wear-lookbook'),
  },
  // ── Khais ─────────────────────────────────────────────────
  {
    id: 'khais-brand-reel',
    category: 'Khais',
    tag: '2026 · Brand Reel',
    title: 'Khais — Brand Reel',
    sub: 'Beauty Brand Film',
    desc: 'Second campaign reel for Khais beauty brand — product story told through texture, light, and detail.',
    orientation: 'portrait',
    duration: 23,
    ...assets('khais-brand-reel'),
  },
  {
    id: 'khais-product-shoot',
    category: 'Khais',
    tag: '2026 · Product Shoot',
    title: 'Khais — Product Shoot',
    sub: 'Beauty Product Film',
    desc: 'Product launch film for Khais — two hero products, one visual story.',
    orientation: 'portrait',
    duration: 23,
    ...assets('khais-product-shoot'),
  },
  // ── Commercial ────────────────────────────────────────────
  {
    id: 'tax-smart-promo',
    category: 'Commercial',
    tag: '2026 · Promo Film',
    title: 'Tax Smart — Promo Film',
    sub: 'Commercial Promo',
    desc: 'Promotional video for Tax Smart — clear messaging, clean visuals, and a strong brand voice.',
    orientation: 'portrait',
    duration: 34,
    ...assets('tax-smart-promo'),
  },
  // TODO: confirm title, client and year with Ali
  {
    id: 'mothers-day-film',
    category: 'Commercial',
    tag: '2026 · Corporate Film',
    title: 'Mother\'s Day — Corporate Film',
    sub: 'Corporate Campaign',
    desc: 'A warm Mother\'s Day tribute to the working mothers of an office team — candid moments, stories, and celebration.',
    orientation: 'landscape',
    duration: 88,
    ...assets('mothers-day-film'),
  },
  // ── Real Estate ───────────────────────────────────────────
  {
    id: 'emarat-property-film',
    category: 'Real Estate',
    tag: '2026 · Real Estate',
    title: 'Emarat Developers — Property Film',
    sub: 'Real Estate Commercial',
    desc: 'A property showcase film for Emarat Developers — architecture, space, and aspiration.',
    orientation: 'portrait',
    duration: 39,
    ...assets('emarat-property-film'),
  },
  // TODO: confirm title, client and year with Ali
  {
    id: 'property-walkthrough',
    category: 'Real Estate',
    tag: '2026 · Property Tour',
    title: 'Waterfront Residence — Walkthrough',
    sub: 'Real Estate Film',
    desc: 'An aerial-to-interior walkthrough of a waterfront apartment — skyline views, open living, and quiet bedrooms.',
    orientation: 'landscape',
    duration: 120,
    ...assets('property-walkthrough'),
  },
  // ── Short-form / Podcast ──────────────────────────────────
  // TODO: confirm titles, and whether these count as the podcast example, with Ali
  {
    id: 'reliablebits-netsuite-vs-custom',
    category: 'Short-form / Podcast',
    tag: '2026 · Short-form',
    title: 'ReliableBits — NetSuite vs Custom Build',
    sub: 'Talking-Head Short',
    desc: 'A punchy talking-head short for ReliableBits — captions, screen overlays, and fast pacing built for social feeds.',
    orientation: 'portrait',
    duration: 102,
    ...assets('reliablebits-netsuite-vs-custom'),
  },
  {
    id: 'reliablebits-we-build-it',
    category: 'Short-form / Podcast',
    tag: '2026 · Short-form',
    title: 'ReliableBits — We Build It. You Own It.',
    sub: 'Talking-Head Short',
    desc: 'Second ReliableBits short — a client story told through on-camera delivery and animated product screens.',
    orientation: 'portrait',
    duration: 97,
    ...assets('reliablebits-we-build-it'),
  },
  // TODO: confirm title, guests and year with Ali
  {
    id: 'ioa-talks-interview',
    category: 'Short-form / Podcast',
    tag: '2026 · Interview',
    title: 'IOA Talks — Leaders in Islamabad',
    sub: 'Interview Highlights',
    desc: 'A two-camera sit-down conversation from IOA Talks — candid answers, archival cutaways, and the Islamabad skyline.',
    orientation: 'landscape',
    duration: 73,
    ...assets('ioa-talks-interview'),
  },
  // ── Events ────────────────────────────────────────────────
  // TODO: confirm titles, clients and year with Ali
  {
    id: 'khushhali-anniversary-event',
    category: 'Events',
    tag: '2026 · Corporate Event',
    title: 'Khushhali — 26th Anniversary',
    sub: 'Event Highlights',
    desc: 'Highlights from a corporate anniversary celebration — arrivals, speeches, awards, and the full team on stage.',
    orientation: 'landscape',
    duration: 172,
    ...assets('khushhali-anniversary-event'),
  },
  {
    id: 'roots-international-event',
    category: 'Events',
    tag: '2026 · School Event',
    title: 'Roots International — Stage Event',
    sub: 'Event Highlights',
    desc: 'Stage performances, awards, and proud families — the highlights of a Roots International school event.',
    orientation: 'landscape',
    duration: 167,
    ...assets('roots-international-event'),
  },
  {
    id: 'iftar-dinner-event',
    category: 'Events',
    tag: '2026 · Iftar Dinner',
    title: 'Iftar Dinner — Event Film',
    sub: 'Event Highlights',
    desc: 'An elegant corporate iftar gathering — guests, conversation, and the team together under the chandeliers.',
    orientation: 'landscape',
    duration: 90,
    ...assets('iftar-dinner-event'),
  },
  {
    id: 'storytelling-masterclass',
    category: 'Events',
    tag: '2026 · Workshop',
    title: 'Visual Storytelling Masterclass',
    sub: 'Workshop Film',
    desc: 'A workshop recap from the National Incubation Center, Islamabad — in collaboration with Sony Pakistan.',
    orientation: 'landscape',
    duration: 61,
    ...assets('storytelling-masterclass'),
  },
  // ── Documentary ───────────────────────────────────────────
  {
    id: 'dr-shandana-healthcare',
    category: 'Documentary',
    tag: '2026 · Healthcare',
    title: 'Dr. Shandana — Healthcare Story',
    sub: 'Healthcare Documentary',
    desc: 'A documentary portrait of a diagnostic center in the twin cities — healthcare, community, and compassion.',
    orientation: 'landscape',
    duration: 73,
    ...assets('dr-shandana-healthcare'),
  },
  // TODO: confirm title and year with Ali
  {
    id: 'dr-kaleeq-health-talk',
    category: 'Documentary',
    tag: '2026 · Healthcare',
    title: 'Dr. Kaleeq — Health Talk',
    sub: 'Healthcare Awareness',
    desc: 'A doctor\'s talk on how children can support and include children with special needs — with illustrated medical inserts.',
    orientation: 'landscape',
    duration: 352,
    ...assets('dr-kaleeq-health-talk', { hd: false }),
  },
  {
    id: 'breast-cancer-awareness',
    category: 'Documentary',
    tag: '2026 · Awareness',
    title: 'Breast Cancer — Awareness Film',
    sub: 'Awareness Campaign',
    desc: 'A powerful awareness campaign film about breast cancer — stories that matter, told with care.',
    orientation: 'landscape',
    duration: 159,
    ...assets('breast-cancer-awareness'),
  },
  // ── Wedding Films ─────────────────────────────────────────
  {
    id: 'kudsiya-bridal',
    category: 'Wedding Films',
    tag: '2026 · Bridal Film',
    title: 'Kudsiya — Bridal Film',
    sub: 'Cinematic Bridal Shoot',
    desc: 'A cinematic tribute to tradition and elegance — bridal dress shoot capturing grace, detail, and emotion.',
    orientation: 'landscape',
    duration: 120,
    ...assets('kudsiya-bridal'),
  },
  // TODO: confirm title and year with Ali
  {
    id: 'bushra-hussain-wedding',
    category: 'Wedding Films',
    tag: '2026 · Couple Shoot',
    title: 'Bushra & Hussain — Wedding Film',
    sub: 'Cinematic Couple Shoot',
    desc: 'A cinematic couple shoot set against open hills — a sweeping red lehenga, quiet glances, and golden light.',
    orientation: 'landscape',
    duration: 75,
    ...assets('bushra-hussain-wedding'),
  },
]

export const categoryOrder = [
  'Touchstone Communications',
  'Clothing Brand',
  'Khais',
  'Commercial',
  'Real Estate',
  'Short-form / Podcast',
  'Events',
  'Documentary',
  'Wedding Films',
]

export const showreel = {
  // Plays the Premier League film until Ali sends a dedicated 60–90s reel.
  videoId: 'premier-league-highlights',
  hud: { left: 'Ali Hassan', leftSub: 'Rawalpindi, Pakistan', right: 'Remote Editing', rightSub: 'Available Worldwide' },
  title: 'A year, in motion.',
  meta: 'Selected Works · 2025–2026',
}

// Poster <img> attributes. The size suffix is the long side, so portrait posters
// are 360w / 720w and landscape posters are 640w / 1280w.
export const posterAttrs = (video) => {
  const small = cdn(`${video.poster}-640.webp`)
  const large = cdn(`${video.poster}-1280.webp`)
  const portrait = video.orientation === 'portrait'
  const [w1, w2] = portrait ? [360, 720] : [640, 1280]
  return {
    src: small,
    large,
    srcset: `${small} ${w1}w, ${large} ${w2}w`,
    width: w1,
    height: portrait ? 640 : 360,
  }
}

// Chooses 720p for small/dense screens, slow connections and data saver; otherwise 1080p.
export const pickSource = (video) => {
  const conn = navigator.connection
  const slow = conn?.saveData || ['slow-2g', '2g', '3g'].includes(conn?.effectiveType)
  const small = window.innerWidth * window.devicePixelRatio <= 1440
  return cdn(slow || small ? video.src[720] : (video.src[1080] ?? video.src[720]))
}

export const formatDuration = (s) => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`
