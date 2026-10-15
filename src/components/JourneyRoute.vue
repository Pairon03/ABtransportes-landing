<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { ScrollTrigger, reducedMotion } from '../composables/motion'
import AppIcon from './AppIcon.vue'
import JourneyVisual from './JourneyVisual.vue'

// Como funciona, contado como uma viagem: a estrada à esquerda acompanha a rolagem,
// o marcador fica no meio da tela como num GPS e cada parada acende quando ele chega.
// O relógio mostra que tudo acontece no mesmo dia (horários de exemplo).
const stops = [
  { kind: 'pedido', time: '08:12', min: 8 * 60 + 12, icon: 'chat', title: 'Você pede pelo WhatsApp', text: 'Mande os endereços, o peso, as medidas e o tipo de material. A gente analisa e responde com a proposta.' },
  { kind: 'coleta', time: '09:05', min: 9 * 60 + 5, icon: 'camera', title: 'Coletamos e fotografamos', text: 'Coleta no mesmo dia, conforme a disponibilidade. O material é fotografado na hora em que sai com a gente.' },
  { kind: 'transito', time: '09:20', min: 9 * 60 + 20, icon: 'pin', title: 'Você acompanha em tempo real', text: 'Por até 8 horas, você vê o andamento do transporte, do ponto A ao ponto B.' },
  { kind: 'entrega', time: '13:40', min: 13 * 60 + 40, icon: 'check', title: 'Entregamos e registramos', text: 'Foto na entrega e você informado do começo ao fim, sem precisar ligar para perguntar.' },
]

const list = ref(null)
const marker = ref(null)
const done = ref(null)
const stopEls = ref([])
const reached = ref(-1)
const clock = ref('08:00')
const still = ref(false)
let pins = []
let height = 1
let st, ro

