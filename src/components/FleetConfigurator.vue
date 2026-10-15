<script setup>
import { computed, ref } from 'vue'
import { waLink } from '../config'
import AppIcon from './AppIcon.vue'
import BrandedImg from './BrandedImg.vue'

// Frota: a pessoa escolhe o tamanho da carga e o veículo certo entra no galpão.
const fleet = [
  { key: 'moto', icon: 'moto', cargo: 'Envelope ou pacote pequeno', name: 'Moto', text: 'Documentos e volumes pequenos que precisam chegar rápido.', img: 'img/v3/frota-moto.webp', alt: 'Moto da AB com baú branco e a logo da empresa, parada no galpão' },
  { key: 'carro', icon: 'car', cargo: 'Algumas caixas', name: 'Carro', text: 'Várias caixas ou cargas que pedem mais espaço e proteção.', img: 'img/v3/frota-carro.webp', alt: 'Carro utilitário branco da AB com a logo na lateral, parado no galpão' },
  { key: 'caminhao', icon: 'truck', cargo: 'Paletes ou carga grande', name: 'Caminhão', text: 'Paletes e cargas maiores, em veículo exclusivo ou carga fracionada.', img: 'img/v3/frota-caminhao.webp', alt: 'Caminhão baú branco da AB com a logo no baú, parado no galpão' },
]
const sel = ref(0)
const dir = ref(1)
const current = computed(() => fleet[sel.value])

function choose(i) {
  if (i === sel.value) return
  dir.value = i > sel.value ? 1 : -1
  sel.value = i
}
function onKey(e) {
  const k = e.key
  if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'].includes(k)) return
  e.preventDefault()
  let i = sel.value
  if (k === 'ArrowRight' || k === 'ArrowDown') i = (i + 1) % fleet.length
  if (k === 'ArrowLeft' || k === 'ArrowUp') i = (i - 1 + fleet.length) % fleet.length
  if (k === 'Home') i = 0
  if (k === 'End') i = fleet.length - 1
  choose(i)
  e.currentTarget.querySelectorAll('[role="radio"]')[i].focus()
}
</script>

<template>
  <section id="frota" class="fleet section wrap">
    <div class="container">
      <div class="fleet__head">
        <h2 class="display h-lg">Qual veículo leva a sua carga?</h2>
        <p class="lead">Você informa o tamanho e o peso, e a gente indica o transporte ideal.</p>
      </div>

      <div class="fleet__body">
        <div class="picker" role="radiogroup" aria-label="Tamanho da carga" @keydown="onKey">
          <button
            v-for="(v, i) in fleet"
            :key="v.key"
            type="button"
            role="radio"
            class="picker__opt"
            :aria-checked="i === sel"
            :tabindex="i === sel ? 0 : -1"
            @click="choose(i)"
          >
            <span class="picker__icon"><AppIcon :name="v.icon" :size="24" /></span>
            <span class="picker__cargo">{{ v.cargo }}</span>
            <span class="picker__vehicle">{{ v.name }}</span>
          </button>
          <p class="picker__hint">
            Não sabe qual escolher? <a :href="waLink('Olá! Preciso de ajuda para escolher o veículo para a minha carga.')" target="_blank" rel="noopener">Conte o que precisa levar</a> e a gente indica.
          </p>
        </div>

        <figure class="bay" :style="{ '--dir': dir }">
          <div class="bay__frame">
            <BrandedImg
              v-for="(v, i) in fleet"
              :key="v.key"
              :path="v.img"
              :alt="v.alt"
              class="bay__img"
              :class="{ 'bay__img--on': i === sel }"
              :aria-hidden="i !== sel"
              width="1264"
              height="848"
              loading="lazy"
            />
          </div>
          <figcaption class="bay__caption" aria-live="polite">
            <Transition name="name" mode="out-in">
              <span :key="current.key" class="bay__name">{{ current.name }}</span>
            </Transition>
            <span class="bay__text">{{ current.text }}</span>
            <a class="btn btn--red bay__cta" href="#orcamento">Pedir orçamento</a>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fleet { padding-top: clamp(72px, 7vw, 104px); }
.fleet__head { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 20px 64px; align-items: end; margin-bottom: clamp(24px, 3vw, 40px); }
.fleet__head .lead { justify-self: end; }

