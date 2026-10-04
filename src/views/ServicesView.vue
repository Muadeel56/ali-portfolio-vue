<script setup>
import { services } from '@/data/services.js'
import PageHero from '../components/ui/PageHero.vue'
import ServicesSection from '../components/sections/ServicesSection.vue'
import ProcessSteps from '../components/home/ProcessSteps.vue'
import CtaBlock from '../components/ui/CtaBlock.vue'
</script>

<template>
  <main class="page-main">
    <PageHero
      eyebrow="Services"
      title="From raw footage to final master"
      accent="final master"
      intro="Editing, grading and finishing — from wedding films to brand work and short-form, delivered remotely to clients worldwide."
      :meta="[`${String(services.length).padStart(2, '0')} services`, 'Remote delivery', 'Quote within 24h']"
    />
    <ServicesSection number="01" total="02" />
    <ProcessSteps number="02" total="02" />
    <CtaBlock
      title="Have a unique project in mind?"
      accent="unique"
      label="Let's Talk"
      caption="Custom packages · Tailored quote within 24h"
    />
  </main>
</template>
