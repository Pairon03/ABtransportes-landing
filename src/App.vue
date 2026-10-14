<script setup>
import TheHeader from './components/TheHeader.vue'
import HeroCinema from './components/HeroCinema.vue'
import MarqueeBand from './components/MarqueeBand.vue'
import ScrollStory from './components/ScrollStory.vue'
import FleetPanels from './components/FleetPanels.vue'
import QuoteWizard from './components/QuoteWizard.vue'
import FinalCta from './components/FinalCta.vue'
import TheFooter from './components/TheFooter.vue'
import WhatsAppFloat from './components/WhatsAppFloat.vue'
</script>

<template>
  <a class="skip" href="#conteudo">Pular para o conteúdo</a>
  <TheHeader />
  <main id="conteudo">
    <HeroCinema />
    <MarqueeBand />
    <ScrollStory />
    <FleetPanels />
    <QuoteWizard />
    <FinalCta />
  </main>
  <TheFooter />
  <WhatsAppFloat />
</template>
