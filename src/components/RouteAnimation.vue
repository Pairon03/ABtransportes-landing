<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { prefersReducedMotion } from '../composables/useInView'
import AppIcon from './AppIcon.vue'

// A peça principal da página: o traço da rota se desenha e o veículo
// percorre de A até B; as etapas acendem conforme ele passa.
const pathEl = ref(null)
const progress = ref(0)   // 0 → 1, posição do veículo na rota
const drawn = ref(0)      // 0 → 1, quanto do traço já foi desenhado
const pos = ref({ x: 70, y: 300 })
let length = 0
let raf = 0
let start = 0

const DRAW = 1400   // ms desenhando o traço
const TRAVEL = 4200 // ms do veículo
const HOLD = 2600   // ms parado no destino antes de recomeçar
const CYCLE = DRAW + TRAVEL + HOLD

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function place(p) {
  if (!pathEl.value) return
  const pt = pathEl.value.getPointAtLength(length * p)
  pos.value = { x: pt.x, y: pt.y }
}

function frame(now) {
  if (!start) start = now
  const t = (now - start) % CYCLE
  drawn.value = Math.min(1, t / DRAW)
  progress.value = t < DRAW ? 0 : Math.min(1, ease((t - DRAW) / TRAVEL))
  place(progress.value)
  raf = requestAnimationFrame(frame)
}

onMounted(() => {
  length = pathEl.value.getTotalLength()
  if (prefersReducedMotion()) {
    drawn.value = 1
    progress.value = 1
    place(1)
    return
  }
  raf = requestAnimationFrame(frame)
})
onBeforeUnmount(() => cancelAnimationFrame(raf))

const dashOffset = computed(() => length * (1 - drawn.value))
const travelledOffset = computed(() => length * (1 - progress.value))

const stages = computed(() => [
  { key: 'coleta', icon: 'camera', title: 'Coletado', detail: 'Foto registrada na coleta', on: progress.value > 0.001 || drawn.value >= 1 },
  { key: 'transito', icon: 'pin', title: 'Em trânsito', detail: 'Tempo real por até 8h', on: progress.value > 0.12 },
  { key: 'entrega', icon: 'check', title: 'Entregue', detail: 'Foto registrada na entrega', on: progress.value >= 0.995 },
])
</script>

<template>
  <figure class="route" aria-label="Animação: a encomenda sai do ponto A e chega ao ponto B, com fotos na coleta e na entrega">
    <svg class="route__map" viewBox="0 0 520 380" aria-hidden="true">
      <defs>
        <pattern id="grid" width="26" height="26" patternUnits="userSpaceOnUse">
          <path d="M26 0H0V26" fill="none" stroke="#F6DEDC" stroke-width="1" />
        </pattern>
      </defs>
      <rect width="520" height="380" fill="url(#grid)" />
      <!-- quarteirões estilizados -->
      <g fill="#FFE4E1">
        <rect x="150" y="40" width="96" height="70" rx="10" />
        <rect x="300" y="190" width="120" height="64" rx="10" />
        <rect x="40" y="150" width="70" height="90" rx="10" />
        <rect x="380" y="290" width="100" height="56" rx="10" />
      </g>

      <!-- trilho cinza da rota inteira -->
      <path
        d="M70 300 C 140 300, 120 190, 210 180 S 320 250, 360 160 S 420 70, 450 80"
        fill="none" stroke="#F2C4C0" stroke-width="10" stroke-linecap="round"
        :stroke-dasharray="length" :stroke-dashoffset="dashOffset"
      />
      <!-- trecho já percorrido -->
      <path
        ref="pathEl"
        d="M70 300 C 140 300, 120 190, 210 180 S 320 250, 360 160 S 420 70, 450 80"
        fill="none" stroke="#E3141B" stroke-width="10" stroke-linecap="round"
        :stroke-dasharray="length || 1" :stroke-dashoffset="travelledOffset"
      />

      <!-- ponto A -->
      <g transform="translate(70 300)">
        <circle r="22" fill="#fff" stroke="#111111" stroke-width="4" />
        <text y="7" text-anchor="middle" font-size="20" font-weight="800" fill="#111111" font-family="Bricolage Grotesque, sans-serif">A</text>
      </g>
      <!-- ponto B -->
      <g transform="translate(450 80)">
        <circle r="26" fill="#E3141B" opacity=".18" class="route__pulse" />
        <circle r="22" fill="#E3141B" />
        <text y="7" text-anchor="middle" font-size="20" font-weight="800" fill="#FFFFFF" font-family="Bricolage Grotesque, sans-serif">B</text>
      </g>

      <!-- veículo -->
      <g :transform="`translate(${pos.x} ${pos.y})`">
        <circle r="19" fill="#111111" />
        <g transform="translate(-11 -11) scale(.92)" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="5.5" cy="17" r="3" /><circle cx="18.5" cy="17" r="3" />
          <path d="M8.5 17h5l3-6.5h-4.5" /><path d="M5.5 17 9 10.5h4" /><path d="M15.5 6.5H18l1.5 4" />
        </g>
      </g>
    </svg>

    <ol class="route__stages">
      <li v-for="s in stages" :key="s.key" class="stage" :class="{ 'stage--on': s.on }">
        <span class="stage__icon"><AppIcon :name="s.icon" :size="18" /></span>
        <span>
          <strong>{{ s.title }}</strong>
          <span class="stage__detail">{{ s.detail }}</span>
        </span>
      </li>
    </ol>
  </figure>
</template>

<style scoped>
.route {
  position: relative;
  background: #fff;
  border-radius: var(--r-lg);
  box-shadow: 0 1px 0 var(--line), 0 30px 60px -30px rgba(227, 20, 27, 0.28);
  padding: 14px 14px 18px;
}
.route__map { width: 100%; height: auto; display: block; border-radius: 22px; background: var(--sky); }
.route__pulse { transform-origin: center; animation: pulse 2.2s ease-out infinite; }
@keyframes pulse { from { transform: scale(.8); opacity: .5 } to { transform: scale(2); opacity: 0 } }

.route__stages { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin-top: 14px; }
.stage {
  display: flex; gap: 10px; align-items: flex-start;
  padding: 10px 12px; border-radius: 14px; background: var(--sky);
  color: var(--ink-3); font-size: 14px; line-height: 1.3;
  transition: background-color .4s ease, color .4s ease, transform .4s var(--ease-out);
}
.stage > span:last-child { min-width: 0; overflow-wrap: anywhere; }
.stage strong { display: block; font-weight: 700; font-size: 15px; }
.stage__detail { display: block; }
.stage__icon {
  flex: none; display: grid; place-items: center; width: 30px; height: 30px; border-radius: 50%;
  background: #fff; color: var(--ink-3); transition: background-color .4s ease, color .4s ease;
}
.stage--on { background: var(--orange); color: #fff; transform: translateY(-3px); }
.stage--on .stage__icon { background: #fff; color: var(--orange); }
.stage--on .stage__detail { color: #FFD9D6; }

@media (max-width: 560px) {
  .route__stages { grid-template-columns: 1fr; }
  .stage { align-items: center; }
}
</style>