const fmt = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(Math.round(m % 60)).padStart(2, '0')}`

function measure() {
  const el = list.value
  if (!el) return
  height = el.offsetHeight
  // refs de v-for não garantem a ordem: ordena pela posição na página
  pins = stopEls.value.map((s) => s.offsetTop + 34).sort((x, y) => x - y)
}

function update(y) {
  if (marker.value) marker.value.style.transform = `translate3d(0, ${y}px, 0)`
  if (done.value) done.value.style.transform = `scaleY(${Math.max(0, y) / height})`
  let r = -1
  pins.forEach((p, i) => { if (y >= p - 2) r = i })
  reached.value = r
  // relógio: interpola entre os horários das paradas
  const pts = [[0, 8 * 60], ...pins.map((p, i) => [p, stops[i].min]), [height, stops[stops.length - 1].min]]
  let m = pts[0][1]
  for (let i = 1; i < pts.length; i++) {
    const [y0, m0] = pts[i - 1], [y1, m1] = pts[i]
    if (y <= y1) { m = m0 + (m1 - m0) * Math.max(0, (y - y0) / Math.max(1, y1 - y0)); break }
    m = m1
  }
  clock.value = fmt(m)
}

onMounted(async () => {
  await nextTick()
  measure()
  if (reducedMotion()) {
    still.value = true
    reached.value = stops.length - 1
    return
  }
  st = ScrollTrigger.create({
    trigger: list.value,
    start: 'top center',
    end: 'bottom center',
    onUpdate: (self) => update(self.progress * height),
    onRefresh: (self) => { measure(); update(self.progress * height) },
  })
  update(0)
  ro = new ResizeObserver(() => { measure(); ScrollTrigger.refresh() })
  ro.observe(list.value)
})

onBeforeUnmount(() => { st && st.kill(); ro && ro.disconnect() })
</script>

<template>
  <section id="como-funciona" class="journey section wrap" :class="{ 'journey--still': still }">
    <div class="container">
      <div class="journey__head">
        <h2 class="display h-lg">Do pedido à entrega, cada parada registrada.</h2>
        <p class="lead">Um dia de exemplo com a AB: tudo resolvido entre o café da manhã e o começo da tarde.</p>
      </div>

      <div class="journey__body">
        <div class="rail" aria-hidden="true">
          <span class="rail__road"></span>
          <span ref="done" class="rail__done"></span>
          <span ref="marker" class="rail__marker">
            <span class="rail__dot"><AppIcon name="truck" :size="20" /></span>
            <span class="rail__clock num">{{ clock }}</span>
          </span>
        </div>

        <ol ref="list" class="stops">
          <li
            v-for="(s, i) in stops"
            :key="s.kind"
            ref="stopEls"
            class="stop"
            :class="{ 'stop--on': i <= reached, 'stop--now': i === reached }"
          >
            <span class="stop__pin" aria-hidden="true"><AppIcon :name="s.icon" :size="18" /></span>
            <div class="stop__text">
              <p class="stop__time num">{{ s.time }}</p>
              <h3 class="stop__title">{{ s.title }}</h3>
              <p class="stop__body">{{ s.text }}</p>
            </div>
            <JourneyVisual class="stop__visual" :kind="s.kind" :time="s.time" :active="i <= reached" />
          </li>
        </ol>
      </div>
      <p class="journey__note">Conversa, horários e mapa são ilustrativos.</p>
    </div>
  </section>
</template>

<style scoped>
.journey { background: linear-gradient(180deg, var(--noite) 0%, var(--asfalto) 100%); }
.journey__head { display: grid; grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr); gap: 24px 64px; align-items: end; margin-bottom: clamp(48px, 7vw, 96px); }
.journey__head .lead { justify-self: end; }

.journey__body { position: relative; display: grid; grid-template-columns: 76px minmax(0, 1fr); column-gap: 96px; }

/* estrada vertical */
.rail { position: relative; }
.rail__road {
  position: absolute; left: 50%; top: 0; bottom: 0; width: 44px; transform: translateX(-50%);
  border-radius: 22px; background: #202125;
  box-shadow: inset 2px 0 0 rgba(236, 234, 228, .5), inset -2px 0 0 rgba(236, 234, 228, .5);
}
.rail__road::after {
  content: ''; position: absolute; left: 50%; top: 12px; bottom: 12px; width: 3px; transform: translateX(-50%);
  background: repeating-linear-gradient(180deg, rgba(236, 234, 228, .55) 0 18px, transparent 18px 38px);
}
.rail__done {
  position: absolute; left: 50%; top: 0; width: 8px; height: 100%; margin-left: -4px; border-radius: 4px;
  background: var(--vermelho); transform-origin: 50% 0; transform: scaleY(0);
  box-shadow: 0 0 18px rgba(227, 20, 27, .6);
}
.rail__marker {
  position: absolute; left: 50%; top: 0; width: 0; height: 0; z-index: 2; will-change: transform;
}
.rail__dot {
  position: absolute; left: -24px; top: -24px; width: 48px; height: 48px; border-radius: 50%;
  display: grid; place-items: center; background: var(--vermelho); color: #fff;
  box-shadow: 0 0 0 5px var(--noite), 0 0 0 6px rgba(255, 255, 255, .25), 0 12px 30px rgba(0, 0, 0, .6);
}
.rail__clock {
  position: absolute; left: 34px; top: -15px; padding: 4px 10px; border-radius: 6px;
  background: var(--tinta); color: #16171A;
  font-family: var(--font-display); font-weight: 700; font-size: 20px; line-height: 22px; white-space: nowrap;
}

.stops { display: grid; gap: clamp(64px, 12vh, 140px); padding: 8vh 0 14vh; }
.stop {
  position: relative; display: grid; grid-template-columns: minmax(0, 0.85fr) minmax(0, 1fr);
  gap: 28px clamp(32px, 5vw, 72px); align-items: start; min-height: 46vh;
}
.stop__pin {
  position: absolute; left: calc(-38px - 96px - 17px); top: 17px;
  width: 34px; height: 34px; border-radius: 50%; display: grid; place-items: center;
  background: #2A2C30; color: var(--tinta-3); box-shadow: 0 0 0 3px #202125, inset 0 0 0 2px var(--linha);
  transition: background-color .35s ease, color .35s ease, box-shadow .35s ease, transform .35s var(--ease-out);
}
.stop--on .stop__pin { background: var(--tinta); color: var(--vermelho); box-shadow: 0 0 0 3px #202125; }
.stop--now .stop__pin { transform: scale(1.12); }

.stop__text { display: flex; flex-direction: column; gap: 10px; padding-top: 6px; }
.stop__time {
  font-family: var(--font-display); font-weight: 700; font-size: 22px; color: var(--tinta-3);
  transition: color .35s ease;
}
.stop--on .stop__time { color: var(--vermelho-claro); }
.stop__title {
  font-family: var(--font-display); font-weight: 800; font-style: italic;
  font-size: clamp(34px, 3.2vw, 48px); line-height: .95; letter-spacing: -0.005em;
  color: var(--tinta-3); transition: color .35s ease;
}
.stop--on .stop__title { color: var(--tinta); }
.stop__body { color: var(--tinta-2); max-width: 28em; }

.journey__note { margin-top: 12px; font-size: 14px; color: var(--tinta-3); }

/* sem animação: tudo aceso, sem marcador */
.journey--still .rail__marker { display: none; }
.journey--still .rail__done { transform: scaleY(1); }

@media (max-width: 900px) {
  .journey__head { grid-template-columns: 1fr; }
  .journey__head .lead { justify-self: start; }
  .journey__body { grid-template-columns: 40px minmax(0, 1fr); column-gap: 16px; }
  .rail__road { width: 30px; }
  .rail__dot { left: -20px; top: -20px; width: 40px; height: 40px; }
  .rail__dot :deep(svg) { width: 17px; height: 17px; }
  .rail__clock { left: -22px; top: -50px; font-size: 17px; line-height: 20px; padding: 2px 7px; }
  .stop { grid-template-columns: 1fr; min-height: 0; }
  .stop__pin { left: calc(-20px - 16px - 15px); width: 30px; height: 30px; top: 12px; }
  .stop__pin :deep(svg) { width: 15px; height: 15px; }
  .stops { gap: 72px; padding: 4vh 0 10vh; }
}
</style>
