<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { gsap, reducedMotion } from '../composables/motion'

// Faixa de asfalto com as promessas pintadas no chão, em letra alongada de sinalização.
// Ela anda conforme a rolagem, como se a página fosse a estrada.
const base = import.meta.env.BASE_URL
const words = ['Mesmo dia', 'Tempo real', 'Foto na coleta', 'Foto na entrega', 'Moto', 'Carro', 'Caminhão']
const surface = `linear-gradient(180deg, rgba(0, 0, 0, .45), rgba(0, 0, 0, 0) 22%, rgba(0, 0, 0, 0) 78%, rgba(0, 0, 0, .5)), url(${base}img/v3/asfalto.webp)`

const band = ref(null)
const track = ref(null)
let tween

onMounted(() => {
  if (reducedMotion()) return
  tween = gsap.fromTo(track.value, { xPercent: 0 }, {
    xPercent: -50,
    ease: 'none',
    scrollTrigger: { trigger: band.value, start: 'top bottom', end: 'bottom top', scrub: 0.4 },
  })
})
onBeforeUnmount(() => { tween && tween.scrollTrigger && tween.scrollTrigger.kill(); tween && tween.kill() })
</script>

<template>
  <div ref="band" class="road">
    <ul class="sr-only" aria-label="Destaques do serviço">
      <li v-for="w in words" :key="w">{{ w }}</li>
    </ul>
    <div class="road__surface" aria-hidden="true" :style="{ backgroundImage: surface }">
      <span class="road__edge road__edge--top"></span>
      <span class="road__edge road__edge--bottom"></span>
      <div ref="track" class="road__track">
        <template v-for="copy in 2" :key="copy">
          <template v-for="w in words" :key="`${copy}-${w}`">
            <span class="road__word">{{ w }}</span>
            <span class="road__dash"></span>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.road { position: relative; z-index: 2; }
.road__surface {
  position: relative; overflow: hidden;
  height: clamp(150px, 15vw, 210px);
  background-color: #232427;
  background-size: auto, auto 100%;
  background-repeat: no-repeat, repeat-x;
  box-shadow: 0 -1px 0 rgba(255, 255, 255, .05), 0 30px 60px -30px rgba(0, 0, 0, .7);
}
.road__edge { position: absolute; left: 0; right: 0; height: 5px; background: rgba(236, 234, 228, .85); }
.road__edge--top { top: 14%; }
.road__edge--bottom { bottom: 14%; }
.road__edge, .road__word, .road__dash {
  /* tinta gasta: um ruído fino recorta a pintura */
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' seed='4'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 -2.2 1.75'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E");
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' seed='4'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 -2.2 1.75'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E");
}
.road__track {
  position: absolute; top: 0; bottom: 0; left: 0; display: flex; align-items: center; gap: clamp(28px, 3.4vw, 54px);
  width: max-content; padding-left: 4vw; will-change: transform;
}
.road__word {
  display: inline-block; white-space: nowrap;
  font-family: var(--font-display); font-weight: 700; font-style: normal;
  font-size: clamp(30px, 3.4vw, 48px); line-height: 1; letter-spacing: .02em; text-transform: uppercase;
  color: #ECEAE4; transform: scaleY(1.75); transform-origin: 50% 50%;
}
.road__dash { flex: none; width: clamp(54px, 6vw, 90px); height: 7px; background: #ECEAE4; }

.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
</style>
