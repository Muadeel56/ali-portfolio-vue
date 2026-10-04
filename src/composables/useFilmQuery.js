import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { findVideo } from '@/data/videos.js'

// The /work player modal driven by ?film=<slug>, so any film can be shared as a link.
// Every change uses router.replace, so opening and switching films never fills the history.
// Bind with <VideoPlayerModal v-model:open="open" v-model:video="video" />.
export function useFilmQuery() {
  const route = useRoute()
  const router = useRouter()

  const setFilm = (slug) => {
    const query = { ...route.query }
    if (slug) query.film = slug
    else delete query.film
    router.replace({ query, hash: route.hash })
  }

  const current = computed(() => findVideo(route.query.film))

  // An unknown slug is dropped from the URL without an error.
  watch(
    () => route.query.film,
    (slug) => {
      if (slug && !findVideo(slug)) setFilm(null)
    },
    { immediate: true },
  )

  const open = computed({
    get: () => Boolean(current.value),
    set: (value) => {
      if (!value) setFilm(null)
    },
  })

  const video = computed({
    get: () => current.value,
    set: (value) => setFilm(value?.slug ?? null),
  })

  return { open, video, openFilm: (film) => setFilm(film.slug) }
}
