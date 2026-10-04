<script setup>
import { RouterView } from 'vue-router'
import { cutting, onLeave, endCut } from '@/composables/useRouteTransition.js'
import AppNavbar from './components/layout/AppNavbar.vue'
import AppMobileNav from './components/layout/AppMobileNav.vue'
import AppFooter from './components/layout/AppFooter.vue'
</script>

<template>
  <AppNavbar />
  <AppMobileNav />
  <!-- Routes are lazy: render the footer only once the page exists, or it paints first and then jumps (CLS). -->
  <RouterView v-slot="{ Component, route }">
    <!-- The black "cut": see useRouteTransition.js. The footer stays outside so it doesn't flash. -->
    <Transition :css="false" mode="out-in" @leave="onLeave" @after-enter="endCut">
      <component :is="Component" v-if="Component" :key="route.path" />
    </Transition>
    <AppFooter v-if="Component" />
  </RouterView>
  <div class="route-cut" :class="{ 'route-cut--on': cutting }" aria-hidden="true" />
</template>
