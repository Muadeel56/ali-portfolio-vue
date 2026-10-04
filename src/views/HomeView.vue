<script setup>
import { testimonials } from '@/data/testimonials.js'
import HomeHero from '../components/home/HomeHero.vue'
import ClientMarquee from '../components/home/ClientMarquee.vue'
import StatsRow from '../components/home/StatsRow.vue'
import FeaturedFilms from '../components/home/FeaturedFilms.vue'
import WorkChapters from '../components/home/WorkChapters.vue'
import GradeCompare from '../components/home/GradeCompare.vue'
import ServicesList from '../components/home/ServicesList.vue'
import ProcessSteps from '../components/home/ProcessSteps.vue'
import Testimonials from '../components/home/Testimonials.vue'
import CtaBlock from '../components/ui/CtaBlock.vue'

// Numbered sections (01 / 06); the testimonials section hides itself until there are quotes.
const total = testimonials.length ? '06' : '05'
</script>

<template>
  <main class="page-main">
    <HomeHero />
    <ClientMarquee />
    <StatsRow />
    <FeaturedFilms number="01" :total="total" />
    <WorkChapters number="02" :total="total" />
    <GradeCompare number="03" :total="total" />
    <ServicesList number="04" :total="total" />
    <ProcessSteps number="05" :total="total" />
    <Testimonials number="06" :total="total" />
    <CtaBlock
      title="Have footage? Let's cut something worth watching."
      accent="worth watching"
      label="Start a Project"
      caption="Reply within 24h · Remote worldwide"
    />
  </main>
</template>
