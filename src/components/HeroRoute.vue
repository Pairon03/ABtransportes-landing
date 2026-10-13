<script setup>
import ArrowIcon from './ArrowIcon.vue'

const legs = ['Coleta · foto', 'Tempo real · até 8h', 'Entrega · foto']
</script>

<template>
  <section id="topo" class="wrap-x hero">
    <div class="container hero__inner">
      <div class="hero__meta">
        <span>Coleta &amp; entrega</span>
        <span>Moto · Carro · Caminhão</span>
      </div>

      <div class="route">
        <span class="route__letter" aria-hidden="true">A</span>
        <div class="route__track">
          <div class="route__line" aria-hidden="true">
            <span class="route__rule"></span>
            <span class="route__dot"></span>
          </div>
          <div class="route__labels">
            <span v-for="leg in legs" :key="leg">{{ leg }}</span>
          </div>
        </div>
        <span class="route__letter route__letter--b" aria-hidden="true">B</span>
      </div>

      <div class="hero__bottom">
        <h1 class="display-l">
          Sua entrega, do ponto A ao ponto B, com rapidez, segurança <em>e confiança.</em>
        </h1>
        <div class="hero__side">
          <p class="body">
            Soluções de coleta e entrega para empresas e pessoas que precisam de agilidade,
            compromisso e acompanhamento em cada etapa do transporte.
          </p>
          <a class="btn btn--ink" href="#concierge">Solicitar orçamento <ArrowIcon /></a>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero { padding-top: clamp(56px, 8vw, 112px); padding-bottom: clamp(64px, 8vw, 120px); }
.hero__inner { display: flex; flex-direction: column; gap: clamp(32px, 4vw, 56px); }
.hero__meta {
  display: flex; justify-content: space-between; gap: 16px;
  font-size: 11px; font-weight: 500; letter-spacing: 4px; text-transform: uppercase; color: var(--muted);
}
.route { display: flex; align-items: center; gap: clamp(12px, 2vw, 32px); }
.route__letter {
  font-family: var(--serif); font-weight: 300; font-size: clamp(120px, 22vw, 340px);
  line-height: 0.78; letter-spacing: -6px;
}
.route__letter--b { font-style: italic; color: var(--wine); }
.route__track { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 18px; }
.route__line { position: relative; height: 9px; }
.route__rule { position: absolute; left: 0; right: 0; top: 4px; height: 1px; background: var(--ink); }
.route__dot {
  position: absolute; top: 0; left: 0; width: 9px; height: 9px; margin-left: -4px;
  border-radius: 50%; background: var(--wine);
  animation: rota 6s cubic-bezier(.65, 0, .35, 1) infinite;
}
@keyframes rota {
  0% { left: 0%; opacity: 0 }
  8% { opacity: 1 }
  92% { opacity: 1 }
  100% { left: 100%; opacity: 0 }
}
.route__labels {
  display: flex; justify-content: space-between; gap: 12px;
  font-size: 11px; font-weight: 500; letter-spacing: 3px; text-transform: uppercase; color: var(--muted);
}
.route__labels span:nth-child(2) { text-align: center; }
.route__labels span:nth-child(3) { text-align: right; }
.hero__bottom {
  display: flex; flex-wrap: wrap; gap: 40px 80px; align-items: flex-end; justify-content: space-between;
  border-top: 1px solid var(--line); padding-top: clamp(32px, 4vw, 48px);
}
.hero__bottom h1 { flex: 999 1 560px; min-width: 0; }
.hero__side { flex: 1 1 320px; min-width: 0; display: flex; flex-direction: column; align-items: flex-start; gap: 28px; }
.hero__side .body { font-size: 17px; }

@media (max-width: 720px) {
  .route__labels { font-size: 9px; letter-spacing: 1.5px; }
  .route__letter { letter-spacing: -3px; }
}
@media (prefers-reduced-motion: reduce) {
  .route__dot { left: 50%; opacity: 1; }
}
</style>
