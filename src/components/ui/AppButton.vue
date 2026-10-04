<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  variant: {
    type: String,
    default: 'outline',
    validator: (v) => ['primary', 'outline', 'ghost'].includes(v),
  },
  type: {
    type: String,
    default: 'button',
  },
  // Internal route: renders a RouterLink
  to: {
    type: [String, Object],
    default: null,
  },
  // External URL: renders an <a>
  href: {
    type: String,
    default: null,
  },
  showArrow: {
    type: Boolean,
    default: false,
  },
})

const tag = computed(() => (props.to ? RouterLink : props.href ? 'a' : 'button'))
const attrs = computed(() => {
  if (props.to) return { to: props.to }
  if (props.href) return { href: props.href }
  return { type: props.type }
})
</script>

<template>
  <component :is="tag" v-bind="attrs" class="btn" :class="`btn-${variant}`">
    <slot />
    <span v-if="showArrow" class="btn__arrow" aria-hidden="true">→</span>
  </component>
</template>
