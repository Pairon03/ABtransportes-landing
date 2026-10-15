<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { waLink } from '../config'
import { gsap, reducedMotion } from '../composables/motion'
import { composeBranded, composeBrandedCanvas, loadImage } from '../composables/useBrandedImage'
import { createRoadScene } from '../composables/roadScene'
import AppIcon from './AppIcon.vue'

// Topo: a foto do caminhão da AB "rodando" (WebGL) e a manchete com os pontos A e B
// ligados por uma rota que se desenha ao carregar a página.
const base = import.meta.env.BASE_URL
const SRC = { w: 2376, h: 1008 }
const VP = [3409.5, 498]            // ponto de fuga das faixas (px da foto)
const TRUCK = { x0: 1095, x1: 2010, top: 190 }
const MOBILE = '(max-width: 900px)'

const hero = ref(null)
const canvas = ref(null)
const still = ref(null)
const stillSrc = ref('')
const ready = ref(false)
const titleEl = ref(null)
const pinA = ref(null)
const pinB = ref(null)
const routeD = ref('')
const routeEl = ref(null)

let scene = null
let framing = { scale: 1, ox: 0, oy: 0 }
let raf = 0
let visible = true
let t0 = 0
let io, ro, tl, scrollTl
const dpr = () => Math.min(window.devicePixelRatio || 1, 1.75)

// Enquadramento: no computador o caminhão fica na metade direita, livre do texto;
// no celular ele ocupa a largura toda, embaixo, e o céu se estende atrás do texto.
function computeFraming(w, h) {
  const mobile = window.matchMedia(MOBILE).matches
  let s, ox, oy
  if (!mobile) {
    const cover = Math.max(w / SRC.w, h / SRC.h)
    const fitTruck = (w * 0.47) / (TRUCK.x1 - TRUCK.x0)
    s = Math.max(Math.min(cover, fitTruck), w / SRC.w)
    const visW = w / s, visH = h / s
    ox = Math.min(Math.max(TRUCK.x1 - visW * 0.965, 0), SRC.w - visW)
    oy = visH >= SRC.h ? SRC.h - visH : (SRC.h - visH) * 0.55
  } else {
    s = (w * 0.9) / (TRUCK.x1 - TRUCK.x0)
    const visW = w / s, visH = h / s
    ox = (TRUCK.x0 + TRUCK.x1) / 2 - visW / 2
    oy = SRC.h - 120 - visH
  }
  return { scale: s, ox, oy }
}

function layout() {
  const el = hero.value
  if (!el) return
  const r = el.getBoundingClientRect()
  const k = dpr()
  const w = Math.round(r.width * k), h = Math.round(r.height * k)
  if (canvas.value) { canvas.value.width = w; canvas.value.height = h }
  framing = computeFraming(w, h)
  // imagem parada (sem WebGL ou antes de carregar): mesmo enquadramento via CSS
  if (still.value) {
    const s = framing.scale / k
    Object.assign(still.value.style, {
      width: `${SRC.w * s}px`, height: `${SRC.h * s}px`,
      transform: `translate(${-framing.ox * s}px, ${-framing.oy * s}px)`,
    })
  }
  if (scene && (!raf || reducedMotion())) scene.render(0, framing, 0)
  drawRoute()
}

function loop(now) {
  raf = requestAnimationFrame(loop)
  if (!visible || document.hidden) return
  if (!t0) t0 = now
  scene.render(((now - t0) / 1000) % 3600, framing, 1)
}

async function startScene() {
  // a foto com a logo vai direto do canvas para a textura (sem gerar arquivo no meio)
  const [baseImg, plate, alpha, light] = await Promise.all([
    composeBrandedCanvas('img/v3/hero-base.webp'),
    loadImage(base + 'img/v3/hero-plate.webp'),
    loadImage(base + 'img/v3/hero-alpha.webp'),
    loadImage(base + 'img/v3/hero-light.webp'),
  ])
  scene = createRoadScene(canvas.value, { base: baseImg, plate, alpha, light }, {
    src: SRC, vp: VP, speed: 0.34, skyTop: [0.11, 0.115, 0.13],
  })
  layout()
  scene.render(0, framing, 0)
  ready.value = true
  if (!reducedMotion()) raf = requestAnimationFrame(loop)
}

