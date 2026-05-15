<script setup>
import { RouterView } from 'vue-router'
import AppNavbar from './components/layout/AppNavbar.vue'
import AppMobileNav from './components/layout/AppMobileNav.vue'
</script>

<template>
  <AppNavbar />
  <AppMobileNav />
  <RouterView />
</template>
