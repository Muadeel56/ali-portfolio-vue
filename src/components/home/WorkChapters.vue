<script setup>
import { RouterLink } from 'vue-router'
import { activePreviewId, previewEnter, previewLeave, useVideoPreview, vReleaseMedia } from '@/composables/useVideoPreview.js'
import { videos, chapters, findVideo, posterAttrs, cdn } from '@/data/videos.js'
import SectionHeader from '../ui/SectionHeader.vue'
import Rule from '../ui/Rule.vue'

defineProps({
  number: { type: String, required: true },
  total: { type: String, required: true },
})

// Hover/focus previews only: on touch devices the rows show their poster.
useVideoPreview(null)

// Namespaced so a chapter preview never starts a VideoCard that shares the same video.
const previewKey = (chapter) => `chapter:${chapter.id}`

const rows = chapters.map((chapter) => {
  const video = findVideo(chapter.previewVideoId)
  return {
    ...chapter,
    video,
    poster: posterAttrs(video),
    count: videos.filter((v) => chapter.categories.includes(v.category)).length,
  }
})
</script>

<template>
  <section class="section work-chapters" aria-labelledby="chapters-title">
    <div class="container">
      <SectionHeader
        title-id="chapters-title"
        :number="number"
        :total="total"
        eyebrow="Range"
        title="Five chapters of work"
        accent="chapters"
        intro="From weddings to brand campaigns, documentaries, social cuts and live events."
      />

      <ol class="work-chapters__list">
        <li v-for="row in rows" :key="row.id">
          <RouterLink
            :to="{ path: '/work', hash: `#${row.id}` }"
            class="work-chapters__row"
            @mouseenter="previewEnter(previewKey(row))"
            @mouseleave="previewLeave(previewKey(row))"
            @focus="previewEnter(previewKey(row))"
            @blur="previewLeave(previewKey(row))"
          >
            <span class="work-chapters__num">{{ row.number }}</span>
            <span class="work-chapters__body">
              <span class="work-chapters__title t-display-h3">{{ row.title }}</span>
              <span class="work-chapters__meta">{{ String(row.count).padStart(2, '0') }} films</span>
            </span>
            <span class="work-chapters__thumb" aria-hidden="true">
              <img
                class="work-chapters__media"
                :src="row.poster.src"
                :width="row.poster.width"
                :height="row.poster.height"
                loading="lazy"
                decoding="async"
                alt=""
              />
              <video
                v-if="activePreviewId === previewKey(row)"
                v-release-media
                class="work-chapters__media"
                :src="cdn(row.video.preview)"
                autoplay
                muted
                loop
                playsinline
                preload="none"
                @contextmenu.prevent
              />
            </span>
            <span class="work-chapters__arrow" aria-hidden="true">→</span>
          </RouterLink>
          <Rule />
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.work-chapters__list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.work-chapters__row {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--space-04);
  padding-block: var(--space-05);
  color: inherit;
  text-decoration: none;
}

.work-chapters__num {
  font-family: var(--mono);
  font-size: var(--fs-label);
  letter-spacing: 0.2em;
  color: var(--muted);
  transition: color var(--dur-fast) var(--ease-out-expo);
}

.work-chapters__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-02);
  min-width: 0;
}

.work-chapters__title {
  display: block;
  transition: color var(--dur-base) var(--ease-out-expo);
}

.work-chapters__meta {
  font-family: var(--mono);
  font-size: var(--fs-caption);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
}

.work-chapters__thumb {
  position: relative;
  display: block;
  width: calc(var(--space-10) - var(--space-04));
  aspect-ratio: 16 / 9;
  background: var(--surface-2);
  overflow: hidden;
}

.work-chapters__media {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.work-chapters__arrow {
  display: none;
  color: var(--gold);
}

.work-chapters__row:hover .work-chapters__num,
.work-chapters__row:focus-visible .work-chapters__num,
.work-chapters__row:hover .work-chapters__title,
.work-chapters__row:focus-visible .work-chapters__title {
  color: var(--gold);
}

@media (min-width: 900px) {
  .work-chapters__row {
    grid-template-columns: var(--space-09) 1fr auto auto;
    gap: var(--space-06);
    padding-block: var(--space-06);
  }

  .work-chapters__body {
    flex-direction: row;
    align-items: baseline;
    gap: var(--space-06);
  }

  .work-chapters__thumb {
    width: calc(var(--space-11) + var(--space-09));
  }

  .work-chapters__arrow {
    display: block;
  }
}
</style>