// Rota entre os pinos A e B da manchete
function drawRoute() {
  const h = titleEl.value, a = pinA.value, b = pinB.value
  if (!h || !a || !b) return
  const hr = h.getBoundingClientRect()
  const ar = a.getBoundingClientRect()
  const br = b.getBoundingClientRect()
  const ax = ar.left - hr.left + ar.width / 2, ay = ar.top - hr.top + ar.width * 0.5
  const bx = br.left - hr.left + br.width / 2, by = br.top - hr.top + br.width * 0.5
  const room = Math.max(40, Math.min(150, hr.width - bx - 12))
  const c1x = Math.max(ax, bx) + room, c1y = ay - (by - ay) * 0.05
  const c2x = bx + room * 0.9, c2y = by - (by - ay) * 0.75
  routeD.value = `M${ax.toFixed(1)} ${ay.toFixed(1)} C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${bx.toFixed(1)} ${by.toFixed(1)}`
}

function intro() {
  const reduced = reducedMotion()
  const path = routeEl.value
  const len = path ? path.getTotalLength() : 0
  if (reduced) {
    gsap.set(path, { strokeDasharray: 'none' })
    return
  }
  tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
  tl.from('.hero__line', { y: 70, autoAlpha: 0, duration: 1.1, stagger: 0.11 })
    .from([pinA.value, pinB.value], { scale: 0, transformOrigin: '50% 100%', duration: 0.7, ease: 'back.out(2.2)', stagger: 0.45 }, 0.55)
    .fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 1.15, ease: 'power2.inOut' }, 0.8)
    .set(path, { strokeDasharray: 'none' })
    .from('.hero__lead, .hero__actions', { y: 26, autoAlpha: 0, duration: 0.9, stagger: 0.1 }, 0.75)

  // ao rolar: o texto sobe um pouco mais rápido e a cena se aproxima
  scrollTl = gsap.timeline({
    scrollTrigger: { trigger: hero.value, start: 'top top', end: 'bottom top', scrub: true },
  })
  scrollTl.to('.hero__copy', { y: -90, autoAlpha: 0.15, ease: 'none' }, 0)
    .to('.hero__media', { scale: 1.06, ease: 'none' }, 0)
}

onMounted(async () => {
  await nextTick()
  layout()
  ro = new ResizeObserver(() => layout())
  ro.observe(hero.value)
  io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
  io.observe(hero.value)
  try { await document.fonts.ready } catch { /* segue sem esperar */ }
  drawRoute()
  await nextTick()
  intro()
  startScene().catch(async () => {
    // sem WebGL: mostra a foto parada, com a logo
    ready.value = false
    stillSrc.value = await composeBranded('img/v3/hero-base.webp')
  })
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  ro && ro.disconnect()
  io && io.disconnect()
  tl && tl.kill()
  scrollTl && scrollTl.scrollTrigger && scrollTl.scrollTrigger.kill()
  scene && scene.destroy()
})
</script>

<template>
  <section id="topo" ref="hero" class="hero">
    <div class="hero__media" aria-hidden="true">
      <img v-show="stillSrc" ref="still" class="hero__still" :src="stillSrc || undefined" alt="" width="2376" height="1008">
      <canvas ref="canvas" class="hero__canvas" :class="{ 'hero__canvas--on': ready }"></canvas>
      <div class="hero__shade"></div>
    </div>

    <div class="hero__inner wrap">
      <div class="container">
        <div class="hero__copy">
          <h1 ref="titleEl" class="hero__title display">
            <svg class="hero__route" aria-hidden="true">
              <path ref="routeEl" :d="routeD" />
            </svg>
            <span class="hero__line">Do ponto <span ref="pinA" class="pin"><svg viewBox="0 0 62 86" aria-hidden="true"><path d="M31 0C13.9 0 0 13.9 0 31c0 22.4 31 55 31 55s31-32.6 31-55C62 13.9 48.1 0 31 0z" /></svg><span class="pin__letter">A</span></span></span>
            <span class="hero__line">ao ponto <span ref="pinB" class="pin pin--b"><svg viewBox="0 0 62 86" aria-hidden="true"><path d="M31 0C13.9 0 0 13.9 0 31c0 22.4 31 55 31 55s31-32.6 31-55C62 13.9 48.1 0 31 0z" /></svg><span class="pin__letter">B</span></span>,</span>
            <span class="hero__line">sem perder de vista.</span>
          </h1>
          <p class="hero__lead">
            Coleta e entrega no mesmo dia, conforme a disponibilidade, com moto, carro ou caminhão.
            Você acompanha em tempo real por até 8 horas e recebe foto na coleta e na entrega.
          </p>
          <div class="hero__actions">
            <a class="btn btn--red" href="#orcamento">Pedir orçamento</a>
            <a class="btn btn--glass" :href="waLink()" target="_blank" rel="noopener">
              <AppIcon name="chat" :size="22" /> <span><span class="hide-sm">Falar no </span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="hero__stage" aria-hidden="true"></div>
  </section>
