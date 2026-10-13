<script setup>
import TheHeader from './components/TheHeader.vue'
import HeroRoute from './components/HeroRoute.vue'
import ManifestoSection from './components/ManifestoSection.vue'
import ServicePillars from './components/ServicePillars.vue'
import ProcessSteps from './components/ProcessSteps.vue'
import TransparencySection from './components/TransparencySection.vue'
import QuoteConcierge from './components/QuoteConcierge.vue'
import FinalCta from './components/FinalCta.vue'
import TheFooter from './components/TheFooter.vue'
</script>

<template>
  <a class="skip" href="#conteudo">Pular para o conteúdo</a>
  <TheHeader />
  <main id="conteudo">
    <HeroRoute />
    <ManifestoSection />
    <ServicePillars />
    <ProcessSteps />
    <TransparencySection />
    <QuoteConcierge />
    <FinalCta />
  </main>
  <TheFooter />
</template>
