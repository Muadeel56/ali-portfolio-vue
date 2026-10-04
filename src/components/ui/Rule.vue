<script setup>
defineProps({
  gold: {
    type: Boolean,
    default: false,
  },
  vertical: {
    type: Boolean,
    default: false,
  },
  // Any CSS length, e.g. '48px' for a short accent rule. Defaults to the full width/height.
  length: {
    type: String,
    default: '100%',
  },
})
</script>

<template>
  <span
    class="rule"
    :class="{ 'rule--gold': gold, 'rule--vertical': vertical }"
    :style="{ '--rule-length': length }"
    aria-hidden="true"
  />
</template>

<style scoped>
.rule {
  display: block;
  flex-shrink: 0;
  width: var(--rule-length);
  height: 1px;
  background: var(--rule);
}

.rule--vertical {
  width: 1px;
  height: var(--rule-length);
}

.rule--gold {
  background: var(--gold);
}
</style>
