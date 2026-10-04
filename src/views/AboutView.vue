<script setup>
import { site } from '@/data/site.js'
import PageHero from '../components/ui/PageHero.vue'
import AboutSection from '../components/sections/AboutSection.vue'
import StatsRow from '../components/home/StatsRow.vue'
import ProcessSteps from '../components/home/ProcessSteps.vue'
import ClientMarquee from '../components/home/ClientMarquee.vue'
import CtaBlock from '../components/ui/CtaBlock.vue'
</script>

<template>
  <main class="page-main">
    <PageHero
      eyebrow="About"
      :title="`${site.name}, editor & videographer`"
      :accent="site.name"
      intro="Films cut and graded in Rawalpindi for couples, brands and storytellers worldwide."
      :meta="[site.location, site.reach, site.availability]"
    />
    <AboutSection number="01" total="02" />
    <StatsRow />
    <ProcessSteps number="02" total="02" />
    <ClientMarquee />
    <CtaBlock caption="Reply within 24h · Remote worldwide" />
  </main>
</template>
