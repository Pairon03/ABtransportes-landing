<script setup>
import AppIcon from './AppIcon.vue'
</script>

<template>
  <section class="band wrap">
    <div class="container band__inner">
      <h2 class="h-lg">Transporte com mais visibilidade e tranquilidade.</h2>
      <div class="band__body">
        <p>
          Na Ponta a Ponta Brasil Express, você tem mais informações sobre o trajeto e
          registros do seu material durante a operação.
        </p>
        <p class="band__promise">
          <AppIcon name="shield" :size="26" />
          <span>
            <strong>Compromisso do início ao fim.</strong>
            Cuidamos do seu material com responsabilidade, mantendo você informado.
          </span>
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.band { background: var(--cobalt); color: #fff; padding-top: clamp(64px, 8vw, 112px); padding-bottom: clamp(64px, 8vw, 112px); position: relative; overflow: hidden; }
.band::after {
  /* faixa de pista no fundo, só textura */
  content: ''; position: absolute; left: -10%; right: -10%; bottom: 36px; height: 6px;
  background-image: linear-gradient(90deg, rgba(255, 255, 255, .22) 55%, transparent 0);
  background-size: 64px 6px;
  animation: road 2.4s linear infinite;
}
@keyframes road { to { background-position: -64px 0; } }
.band__inner { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); gap: 32px 72px; align-items: end; position: relative; z-index: 1; }
.band__body { display: grid; gap: 22px; font-size: 19px; line-height: 1.6; color: #DCE6FF; }
.band__promise { display: flex; gap: 14px; align-items: flex-start; padding: 18px 20px; border-radius: var(--r-md); background: rgba(255, 255, 255, .12); color: #fff; font-size: 17px; }
.band__promise strong { display: block; font-weight: 750; }
.band__promise :deep(svg) { color: var(--sun); flex: none; margin-top: 2px; }

@media (max-width: 860px) {
  .band__inner { grid-template-columns: 1fr; }
}
</style>
