<template>
  <section class="wrap-x section">
    <div class="container transparency">
      <span class="eyebrow transparency__label">Transparência</span>
      <div class="transparency__body">
        <h2 class="display-l">Transporte com mais visibilidade <em>e tranquilidade.</em></h2>
        <div class="transparency__cols">
          <p class="body body--lg">
            Na Ponta a Ponta Brasil Express, você tem mais informações sobre o trajeto e registros
            do seu material durante a operação.
          </p>
          <p class="body body--lg body--ink">
            Sua necessidade é nossa prioridade. Vamos encontrar a melhor solução para sua entrega.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.transparency { display: flex; flex-wrap: wrap; gap: 48px 96px; align-items: flex-start; }
.transparency__label { flex: 0 0 auto; letter-spacing: 5px; padding-top: 18px; }
.transparency__body { flex: 999 1 600px; min-width: 0; display: flex; flex-direction: column; gap: 36px; }
.transparency__body h2 { font-size: clamp(40px, 4.6vw, 72px); }
.transparency__cols { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 32px 56px; }
.body--lg { font-size: 17px; line-height: 1.8; }
.body--ink { color: var(--ink); font-weight: 400; }
</style>
