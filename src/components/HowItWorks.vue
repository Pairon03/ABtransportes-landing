<script setup>
import { useInView } from '../composables/useInView'
import AppIcon from './AppIcon.vue'

const { target, inView } = useInView({ threshold: 0.4 })

const steps = [
  { icon: 'box', title: 'Você informa os detalhes', text: 'Envie os endereços, as dimensões, o peso e as demais informações da sua carga.' },
  { icon: 'chat', title: 'Receba seu orçamento', text: 'Analisamos sua necessidade e apresentamos uma proposta de acordo com o serviço solicitado.' },
  { icon: 'truck', title: 'Nós cuidamos do transporte', text: 'Coleta e entrega conforme o combinado, com acompanhamento e registros fotográficos.' },
]
</script>

<template>
  <section id="como-funciona" ref="target" class="section wrap" :class="{ 'how--in': inView }">
    <div class="container">
      <h2 class="h-lg how__title">Como funciona</h2>

      <ol class="steps">
        <li v-for="(s, i) in steps" :key="s.title" class="step" :style="{ '--i': i }">
          <div class="step__marker">
            <span class="step__num">{{ i + 1 }}</span>
            <span class="step__icon"><AppIcon :name="s.icon" :size="22" /></span>
          </div>
          <h3 class="h-md">{{ s.title }}</h3>
          <p class="muted">{{ s.text }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.how__title { margin-bottom: clamp(36px, 5vw, 64px); }
.steps { position: relative; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 40px; }

/* a "estrada" tracejada que liga as etapas, desenhada uma vez ao aparecer */
.steps::before {
  content: ''; position: absolute; left: 32px; right: 32px; top: 31px; height: 4px;
  background-image: linear-gradient(90deg, var(--cobalt) 60%, transparent 0);
  background-size: 22px 4px;
  transform-origin: left; transform: scaleX(0);
  transition: transform 1.4s var(--ease-out);
}
.how--in .steps::before { transform: scaleX(1); }

.step { position: relative; display: flex; flex-direction: column; gap: 12px; }
.step__marker { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.step__num {
  display: grid; place-items: center; width: 66px; height: 66px; border-radius: 50%;
  background: var(--paper); box-shadow: inset 0 0 0 4px var(--cobalt);
  font-size: 28px; font-weight: 800; color: var(--cobalt);
  transform: scale(.6); opacity: 0;
  transition: transform .6s var(--ease-out), opacity .6s ease;
  transition-delay: calc(var(--i) * .45s + .2s);
}
.step:last-child .step__num { background: var(--orange); color: var(--ink); box-shadow: none; }
.how--in .step__num { transform: scale(1); opacity: 1; }
.step__icon { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 12px; background: var(--sky); color: var(--cobalt); }
.step p { max-width: 30em; }

/* No celular: número numa coluna à esquerda, texto à direita,
   e a linha tracejada liga só um número ao próximo. */
@media (max-width: 820px) {
  .steps { grid-template-columns: 1fr; gap: 40px; }
  .steps::before { display: none; }
  .step {
    display: grid; grid-template-columns: 66px minmax(0, 1fr);
    column-gap: 20px; row-gap: 6px; align-items: start;
  }
  .step__marker { grid-row: 1 / span 2; margin: 0; }
  .step__icon { display: none; }
  .step h3, .step p { grid-column: 2; }
  .step h3 { padding-top: 6px; }
  .step:not(:last-child)::after {
    content: ''; position: absolute; left: 31px; top: 74px; bottom: -32px; width: 4px;
    background-image: linear-gradient(180deg, var(--cobalt) 60%, transparent 0);
    background-size: 4px 18px;
    transform: scaleY(0); transform-origin: top;
    transition: transform .6s var(--ease-out);
    transition-delay: calc(var(--i) * .45s + .5s);
  }
  .how--in .step:not(:last-child)::after { transform: scaleY(1); }
}
</style>
