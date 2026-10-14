<script setup>
import { PHONE_LABEL, waLink } from '../config'
import AppIcon from './AppIcon.vue'
</script>

<template>
  <section class="cta wrap">
    <div class="container cta__card">
      <div class="cta__copy">
        <h2 class="h-lg">Sua necessidade é nossa prioridade.</h2>
        <p class="cta__text">Fale agora com a nossa equipe e vamos encontrar a melhor solução para a sua entrega.</p>
      </div>
      <div class="cta__action">
        <a class="cta__phone" :href="waLink()" target="_blank" rel="noopener">{{ PHONE_LABEL }}</a>
        <a class="btn btn--ink" :href="waLink()" target="_blank" rel="noopener">
          <AppIcon name="chat" :size="20" /> Chamar no WhatsApp
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta { padding-top: var(--section); padding-bottom: var(--section); }
.cta__card {
  display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); gap: 32px 56px; align-items: center;
  background: var(--orange); color: var(--ink); border-radius: var(--r-lg);
  padding: clamp(32px, 5vw, 72px);
  background-image: radial-gradient(circle at 100% 0%, #FF8A45 0, transparent 55%);
}
.cta__copy { display: grid; gap: 16px; }
.cta__text { font-size: 19px; line-height: 1.55; max-width: 30em; }
.cta__action { display: flex; flex-direction: column; align-items: flex-start; gap: 18px; }
.cta__phone { font-size: clamp(36px, 4.6vw, 60px); font-weight: 800; letter-spacing: -0.03em; line-height: 1; color: var(--ink); text-decoration: none; }
.cta__phone:hover { text-decoration: underline; text-decoration-thickness: 3px; text-underline-offset: 6px; }

@media (max-width: 860px) {
  .cta__card { grid-template-columns: 1fr; }
}
</style>
