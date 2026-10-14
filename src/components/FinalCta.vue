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
  position: relative; overflow: hidden;
  display: grid; grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr); gap: 32px 56px; align-items: center;
  background: var(--orange); color: #fff; border-radius: var(--r-lg);
  padding: clamp(32px, 5vw, 72px);
  background-image: radial-gradient(circle at 100% 0%, #F23A40 0, transparent 55%);
}
/* faixa de pista correndo no rodapé do cartão */
.cta__card::after {
  content: ''; position: absolute; left: 0; right: 0; bottom: 22px; height: 5px;
  background-image: linear-gradient(90deg, rgba(255,255,255,.35) 55%, transparent 0);
  background-size: 70px 5px; animation: road 1.6s linear infinite;
}
@keyframes road { to { background-position: -70px 0; } }
.cta__copy { display: grid; gap: 16px; }
.cta__text { font-size: 19px; line-height: 1.55; max-width: 30em; }
.cta__action { display: flex; flex-direction: column; align-items: flex-start; gap: 18px; }
.cta__phone { white-space: nowrap; font-size: clamp(32px, 4vw, 54px); font-weight: 800; letter-spacing: -0.03em; line-height: 1; color: #fff; text-decoration: none; }
.cta__phone:hover { text-decoration: underline; text-decoration-thickness: 3px; text-underline-offset: 6px; }

@media (max-width: 860px) {
  .cta__card { grid-template-columns: 1fr; }
}
</style>
