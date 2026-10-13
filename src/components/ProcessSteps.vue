<script setup>
const steps = [
  { n: 1, who: 'Você', title: 'Informa os detalhes da entrega', text: 'Envie os endereços, as dimensões, o peso e as demais informações da sua carga.' },
  { n: 2, who: 'Nós', title: 'Apresentamos seu orçamento', text: 'Analisamos sua necessidade e apresentamos uma proposta de acordo com o serviço solicitado.' },
  { n: 3, who: 'Nós', title: 'Cuidamos do transporte', text: 'Realizamos a coleta e a entrega conforme o combinado, com acompanhamento e registros fotográficos.', accent: true },
]
</script>

<template>
  <section id="percurso" class="wrap-x section percurso">
    <div class="container stack-xl">
      <div class="section-head section-head--center">
        <span class="eyebrow">Como funciona</span>
        <h2 class="display-xl">O percurso, <em>em três tempos.</em></h2>
      </div>
      <ol class="steps">
        <li v-for="s in steps" :key="s.n" class="step" :class="{ 'step--accent': s.accent }">
          <div class="step__top">
            <span class="step__num">{{ s.n }}</span>
            <span class="eyebrow">{{ s.who }}</span>
          </div>
          <h3>{{ s.title }}</h3>
          <p class="body">{{ s.text }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.percurso { background: var(--sand); }
.steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 48px; }
.step { display: flex; flex-direction: column; gap: 20px; border-top: 1px solid var(--ink); padding-top: 28px; }
.step--accent { border-top-color: var(--wine); }
.step__top { display: flex; justify-content: space-between; align-items: baseline; }
.step__num { font-family: var(--serif); font-weight: 300; font-size: 88px; line-height: 0.8; }
.step--accent .step__num { font-style: italic; color: var(--wine); }
.step h3 { font-family: var(--serif); font-weight: 400; font-size: 32px; line-height: 1.1; }
</style>
