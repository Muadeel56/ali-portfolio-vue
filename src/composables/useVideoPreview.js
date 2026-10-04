import { ref, onMounted, onUnmounted } from 'vue'

// Shared across every caller so only one preview can play at a time.
export const activePreviewId = ref(null)

// Set by useVideoPreview() on mount; read by the hover handlers below.
let enabled = false
let canHover = false

const MIN_RATIO = 0.6

// Aborts a <video>'s download when it leaves the DOM. Removing the element alone
// can leave the request running in some browsers.
export const vReleaseMedia = {
  beforeUnmount(el) {
    el.pause()
    el.removeAttribute('src')
    el.load()
  },
}

export function stopPreview() {
  activePreviewId.value = null
}

// Hover handlers for individual cards (desktop only; touch uses the observer).
export function previewEnter(slug) {
  if (enabled && canHover) activePreviewId.value = slug
}

export function previewLeave(slug) {
  if (canHover && activePreviewId.value === slug) activePreviewId.value = null
}

// Hover-to-preview on desktop; on touch devices the single card most in view previews.
// Cards matched by `selector` must carry a `data-slug` attribute. Pass `null` for hover-only
// previews (touch devices then show posters only).
// Previews are disabled entirely for data saver and reduced motion.
export function useVideoPreview(selector) {
  let observer
  const ratios = new Map()

  const pickMostVisible = () => {
    let bestSlug = null
    let bestRatio = MIN_RATIO
    for (const [slug, ratio] of ratios) {
      if (ratio >= bestRatio) {
        bestSlug = slug
        bestRatio = ratio
      }
    }
    activePreviewId.value = bestSlug
  }

  onMounted(() => {
    const saveData = navigator.connection?.saveData
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
    enabled = !saveData && !reducedMotion
    canHover = false
    if (!enabled) return

    canHover = matchMedia('(hover: hover) and (pointer: fine)').matches
    if (canHover || !selector) return

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target.dataset.slug, entry.isIntersecting ? entry.intersectionRatio : 0)
        })
        pickMostVisible()
      },
      { threshold: [0, 0.25, 0.5, 0.6, 0.75, 0.9, 1] },
    )
    document.querySelectorAll(selector).forEach((el) => observer.observe(el))
  })

  onUnmounted(() => {
    observer?.disconnect()
    activePreviewId.value = null
  })

  // Re-scan for cards after the page swaps its content.
  const refresh = () => {
    if (!observer) return
    observer.disconnect()
    ratios.clear()
    document.querySelectorAll(selector).forEach((el) => observer.observe(el))
  }

  return { activePreviewId, onEnter: previewEnter, onLeave: previewLeave, refresh }
}
