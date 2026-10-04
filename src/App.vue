<script setup>
import { RouterView } from 'vue-router'
import AppNavbar from './components/layout/AppNavbar.vue'
import AppMobileNav from './components/layout/AppMobileNav.vue'
import AppFooter from './components/layout/AppFooter.vue'
</script>

<template>
  <AppNavbar />
  <AppMobileNav />
  <!-- Routes are lazy: render the footer only once the page exists, or it paints first and then jumps (CLS). -->
  <RouterView v-slot="{ Component }">
    <component :is="Component" />
    <AppFooter v-if="Component" />
  </RouterView>
</template>