</template>

<style scoped>
.hero {
  position: relative; isolation: isolate; overflow: hidden;
  height: min(100svh, 960px); min-height: 640px;
  margin-top: calc(var(--header-h) * -1);
  background: var(--noite); color: #fff;
  display: flex; flex-direction: column;
}
.hero__media { position: absolute; inset: 0; z-index: -1; transform-origin: 70% 60%; }
.hero__still { position: absolute; left: 0; top: 0; max-width: none; transform-origin: 0 0; }
.hero__canvas { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; transition: opacity 1.2s ease; }
.hero__canvas--on { opacity: 1; }
.hero__shade {
  position: absolute; inset: 0;
  background:
    linear-gradient(90deg, rgba(18, 19, 22, 0.9) 0%, rgba(18, 19, 22, 0.66) 30%, rgba(18, 19, 22, 0.12) 52%, rgba(18, 19, 22, 0) 70%),
    linear-gradient(0deg, var(--asfalto) 0%, rgba(42, 44, 48, 0) 16%),
    linear-gradient(180deg, rgba(18, 19, 22, 0.55) 0%, rgba(18, 19, 22, 0) 22%);
}

.hero__inner { flex: 1; display: flex; align-items: center; padding-top: calc(var(--header-h) + 24px); padding-bottom: 72px; }
.hero__inner .container { width: 100%; }
.hero__copy { max-width: 600px; display: flex; flex-direction: column; gap: 26px; }

.hero__title { position: relative; font-size: clamp(60px, 7.6vw, 124px); color: var(--tinta); }
.hero__line { display: block; position: relative; z-index: 1; }
.hero__route { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; z-index: 0; pointer-events: none; }
.hero__route path { fill: none; stroke: var(--vermelho); stroke-width: 5; stroke-linecap: round; filter: drop-shadow(0 0 10px rgba(227, 20, 27, .55)); }

/* pinos de mapa com as letras A e B */
.pin {
  position: relative; display: inline-block; width: .6em; height: .83em;
  vertical-align: -0.02em; margin-left: .02em; font-style: normal;
}
.pin svg { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; filter: drop-shadow(0 8px 14px rgba(0, 0, 0, .45)); }
.pin svg path { fill: var(--vermelho); }
.pin--b svg path { fill: #fff; }
.pin__letter {
  position: absolute; left: 0; right: 0; top: .05em;
  font-size: .46em; line-height: 1; text-align: center; color: #fff; font-style: normal; letter-spacing: 0;
}
.pin--b .pin__letter { color: var(--vermelho); }

.hero__lead { font-size: clamp(18px, 1.45vw, 21px); line-height: 1.55; color: #D9D8D3; max-width: 26em; }
.hero__actions { display: flex; flex-wrap: wrap; gap: 14px; }
.hero__stage { display: none; }

@media (max-width: 900px) {
  .hero { height: auto; min-height: 100svh; }
  .hero__inner { flex: none; align-items: flex-start; padding-top: calc(var(--header-h) + 28px); padding-bottom: 12px; }
  .hero__copy { gap: 20px; }
  .hero__title { font-size: clamp(54px, 15vw, 88px); }
  .hero__stage { display: block; flex: 1; min-height: 70vw; }
  .hero__shade {
    background:
      linear-gradient(180deg, rgba(18, 19, 22, 0.7) 0%, rgba(18, 19, 22, 0.35) 45%, rgba(18, 19, 22, 0) 62%),
      linear-gradient(0deg, var(--asfalto) 0%, rgba(42, 44, 48, 0) 14%);
  }
  .hero__actions { flex-wrap: nowrap; gap: 10px; }
  .hero__actions .btn { flex: 1 1 0; padding: 0 14px; font-size: 19px; }
  .hide-sm { display: none; }
}
</style>
