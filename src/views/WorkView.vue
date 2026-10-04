<script setup>
import { onMounted, onUnmounted } from 'vue'
import { chapters, chapterFilms, cdn, toIsoDuration, uploadDate } from '@/data/videos.js'
import { SITE_URL } from '@/router/seo.js'
import WorkSection from '../components/sections/WorkSection.vue'
import CtaBlock from '../components/ui/CtaBlock.vue'

// VideoObject structured data for every film shown on /work (removed when leaving the page)
let ldScript

onMounted(() => {
  const films = chapters.flatMap(chapterFilms)
  ldScript = document.createElement('script')
  ldScript.type = 'application/ld+json'
  ldScript.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': films.map((film) => ({
      '@type': 'VideoObject',
      name: film.title,
      description: film.desc,
      thumbnailUrl: cdn(`${film.poster}-1280.webp`),
      contentUrl: cdn(film.src[1080] ?? film.src[720]),
      url: `${SITE_URL}/work?film=${film.slug}`,
      duration: toIsoDuration(film.duration),
      uploadDate: uploadDate(film),
    })),
  })
  document.head.appendChild(ldScript)
})

onUnmounted(() => ldScript?.remove())
</script>

<template>
  <main class="page-main">
    <WorkSection />
    <CtaBlock caption="Reply within 24h · Remote worldwide" />
  </main>
</template>
