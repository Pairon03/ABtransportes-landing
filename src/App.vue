<script setup>
import TheHeader from './components/TheHeader.vue'
import HeroRoute from './components/HeroRoute.vue'
import PhotoProof from './components/PhotoProof.vue'
import HowItWorks from './components/HowItWorks.vue'
import QuoteWizard from './components/QuoteWizard.vue'
import FinalCta from './components/FinalCta.vue'
import TheFooter from './components/TheFooter.vue'
import WhatsAppFloat from './components/WhatsAppFloat.vue'
</script>

<template>
  <a class="skip" href="#conteudo">Pular para o conteúdo</a>
  <TheHeader />
  <main id="conteudo">
    <HeroRoute />
    <PhotoProof />
    <HowItWorks />
    <QuoteWizard />
    <FinalCta />
  </main>
  <TheFooter />
  <WhatsAppFloat />
</template>
