<script setup>
import { ref } from 'vue'
import { useVideoPreview, stopPreview } from '@/composables/useVideoPreview.js'
import { featuredVideos } from '@/data/videos.js'
import SectionHeader from '../ui/SectionHeader.vue'
import VideoCard from '../ui/VideoCard.vue'
import VideoPlayerModal from '../ui/VideoPlayerModal.vue'
import AppButton from '../ui/AppButton.vue'

defineProps({
  number: { type: String, required: true },
  total: { type: String, required: true },
})

useVideoPreview('.featured-films .video-card[data-id]')

const modalOpen = ref(false)
const modalVideo = ref(null)

const openVideo = (video) => {
  stopPreview()
  modalVideo.value = video
  modalOpen.value = true
}

const sizes = ['(max-width: 899px) 100vw, 66vw', '(max-width: 899px) 100vw, 33vw', '(max-width: 899px) 100vw, 33vw']
</script>

<template>
  <section class="section featured-films" aria-labelledby="featured-title">
    <div class="container">
      <SectionHeader
        title-id="featured-title"
        :number="number"
        :total="total"
        eyebrow="Featured"
        title="Selected films"
        accent="films"
        intro="Three pieces that show the range: brand, bridal and documentary storytelling."
      />

      <div class="featured-films__grid grid-12">
        <VideoCard
          v-for="(video, i) in featuredVideos"
          :key="video.id"
          class="featured-films__item"
          :class="`featured-films__item--${i}`"
          :video="video"
          aspect="16:9"
          :sizes="sizes[i]"
          @play="openVideo"
        />
      </div>

      <div class="featured-films__more">
        <AppButton variant="ghost" to="/work" show-arrow>All work</AppButton>
      </div>
    </div>

    <VideoPlayerModal v-model:open="modalOpen" :video="modalVideo" />
  </section>
</template>

<style scoped>
.featured-films__grid {
  row-gap: var(--space-07);
}

.featured-films__more {
  margin-top: var(--space-08);
}

/* Desktop: one large piece (8 cols) beside two stacked pieces (4 cols), offset downwards */
@media (min-width: 900px) {
  .featured-films__item--0 {
    grid-column: 1 / 9;
    grid-row: 1 / 3;
  }

  .featured-films__item--1 {
    grid-column: 9 / 13;
    grid-row: 1;
    margin-top: var(--space-09);
  }

  .featured-films__item--2 {
    grid-column: 9 / 13;
    grid-row: 2;
  }
}
</style>
