<script setup>
import { site } from '@/data/site.js'
import PageHero from '../components/ui/PageHero.vue'
import ContactSection from '../components/sections/ContactSection.vue'
</script>

<template>
  <main class="page-main">
    <PageHero
      eyebrow="Contact"
      title="Start a project"
      accent="project"
      intro="Every great project starts with a conversation. Whether you have a vision or just a feeling — reach out and let's make it real."
      :meta="['Reply within 24h', site.reach, site.availability]"
    />
    <ContactSection />
  </main>
</template>
