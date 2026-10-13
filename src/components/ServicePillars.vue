<script setup>
const pillars = [
  { num: 'I.', title: 'Coletas e entregas no mesmo dia', text: 'Conforme disponibilidade e demanda.' },
  { num: 'II.', title: 'Acompanhamento em tempo real', text: 'Por até 8 horas, para você acompanhar o andamento do transporte.' },
  { num: 'III.', title: 'Registro fotográfico', text: 'Na coleta e na entrega, trazendo mais transparência e segurança para sua operação.' },
  { num: 'IV.', title: 'Compromisso do início ao fim', text: 'Cuidamos do seu material com responsabilidade, mantendo você informado durante o processo.' },
]
</script>

<template>
  <section id="servico" class="wrap-x section">
    <div class="container stack-xl">
      <div class="section-head">
        <h2 class="display-xl">O serviço, <em>em quatro compromissos.</em></h2>
        <span class="eyebrow">I — IV</span>
      </div>
      <div class="pillars">
        <article v-for="p in pillars" :key="p.num" class="pillar">
          <span class="pillar__num">{{ p.num }}</span>
          <div class="pillar__body">
            <h3>{{ p.title }}</h3>
            <p class="body">{{ p.text }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pillars {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 520px), 1fr));
  border-top: 1px solid var(--ink);
}
.pillar {
  padding: clamp(32px, 4vw, 56px) clamp(0px, 3vw, 48px) clamp(32px, 4vw, 56px) 0;
  border-bottom: 1px solid var(--line); display: flex; gap: 32px;
}
.pillar__body { display: flex; flex-direction: column; gap: 14px; }
.pillar__num { font-family: var(--serif); font-style: italic; font-size: 28px; color: var(--wine); flex: 0 0 48px; }
.pillar h3 { font-family: var(--serif); font-weight: 400; font-size: clamp(28px, 2.6vw, 38px); line-height: 1.1; }
</style>
