<script setup>
import { EMAIL, PHONE_LABEL, waLink } from '../config'
import AppIcon from './AppIcon.vue'
import BrandedImg from './BrandedImg.vue'
</script>

<template>
  <section class="cta section wrap">
    <div class="container cta__grid">
      <div class="cta__copy">
        <h2 class="display h-lg">Sua necessidade é nossa prioridade.</h2>
        <p class="lead">Fale agora com a nossa equipe e vamos encontrar a melhor solução para a sua entrega.</p>
        <a class="cta__phone num" :href="waLink()" target="_blank" rel="noopener">{{ PHONE_LABEL }}</a>
        <div class="cta__actions">
          <a class="btn btn--red" :href="waLink()" target="_blank" rel="noopener">
            <AppIcon name="chat" :size="22" /> Chamar no WhatsApp
          </a>
          <a class="btn btn--ghost" href="#orcamento">Pedir orçamento</a>
        </div>
        <p class="cta__mail">Prefere e-mail? <a :href="`mailto:${EMAIL}`">{{ EMAIL }}</a></p>
      </div>
      <figure class="cta__photo">
        <BrandedImg path="img/v3/traseira.webp" alt="Traseira do caminhão da AB com a logo nas portas, lanternas acesas na doca" width="1376" height="768" loading="lazy" />
      </figure>
    </div>
  </section>
</template>

<style scoped>
.cta { background: linear-gradient(180deg, var(--asfalto) 0%, var(--noite) 100%); }
.cta__grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); gap: clamp(32px, 5vw, 80px); align-items: center; }
.cta__copy { display: flex; flex-direction: column; gap: 22px; align-items: flex-start; }
.cta__phone {
  font-family: var(--font-display); font-weight: 800; font-style: italic;
  font-size: clamp(44px, 5vw, 72px); line-height: 1; color: var(--vermelho-claro); text-decoration: none;
}
.cta__phone:hover { text-decoration: underline; text-decoration-thickness: 3px; text-underline-offset: 8px; }
.cta__actions { display: flex; flex-wrap: wrap; gap: 14px; }
.cta__mail { color: var(--tinta-3); font-size: 16px; overflow-wrap: anywhere; }
.cta__mail a { color: var(--tinta); font-weight: 600; }
.cta__photo { position: relative; border-radius: 18px; overflow: hidden; aspect-ratio: 4 / 3.1; background: #0E0F11; box-shadow: 0 50px 100px -50px rgba(227, 20, 27, .45); }
.cta__photo :deep(img) { width: 100%; height: 100%; object-fit: cover; object-position: 50% 42%; }

@media (max-width: 900px) {
  .cta__grid { grid-template-columns: 1fr; }
  .cta__photo { order: -1; }
}
@media (max-width: 460px) {
  .cta__actions .btn { flex: 1 1 100%; }
}
</style>
