<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import AppIcon from './AppIcon.vue'
import StoryVisual from './StoryVisual.vue'

// Jornada da entrega contada pela rolagem: o quadro da direita fica parado na tela
// enquanto a pessoa rola, e cada trecho da rolagem acende uma etapa.
const stages = [
  { kind: 'pedido', icon: 'chat', title: 'Você pede pelo WhatsApp', text: 'Envie os endereços, as dimensões, o peso e as demais informações da carga. Analisamos e apresentamos uma proposta de acordo com o serviço.' },
  { kind: 'coleta', icon: 'camera', title: 'Coletamos e fotografamos', text: 'Coleta no mesmo dia, conforme disponibilidade e demanda. O material é fotografado no momento da coleta.' },
  { kind: 'transito', icon: 'pin', title: 'Você acompanha em tempo real', text: 'Por até 8 horas, você vê o andamento do transporte, do ponto A ao ponto B.' },
  { kind: 'entrega', icon: 'check', title: 'Entregamos e registramos', text: 'Foto na entrega e compromisso do início ao fim, com você informado durante todo o processo.' },
]

const root = ref(null)
const progress = ref(0)
const mobile = ref(false)
let raf = 0

function measure() {
  raf = 0
  const el = root.value
  if (!el) return
  const r = el.getBoundingClientRect()
  const total = el.offsetHeight - window.innerHeight
  progress.value = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0
}
function onScroll() { if (!raf) raf = requestAnimationFrame(measure) }
function onResize() { mobile.value = window.matchMedia('(max-width: 900px)').matches; measure() }

onMounted(() => {
  onResize()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
  cancelAnimationFrame(raf)
})

const current = computed(() => Math.min(stages.length - 1, Math.floor(progress.value * stages.length)))

function goTo(i) {
  const el = root.value
  const total = el.offsetHeight - window.innerHeight
  const top = el.getBoundingClientRect().top + window.scrollY + total * ((i + 0.5) / stages.length)
  window.scrollTo({ top, behavior: 'smooth' })
}
</script>

<template>
  <section id="como-funciona" ref="root" class="story" :style="{ '--n': stages.length }">
    <div class="story__sticky wrap">
      <div class="container story__grid">
        <div class="story__left">
          <h2 class="h-lg story__title">Do pedido à entrega, você vê cada etapa.</h2>

          <ol class="steps">
            <li
              v-for="(s, i) in stages"
              :key="s.kind"
              class="step"
              :class="{ 'step--on': mobile || i === current, 'step--past': !mobile && i < current }"
            >
              <button type="button" class="step__head" @click="goTo(i)" :aria-current="i === current ? 'step' : undefined">
                <span class="step__num">{{ i + 1 }}</span>
                <span class="step__title">{{ s.title }}</span>
                <AppIcon :name="s.icon" :size="20" class="step__icon" />
              </button>
              <p class="step__text">{{ s.text }}</p>
              <StoryVisual v-if="mobile" class="step__visual" :kind="s.kind" :active="true" />
            </li>
          </ol>
        </div>

        <div v-if="!mobile" class="story__stage">
          <div class="rail" aria-hidden="true"><span :style="{ height: `${progress * 100}%` }"></span></div>
          <StoryVisual
            v-for="(s, i) in stages"
            :key="s.kind"
            class="story__visual"
            :class="{ 'story__visual--on': i === current }"
            :kind="s.kind"
            :active="i === current"
            :aria-hidden="i !== current"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* altura extra = espaço de rolagem para as 4 etapas */
.story { position: relative; height: calc(100vh + var(--n) * 70vh); }
.story__sticky { position: sticky; top: 0; height: 100vh; display: flex; align-items: center; }
.story__grid { width: 100%; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: clamp(32px, 6vw, 96px); align-items: center; }
.story__title { margin-bottom: 32px; max-width: 14em; }

.steps { display: grid; gap: 6px; }
.step { border-radius: 18px; padding: 14px 16px; transition: background-color .4s ease; }
.step__head { all: unset; cursor: pointer; display: flex; align-items: center; gap: 14px; width: 100%; }
.step__head:focus-visible { outline: 3px solid var(--orange); outline-offset: 4px; border-radius: 8px; }
.step__num {
  flex: none; display: grid; place-items: center; width: 36px; height: 36px; border-radius: 50%;
  font-weight: 800; font-size: 15px; color: var(--ink-3); box-shadow: inset 0 0 0 2px var(--line);
  transition: all .35s ease;
}
.step__title { flex: 1; font-size: clamp(19px, 1.7vw, 23px); font-weight: 700; letter-spacing: -0.015em; color: var(--ink-3); transition: color .35s ease; }
.step__icon { color: var(--ink-3); opacity: 0; transition: opacity .35s ease; }
.step__text { overflow: hidden; color: var(--ink-2); padding-left: 50px; max-height: 0; opacity: 0; transition: max-height .5s var(--ease-out), opacity .4s ease, margin .4s ease; }
.step--on { background: var(--sky); }
.step--on .step__num { background: var(--orange); color: #fff; box-shadow: none; }
.step--on .step__title { color: var(--ink); }
.step--on .step__icon { opacity: 1; color: var(--orange); }
.step--on .step__text { max-height: 140px; opacity: 1; margin-top: 8px; }
.step--past .step__num { color: var(--orange); box-shadow: inset 0 0 0 2px var(--orange); }

.story__stage { position: relative; min-height: 600px; display: grid; place-items: center; }
.rail { position: absolute; left: -28px; top: 10%; bottom: 10%; width: 3px; border-radius: 3px; background: var(--line); }
.rail span { display: block; width: 100%; background: var(--orange); border-radius: 3px; transition: height .15s linear; }
.story__visual {
  grid-area: 1 / 1; opacity: 0; transform: translateY(30px) scale(.97);
  transition: opacity .6s ease, transform .7s var(--ease-out); pointer-events: none;
}
.story__visual--on { opacity: 1; transform: none; pointer-events: auto; }

@media (max-width: 900px) {
  .story { height: auto; padding-top: var(--section); padding-bottom: var(--section); }
  .story__sticky { position: static; height: auto; }
  .story__grid { grid-template-columns: 1fr; }
  .step { background: var(--sky); padding: 18px; }
  .step__head { cursor: default; }
  .step__text { padding-left: 0; }
  .step--on .step__text { max-height: none; }
  .step__visual { margin-top: 18px; }
  .steps { gap: 16px; }
}
@media (prefers-reduced-motion: reduce) {
  .story__visual { transition: none; transform: none; }
}
</style>
