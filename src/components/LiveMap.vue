<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { reducedMotion } from '../composables/motion'

// Mapa ilustrativo do acompanhamento em tempo real: o veículo anda pela rota
// e o aviso "atualizado há" corre como num app de rastreio.
const props = defineProps({ active: { type: Boolean, default: false } })

const ROUTE = 'M70 352 L150 352 L206 282 L332 282 L388 198 L482 170 L532 96'
const routeEl = ref(null)
const len = ref(1)
const t = ref(0.18)          // posição do veículo na rota (0 a 1)
const pos = ref({ x: 70, y: 352, a: 0 })
const seconds = ref(8)
let raf = 0, last = 0, timer = 0

function place() {
  const el = routeEl.value
  if (!el) return
  const L = len.value
  const p = el.getPointAtLength(L * t.value)
  const q = el.getPointAtLength(Math.min(L, L * t.value + 2))
  pos.value = { x: p.x, y: p.y, a: (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI }
}

function frame(now) {
  raf = requestAnimationFrame(frame)
  if (!last) last = now
  const dt = Math.min(0.05, (now - last) / 1000)
  last = now
  t.value += dt * 0.045
  if (t.value > 0.86) t.value = 0.18
  place()
}

function start() {
  if (raf || reducedMotion()) return
  last = 0
  raf = requestAnimationFrame(frame)
  timer = setInterval(() => { seconds.value = seconds.value >= 19 ? 3 : seconds.value + 1 }, 1000)
}
function stop() {
  cancelAnimationFrame(raf); raf = 0
  clearInterval(timer); timer = 0
}

onMounted(() => {
  len.value = routeEl.value.getTotalLength()
  t.value = reducedMotion() ? 0.6 : 0.18
  place()
  if (props.active) start()
})
watch(() => props.active, (on) => (on ? start() : stop()))
onBeforeUnmount(stop)

const done = computed(() => len.value * (1 - t.value))
</script>

<template>
  <figure class="map" aria-label="Exemplo de acompanhamento em tempo real no mapa">
    <svg class="map__svg" viewBox="0 0 600 420" aria-hidden="true">
      <rect width="600" height="420" fill="#1E2023" />
      <!-- rio e parques -->
      <path d="M-10 300 C 120 250, 230 330, 360 270 S 560 220, 610 236" fill="none" stroke="#22303A" stroke-width="30" stroke-linecap="round" />
      <rect x="400" y="300" width="120" height="70" rx="8" fill="#22291F" />
      <rect x="250" y="60" width="90" height="64" rx="8" fill="#22291F" />
      <!-- ruas -->
      <g stroke="#2C2F34" stroke-width="5" stroke-linecap="round">
        <path v-for="y in [40, 96, 150, 206, 330, 390]" :key="`h${y}`" :d="`M-10 ${y} L610 ${y - 34}`" />
        <path v-for="x in [40, 110, 180, 250, 320, 390, 460, 530]" :key="`v${x}`" :d="`M${x} -10 L${x + 40} 430`" />
      </g>
      <!-- avenidas por onde passa a rota -->
      <g stroke="#3A3E45" stroke-width="13" stroke-linecap="round" fill="none">
        <path d="M10 352 L210 352" />
        <path d="M120 390 L240 240" />
        <path d="M170 282 L380 282" />
        <path d="M300 330 L420 150" />
        <path d="M360 205 L590 140" />
        <path d="M470 190 L560 50" />
      </g>
      <!-- rota inteira (pontilhada) e trecho já feito (vermelho) -->
      <path :d="ROUTE" fill="none" stroke="#7B7E86" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 11" />
      <path ref="routeEl" :d="ROUTE" fill="none" stroke="#E3141B" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"
        :stroke-dasharray="len" :stroke-dashoffset="done" />
      <!-- A e B -->
      <g transform="translate(70 352)">
        <circle r="15" fill="#E3141B" stroke="#1E2023" stroke-width="4" />
        <text y="6" text-anchor="middle" class="map__letter" fill="#fff">A</text>
      </g>
      <g transform="translate(532 96)">
        <circle r="26" fill="#fff" opacity=".12" class="map__pulse" />
        <circle r="15" fill="#fff" stroke="#1E2023" stroke-width="4" />
        <text y="6" text-anchor="middle" class="map__letter" fill="#E3141B">B</text>
      </g>
      <!-- veículo -->
      <g :transform="`translate(${pos.x} ${pos.y})`">
        <circle r="22" fill="#E3141B" opacity=".22" />
        <circle r="15" fill="#E3141B" stroke="#fff" stroke-width="3" />
        <g transform="translate(-8.6 -9.4) scale(.72)" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2 6.5h12v10H2z" /><path d="M14 9.5h4.2l3.3 3.6v3.4H14" /><circle cx="6" cy="17.5" r="2" /><circle cx="17.5" cy="17.5" r="2" />
        </g>
      </g>
    </svg>

    <div class="map__top">
      <span class="map__live"><span class="map__dot"></span> Em trânsito</span>
      <span class="map__ago num">Atualizado há {{ seconds }} s</span>
    </div>
    <figcaption class="map__bottom">
      <span class="map__eta"><small>Previsão de entrega</small><strong class="num">13:40</strong></span>
      <span class="map__window">
        <small>Acompanhamento ativo</small>
        <span class="map__bar"><span :style="{ width: `${Math.round(t * 70 + 10)}%` }"></span></span>
        <small class="map__window-cap">até 8 h</small>
      </span>
    </figcaption>
  </figure>
</template>

<style scoped>
.map {
  position: relative; overflow: hidden; border-radius: 18px; background: #1E2023;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .08), 0 40px 80px -40px rgba(0, 0, 0, .9);
}
.map__svg { width: 100%; height: auto; }
.map__letter { font-family: var(--font-display); font-weight: 800; font-size: 17px; }
.map__pulse { transform-origin: center; transform-box: fill-box; animation: pulse 2.4s ease-out infinite; }
@keyframes pulse { from { transform: scale(.6); opacity: .5 } to { transform: scale(1.8); opacity: 0 } }

.map__top {
  position: absolute; left: 14px; right: 14px; top: 14px;
  display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap;
}
.map__live, .map__ago {
  display: inline-flex; align-items: center; gap: 8px; padding: 7px 12px; border-radius: 999px;
  background: rgba(20, 21, 24, .82); font-size: 14px; font-weight: 600;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .1); backdrop-filter: blur(6px);
}
.map__ago { color: var(--tinta-2); font-weight: 500; }
.map__dot { width: 9px; height: 9px; border-radius: 50%; background: var(--vermelho); animation: live 1.8s ease-out infinite; }
@keyframes live { 0% { box-shadow: 0 0 0 0 rgba(227, 20, 27, .7) } 100% { box-shadow: 0 0 0 9px rgba(227, 20, 27, 0) } }

.map__bottom {
  display: grid; grid-template-columns: auto minmax(0, 1fr); gap: 1px;
  background: rgba(255, 255, 255, .08); border-top: 1px solid rgba(255, 255, 255, .08);
}
.map__eta, .map__window {
  display: flex; flex-direction: column; justify-content: center; gap: 2px;
  padding: 12px 16px; background: #212327;
}
.map small { font-size: 13px; color: var(--tinta-3); line-height: 1.2; }
.map__eta strong { font-family: var(--font-display); font-size: 28px; font-weight: 700; line-height: 1; }
.map__window { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: center; column-gap: 10px; }
.map__window > small:first-child { grid-column: 1 / -1; }
.map__bar { display: block; height: 6px; border-radius: 6px; background: rgba(255, 255, 255, .12); overflow: hidden; }
.map__bar span { display: block; height: 100%; background: var(--vermelho); border-radius: 6px; transition: width .4s linear; }
.map__window-cap { color: var(--tinta-2) !important; font-weight: 600; }

@media (max-width: 520px) {
  .map__bottom { grid-template-columns: 1fr; }
  .map__ago { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .map__pulse, .map__dot { animation: none; }
}
</style>
