<script setup>
import { ref, watch, nextTick, onUnmounted } from 'vue'
import { vReleaseMedia } from '@/composables/useVideoPreview.js'
import { cdn } from '@/data/videos.js'
import Rule from './Rule.vue'

// Shell only: full player controls arrive in Phase 4.
const open = defineModel('open', { type: Boolean, default: false })

defineProps({
  video: {
    type: Object,
    default: null,
  },
})

const closeRef = ref(null)
let returnFocusTo = null

const close = () => {
  open.value = false
}

const onKeydown = (e) => {
  if (e.key === 'Escape') close()
}

watch(open, (isOpen) => {
  if (isOpen) {
    returnFocusTo = document.activeElement
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeydown)
    nextTick(() => closeRef.value?.focus())
  } else {
    document.body.style.overflow = ''
    window.removeEventListener('keydown', onKeydown)
    returnFocusTo?.focus?.()
    returnFocusTo = null
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open && video"
        class="player-modal"
        role="dialog"
        aria-modal="true"
        :aria-label="video.title"
      >
        <div class="player-modal__bar">
          <p class="player-modal__title">{{ video.title }}</p>
          <button ref="closeRef" type="button" class="player-modal__close" @click="close">
            Close <span aria-hidden="true">✕</span>
          </button>
        </div>
        <Rule />

        <div class="player-modal__stage">
          <video
            :key="video.id"
            v-release-media
            class="player-modal__video"
            :class="{ 'player-modal__video--portrait': video.orientation === 'portrait' }"
            :src="cdn(video.src[1080] ?? video.src[720])"
            controls
            autoplay
            playsinline
          />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.player-modal {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  flex-direction: column;
  background: var(--bg);
}

.player-modal__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-04);
  padding: var(--space-04) var(--gutter);
}

.player-modal__title {
  font-family: var(--mono);
  font-size: var(--fs-caption);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.player-modal__close {
  font-family: var(--mono);
  font-size: var(--fs-label);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--gold);
  background: none;
  border: 1px solid var(--rule);
  border-radius: 0;
  padding: var(--space-02) var(--space-04);
  cursor: pointer;
  transition: border-color var(--dur-fast) var(--ease-out-expo);
}

.player-modal__close:hover,
.player-modal__close:focus-visible {
  border-color: var(--gold);
  outline: none;
}

.player-modal__stage {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--gutter);
}

.player-modal__video {
  width: 100%;
  max-height: 100%;
  aspect-ratio: 16 / 9;
  background: var(--surface);
}

.player-modal__video--portrait {
  width: auto;
  height: 100%;
  aspect-ratio: 9 / 16;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity var(--dur-base) var(--ease-out-expo);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
