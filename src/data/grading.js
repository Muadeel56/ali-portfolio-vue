// Before/after colour grading pairs for the home page slider.
// `before` / `after` are CDN image bases: `<base>-640.webp` and `<base>-1280.webp` must exist
// (same naming as the video posters from scripts/encode-videos.sh). Both frames must be 16:9.
//
// TODO: from Ali — 1–3 real log/graded frame pairs. Until then the one pair below reuses a
// graded poster for both sides, and `placeholder: true` fakes the flat "log" look with a CSS filter.
export const gradingPairs = [
  {
    id: 'kudsiya-bridal',
    project: 'Kudsiya — Bridal Film',
    before: 'v2/kudsiya-bridal/kudsiya-bridal-poster',
    after: 'v2/kudsiya-bridal/kudsiya-bridal-poster',
    placeholder: true,
  },
]
