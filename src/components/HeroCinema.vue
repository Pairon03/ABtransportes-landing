<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { HERO_VIDEO, waLink } from '../config'
import { prefersReducedMotion } from '../composables/useInView'
import AppIcon from './AppIcon.vue'
import BrandedImg from './BrandedImg.vue'

// Topo "cinema": cenas em tela cheia que se alternam sozinhas com zoom lento (efeito Ken Burns),
// como um vídeo. Se HERO_VIDEO estiver preenchido em config.js, toca o vídeo no lugar.
const base = import.meta.env.BASE_URL
const scenes = [
  { key: 'estrada', label: 'Caminhão', img: 'img/hero-estrada.webp', alt: 'Caminhão baú em uma rodovia ao entardecer' },
  { key: 'cidade', label: 'Moto', img: 'img/hero-cidade.webp', alt: 'Entregador de moto atravessando uma avenida' },
  { key: 'doca', label: 'Carga', img: 'img/hero-doca.webp', alt: 'Van sendo carregada na doca de um galpão à noite' },
]
const SCENE_MS = 6500

const active = ref(0)
const paused = ref(false)
let timer = 0
let startedAt = 0
const elapsed = ref(0)
let raf = 0

function tick(now) {
  if (!startedAt) startedAt = now
  if (!paused.value) {
    elapsed.value = now - startedAt
    if (elapsed.value >= SCENE_MS) {
      active.value = (active.value + 1) % scenes.length
      startedAt = now
      elapsed.value = 0
    }
  } else {
    startedAt = now - elapsed.value
  }
  raf = requestAnimationFrame(tick)
}

const reduced = ref(false)
onMounted(() => {
  reduced.value = prefersReducedMotion()
  if (!reduced.value && !HERO_VIDEO) raf = requestAnimationFrame(tick)
  // cartão de acompanhamento: o contador "atualizado há" corre como ao vivo
  timer = setInterval(() => { seconds.value = (seconds.value + 1) % 60 }, 1000)
})
onBeforeUnmount(() => { cancelAnimationFrame(raf); clearInterval(timer) })

const seconds = ref(12)
</script>

<template>
  <section id="topo" class="cinema" @mouseenter="paused = true" @mouseleave="paused = false">
    <!-- camada de mídia -->
    <div class="cinema__media" aria-hidden="true">
      <video
        v-if="HERO_VIDEO"
        class="cinema__video"
        :src="base + HERO_VIDEO"
        autoplay
        muted
        loop
        playsinline
      ></video>
      <template v-else>
        <BrandedImg
          v-for="(s, i) in scenes"
          :key="s.key"
          :path="s.img"
          alt=""
          class="cinema__scene"
          :class="{ 'cinema__scene--on': i === active, 'cinema__scene--still': reduced }"
          width="1376"
          height="768"
          :fetchpriority="i === 0 ? 'high' : 'low'"
        />
      </template>
      <div class="cinema__shade"></div>
      <div class="cinema__grain"></div>
    </div>

    <div class="cinema__inner wrap">
      <div class="container cinema__grid">
        <div class="cinema__copy">
          <p class="cinema__kicker">
            <span class="live-dot" aria-hidden="true"></span>
            Coleta e entrega no mesmo dia, conforme disponibilidade
          </p>
          <h1 class="cinema__title">
            <span class="reveal" style="--d: 0">Do ponto A</span>
            <span class="reveal" style="--d: 1">ao ponto B,</span>
            <span class="reveal reveal--red" style="--d: 2">sem perder de vista.</span>
          </h1>
          <p class="cinema__lead reveal" style="--d: 3">
            Moto, carro ou caminhão, com acompanhamento em tempo real e registro
            fotográfico na coleta e na entrega.
          </p>
          <div class="cinema__actions reveal" style="--d: 4">
            <a class="btn btn--orange" href="#orcamento">Pedir orçamento</a>
            <a class="btn btn--glass" :href="waLink()" target="_blank" rel="noopener">
              <AppIcon name="chat" :size="20" /> Falar no WhatsApp
            </a>
          </div>
        </div>

        <!-- cartão de acompanhamento ao vivo (exemplo) -->
        <aside class="ticket reveal" style="--d: 3" aria-label="Exemplo de acompanhamento de uma entrega">
          <div class="ticket__head">
            <span class="ticket__live"><span class="live-dot" aria-hidden="true"></span> Ao vivo</span>
            <span class="ticket__tag">Exemplo</span>
          </div>
          <ol class="ticket__steps">
            <li class="tstep tstep--done">
              <span class="tstep__icon"><AppIcon name="camera" :size="16" /></span>
              <span><strong>Coletado</strong><small>Foto da coleta anexada</small></span>
            </li>
            <li class="tstep tstep--now">
              <span class="tstep__icon"><AppIcon name="pin" :size="16" /></span>
              <span>
                <strong>Em trânsito</strong>
                <small>Posição atualizada há {{ seconds }}s</small>
                <span class="tstep__bar" aria-hidden="true"><span></span></span>
              </span>
            </li>
            <li class="tstep">
              <span class="tstep__icon"><AppIcon name="check" :size="16" /></span>
              <span><strong>Entrega</strong><small>Foto na chegada ao destino</small></span>
            </li>
          </ol>
        </aside>
      </div>

    </div>
  </section>
</template>

