<script setup>
import { onMounted } from 'vue'
import TheHeader from './components/TheHeader.vue'
import HeroLive from './components/HeroLive.vue'
import RoadBand from './components/RoadBand.vue'
import JourneyRoute from './components/JourneyRoute.vue'
import FleetConfigurator from './components/FleetConfigurator.vue'
import QuoteWizard from './components/QuoteWizard.vue'
import FinalCta from './components/FinalCta.vue'
import TheFooter from './components/TheFooter.vue'
import WhatsAppFloat from './components/WhatsAppFloat.vue'
import { ScrollTrigger, startSmoothScroll } from './composables/motion'

onMounted(() => {
  startSmoothScroll()
  // fontes e fotos mudam a altura das seções: recalcula as animações de rolagem
  window.addEventListener('load', () => ScrollTrigger.refresh())
  document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh())
})
</script>

<template>
  <a class="skip" href="#conteudo">Pular para o conteúdo</a>
  <TheHeader />
  <main id="conteudo">
    <HeroLive />
    <RoadBand />
    <JourneyRoute />
    <FleetConfigurator />
    <QuoteWizard />
    <FinalCta />
  </main>
  <TheFooter />
  <WhatsAppFloat />
</template>
