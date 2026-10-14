<script setup>
import { waLink } from '../config'
import AppIcon from './AppIcon.vue'
import RouteAnimation from './RouteAnimation.vue'
</script>

<template>
  <section id="topo" class="hero wrap">
    <div class="container hero__grid">
      <div class="hero__copy">
        <p class="hero__kicker">
          <AppIcon name="moto" :size="20" /><AppIcon name="car" :size="20" /><AppIcon name="truck" :size="20" />
          Precisou transportar? A gente resolve.
        </p>
        <h1 class="h-xl">Do ponto A ao ponto B, com rapidez e segurança.</h1>
        <p class="lead">
          Coleta e entrega para empresas e pessoas que precisam de agilidade, compromisso
          e acompanhamento em cada etapa do transporte.
        </p>
        <div class="hero__actions">
          <a class="btn btn--orange" href="#orcamento">Pedir orçamento</a>
          <a class="btn btn--ghost" :href="waLink()" target="_blank" rel="noopener">
            <AppIcon name="chat" :size="20" /> Falar no WhatsApp
          </a>
        </div>
      </div>

      <RouteAnimation class="hero__visual" />
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding-top: clamp(28px, 5vw, 64px);
  padding-bottom: var(--section);
  background:
    radial-gradient(1200px 520px at 85% -10%, var(--sky-2), transparent 70%),
    linear-gradient(var(--sky), var(--paper));
}
.hero__grid { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); gap: clamp(32px, 5vw, 72px); align-items: center; }
.hero__copy { display: flex; flex-direction: column; gap: 26px; }
.hero__kicker {
  align-self: flex-start; display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 16px 8px 12px; border-radius: 999px; background: #fff;
  box-shadow: inset 0 0 0 1.5px var(--line); color: var(--cobalt); font-weight: 650; font-size: 15px;
}
.hero__kicker :deep(svg:last-of-type) { margin-right: 4px; }
.hero__actions { display: flex; flex-wrap: wrap; gap: 14px; }

@media (max-width: 960px) {
  .hero__grid { grid-template-columns: 1fr; }
}
</style>
