<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import AppButton from './AppButton.vue'
import Rule from './Rule.vue'

const props = defineProps({
  title: {
    type: String,
    default: "Let's create something together",
  },
  // Word inside `title` rendered in gold
  accent: {
    type: String,
    default: 'together',
  },
  label: {
    type: String,
    default: 'Get in Touch',
  },
  to: {
    type: String,
    default: '/contact',
  },
  caption: {
    type: String,
    default: '',
  },
})

const router = useRouter()

const titleParts = computed(() => {
  const i = props.accent ? props.title.indexOf(props.accent) : -1
  if (i === -1) return { before: props.title, accent: '', after: '' }
  return {
    before: props.title.slice(0, i),
    accent: props.accent,
    after: props.title.slice(i + props.accent.length),
  }
})
</script>

<template>
  <section class="section cta-block">
    <div class="container">
      <Rule />
      <div class="cta-block__grid grid-12">
        <h2 class="cta-block__title">
          {{ titleParts.before }}<span v-if="titleParts.accent" class="accent">{{ titleParts.accent }}</span>{{ titleParts.after }}
        </h2>
        <div class="cta-block__action">
          <AppButton variant="primary" show-arrow @click="router.push(to)">{{ label }}</AppButton>
          <p v-if="caption" class="cta-block__caption">{{ caption }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta-block {
  padding-block: var(--space-09);
}

.cta-block__grid {
  row-gap: var(--space-06);
  padding-top: var(--space-08);
  align-items: end;
}

.cta-block__title {
  font-family: var(--serif);
  font-weight: 400;
  font-size: var(--fs-h1);
  line-height: 0.95;
  color: var(--text);
  margin: 0;
}

.cta-block__caption {
  font-family: var(--mono);
  font-size: var(--fs-caption);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
  margin: var(--space-04) 0 0;
}

@media (min-width: 900px) {
  .cta-block__title {
    grid-column: 1 / 9;
  }

  .cta-block__action {
    grid-column: 10 / 13;
    justify-self: end;
    text-align: right;
  }
}
</style>