<style scoped>
.cinema {
  position: relative; isolation: isolate; overflow: hidden;
  min-height: min(92vh, 880px);
  display: flex; flex-direction: column; justify-content: flex-end;
  color: #fff; background: #141518;
  margin-top: -76px; padding-top: 76px; /* fica por baixo do cabeçalho transparente */
}
.cinema__media { position: absolute; inset: 0; z-index: -1; }
.cinema__video, .cinema__scene { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.cinema__scene { opacity: 0; transform: scale(1.12); transition: opacity 1.4s ease; }
.cinema__scene--on { opacity: 1; animation: kenburns 7.5s linear forwards; }
.cinema__scene--still { animation: none; transform: scale(1.02); }
@keyframes kenburns {
  from { transform: scale(1.12) translate3d(1.5%, 0, 0); }
  to { transform: scale(1.02) translate3d(-1%, -1%, 0); }
}
.cinema__shade {
  position: absolute; inset: 0;
  background:
    linear-gradient(90deg, rgba(20, 21, 24, 0.94) 0%, rgba(20, 21, 24, 0.72) 42%, rgba(20, 21, 24, 0.18) 75%, rgba(20, 21, 24, 0.35) 100%),
    linear-gradient(0deg, rgba(43, 45, 49, 1) 0%, rgba(43, 45, 49, 0) 28%);
}
.cinema__grain {
  position: absolute; inset: -50%; opacity: .07; pointer-events: none;
  background-image: radial-gradient(rgba(255,255,255,.7) 1px, transparent 1px);
  background-size: 3px 3px;
  animation: grain 1.2s steps(4) infinite;
}
@keyframes grain { 0% { transform: translate(0,0) } 25% { transform: translate(-1%,1%) } 50% { transform: translate(1%,-1%) } 75% { transform: translate(-1%,-1%) } }

.cinema__inner { padding-top: clamp(48px, 8vw, 110px); padding-bottom: clamp(56px, 7vw, 96px); }
.cinema__grid { display: grid; grid-template-columns: minmax(0, 1.4fr) minmax(0, 0.8fr); gap: 40px; align-items: end; }
.cinema__copy { display: flex; flex-direction: column; gap: 24px; }
.cinema__kicker {
  align-self: flex-start; display: inline-flex; align-items: center; gap: 10px;
  padding: 8px 14px; border-radius: 999px; font-size: 15px; font-weight: 600;
  background: rgba(255,255,255,.08); box-shadow: inset 0 0 0 1px rgba(255,255,255,.18);
  backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
}
.live-dot { width: 9px; height: 9px; border-radius: 50%; background: var(--orange); box-shadow: 0 0 0 0 rgba(227,20,27,.7); animation: live 1.8s ease-out infinite; flex: none; }
@keyframes live { to { box-shadow: 0 0 0 10px rgba(227,20,27,0); } }

.cinema__title {
  font-size: clamp(48px, 7.4vw, 112px); line-height: .92; font-weight: 800; letter-spacing: -0.045em;
  display: flex; flex-direction: column;
}
.reveal--red { color: var(--orange); }
.cinema__lead { font-size: clamp(18px, 1.6vw, 21px); line-height: 1.55; color: #D4D4DA; max-width: 34em; }
.cinema__actions { display: flex; flex-wrap: wrap; gap: 14px; }
.btn--glass {
  color: #fff; background: rgba(255,255,255,.08);
  box-shadow: inset 0 0 0 1.5px rgba(255,255,255,.3);
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
}
.btn--glass:hover { background: rgba(255,255,255,.16); color: #fff; }

/* entrada orquestrada do texto */
.reveal { opacity: 0; transform: translateY(26px); animation: rise .9s var(--ease-out) forwards; animation-delay: calc(var(--d) * .12s + .15s); }
@keyframes rise { to { opacity: 1; transform: none; } }

/* cartão de acompanhamento */
.ticket {
  justify-self: end; width: 100%; max-width: 340px;
  background: rgba(20, 21, 24, .62); border-radius: 22px; padding: 18px;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.14), 0 30px 60px -30px rgba(0,0,0,.8);
  backdrop-filter: blur(14px) saturate(140%); -webkit-backdrop-filter: blur(14px) saturate(140%);
}
.ticket__head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; font-size: 13px; }
.ticket__live { display: inline-flex; align-items: center; gap: 8px; font-weight: 700; }
.ticket__tag { color: #A9A9B2; }
.ticket__steps { display: grid; gap: 12px; }
.tstep { display: flex; gap: 12px; align-items: flex-start; color: #A9A9B2; }
.tstep strong { display: block; color: #fff; font-size: 15px; }
.tstep small { display: block; font-size: 13px; }
.tstep > span:last-child { flex: 1; min-width: 0; }
.tstep__icon { flex: none; display: grid; place-items: center; width: 30px; height: 30px; border-radius: 50%; background: rgba(255,255,255,.1); color: #fff; }
.tstep--done .tstep__icon { background: #fff; color: #141518; }
.tstep--now .tstep__icon { background: var(--orange); }
.tstep__bar { display: block; height: 4px; border-radius: 4px; background: rgba(255,255,255,.14); margin-top: 8px; overflow: hidden; }
.tstep__bar span { display: block; height: 100%; width: 40%; background: var(--orange); border-radius: 4px; animation: travel 3.6s ease-in-out infinite alternate; }
@keyframes travel { from { width: 22% } to { width: 78% } }


@media (max-width: 900px) {
  .cinema__grid { grid-template-columns: 1fr; }
  .ticket { justify-self: start; max-width: 420px; }
  .cinema__shade { background: linear-gradient(0deg, rgba(43,45,49,1) 0%, rgba(20,21,24,.82) 45%, rgba(20,21,24,.55) 100%); }
}
@media (prefers-reduced-motion: reduce) {
  .reveal { animation: none; opacity: 1; transform: none; }
  .cinema__grain { animation: none; }
}
</style>