.fleet__body { display: grid; grid-template-columns: minmax(250px, 0.42fr) minmax(0, 1fr); gap: clamp(20px, 3vw, 36px); align-items: stretch; }

/* escolha da carga */
.picker { display: grid; gap: 10px; align-content: start; }
.picker__opt {
  display: grid; grid-template-columns: 48px minmax(0, 1fr); grid-template-rows: auto auto; column-gap: 14px; align-items: center;
  text-align: left; padding: 16px 18px; border-radius: 12px; border: 0; cursor: pointer;
  background: var(--asfalto-2); color: var(--tinta-2); box-shadow: inset 0 0 0 1px var(--linha);
  transition: background-color .25s ease, box-shadow .25s ease, color .25s ease;
}
.picker__opt:hover { box-shadow: inset 0 0 0 1px var(--tinta-3); color: var(--tinta); }
.picker__icon {
  grid-row: 1 / 3; display: grid; place-items: center; width: 48px; height: 48px; border-radius: 50%;
  background: var(--asfalto-3); color: var(--tinta); transition: background-color .25s ease;
}
.picker__cargo { font-size: 16px; line-height: 1.25; }
.picker__vehicle { font-family: var(--font-display); font-weight: 700; font-size: 24px; line-height: 1.05; color: var(--tinta); }
.picker__opt[aria-checked='true'] { background: var(--tinta); color: #3A3B40; box-shadow: none; }
.picker__opt[aria-checked='true'] .picker__vehicle { color: #16171A; }
.picker__opt[aria-checked='true'] .picker__icon { background: var(--vermelho); color: #fff; }
.picker__hint { margin-top: 10px; font-size: 15px; color: var(--tinta-3); }
.picker__hint a { color: var(--tinta); font-weight: 600; }

/* galpão */
.bay { position: relative; display: grid; border-radius: 18px; overflow: hidden; background: #111214; isolation: isolate; }
.bay__frame { grid-area: 1 / 1; position: relative; aspect-ratio: 16 / 10; overflow: hidden; }
.bay__img {
  position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 62%;
  opacity: 0; transform: translateX(calc(var(--dir) * 7%)) scale(1.02);
  transition: opacity .55s ease, transform .9s var(--ease-out);
}
.bay__img--on { opacity: 1; transform: none; }
.bay__caption {
  grid-area: 1 / 1; align-self: end; position: relative; z-index: 1;
  display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: end; gap: 6px 24px;
  padding: clamp(18px, 3vw, 32px);
  background: linear-gradient(0deg, rgba(10, 10, 12, .9) 0%, rgba(10, 10, 12, .55) 55%, rgba(10, 10, 12, 0) 100%);
}
.bay__name {
  font-family: var(--font-display); font-weight: 800; font-style: italic; text-transform: uppercase;
  font-size: clamp(54px, 6.5vw, 96px); line-height: .82; color: #fff; letter-spacing: .005em;
}
.bay__text { color: #DCDBD6; max-width: 22em; padding-bottom: 6px; }
.bay__cta { white-space: nowrap; }

.name-enter-active, .name-leave-active { transition: transform .35s var(--ease-out), opacity .25s ease; }
.name-enter-from { transform: translateX(28px) skewX(-8deg); opacity: 0; }
.name-leave-to { transform: translateX(-28px) skewX(-8deg); opacity: 0; }

@media (max-width: 980px) {
  .fleet__head, .fleet__body { grid-template-columns: 1fr; }
  .fleet__head .lead { justify-self: start; }
  .picker { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .picker__hint { grid-column: 1 / -1; }
  .picker__opt { grid-template-columns: 1fr; grid-template-rows: auto; row-gap: 8px; justify-items: start; }
  .picker__icon { grid-row: auto; width: 40px; height: 40px; }
  .bay__caption { grid-template-columns: 1fr; }
  .bay__cta { justify-self: start; }
}
@media (max-width: 600px) {
  .picker__cargo { font-size: 14px; }
  .picker__vehicle { font-size: 21px; }
  .picker__opt { padding: 12px; }
  .bay { display: block; }
  .bay__caption { background: none; padding: 18px 0 0; }
  .bay__frame { border-radius: 14px; }
  .bay { background: none; border-radius: 0; overflow: visible; }
}
</style>
