<script setup>
import { ref } from 'vue'
import AppIcon from './AppIcon.vue'

// Frota em painéis: o painel escolhido se expande e mostra a descrição.
const base = import.meta.env.BASE_URL
const fleet = [
  { key: 'moto', icon: 'moto', name: 'Moto', text: 'Documentos e volumes pequenos que precisam chegar rápido.', img: 'img/moto.webp' },
  { key: 'carro', icon: 'car', name: 'Carro', text: 'Várias caixas ou cargas que pedem mais espaço e proteção.', img: 'img/carro.webp' },
  { key: 'caminhao', icon: 'truck', name: 'Caminhão', text: 'Paletes e cargas maiores, em veículo exclusivo ou carga fracionada.', img: 'img/caminhao.webp' },
]
const open = ref(0)
</script>

<template>
  <section id="frota" class="section wrap fleet">
    <div class="container">
      <div class="fleet__head">
        <h2 class="h-lg">O veículo certo para cada carga.</h2>
        <p class="lead">Você informa o tamanho e o peso, e a gente indica o transporte ideal.</p>
      </div>

      <div class="panels">
        <button
          v-for="(v, i) in fleet"
          :key="v.key"
          type="button"
          class="panel"
          :class="{ 'panel--open': open === i }"
          :aria-expanded="open === i"
          @click="open = i"
          @mouseenter="open = i"
          @focus="open = i"
        >
          <img :src="base + v.img" alt="" loading="lazy" width="1200" height="896">
          <span class="panel__shade" aria-hidden="true"></span>
          <span class="panel__body">
            <span class="panel__name"><AppIcon :name="v.icon" :size="24" />{{ v.name }}</span>
            <span class="panel__text">{{ v.text }}</span>
          </span>
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.fleet__head { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 20px 64px; align-items: end; margin-bottom: clamp(28px, 4vw, 48px); }
.fleet__head .lead { justify-self: end; }
.panels { display: flex; gap: 14px; height: 520px; }
.panel {
  all: unset; box-sizing: border-box; cursor: pointer; position: relative; overflow: hidden; border-radius: var(--r-lg);
  flex: 1 1 0; min-width: 0; transition: flex-grow .7s var(--ease-out); isolation: isolate;
}
.panel:focus-visible { outline: 3px solid var(--orange); outline-offset: 4px; }
.panel--open { flex-grow: 3.2; }
.panel img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: -2; transform: scale(1.08); transition: transform 1.2s var(--ease-out), filter .6s ease; filter: grayscale(.6) brightness(.7); }
.panel--open img { transform: scale(1); filter: none; }
.panel__shade { position: absolute; inset: 0; z-index: -1; background: linear-gradient(0deg, rgba(20,21,24,.92) 0%, rgba(20,21,24,.2) 55%, rgba(20,21,24,0) 100%); }
.panel__body { position: absolute; left: 0; right: 0; bottom: 0; padding: 24px; display: grid; gap: 8px; color: #fff; }
.panel__name { display: flex; align-items: center; gap: 12px; font-size: clamp(22px, 2.2vw, 30px); font-weight: 800; letter-spacing: -0.02em; white-space: nowrap; }
.panel__name :deep(svg) { color: var(--orange); flex: none; }
.panel__text { color: #D4D4DA; font-size: 16px; line-height: 1.5; max-width: 26em; opacity: 0; transform: translateY(10px); transition: opacity .4s ease, transform .5s var(--ease-out); }
.panel--open .panel__text { opacity: 1; transform: none; transition-delay: .25s; }

@media (max-width: 860px) {
  .fleet__head { grid-template-columns: 1fr; }
  .fleet__head .lead { justify-self: start; }
  .panels { flex-direction: column; height: auto; }
  .panel { flex: none; height: 300px; cursor: default; }
  .panel img { filter: none; transform: none; }
  .panel__text { opacity: 1; transform: none; }
}
</style>
