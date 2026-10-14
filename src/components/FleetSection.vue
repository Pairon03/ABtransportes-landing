<script setup>
import AppIcon from './AppIcon.vue'

const base = import.meta.env.BASE_URL

const fleet = [
  { key: 'moto', icon: 'moto', name: 'Moto', text: 'Para documentos e volumes pequenos que precisam chegar rápido.', img: 'img/moto.webp', alt: 'Entregador de colete laranja em uma moto com baú, parado numa esquina' },
  { key: 'carro', icon: 'car', name: 'Carro', text: 'Para várias caixas ou cargas que pedem mais espaço e proteção.', img: 'img/carro.webp', alt: 'Entregador colocando caixas no porta-malas de um carro branco' },
  { key: 'caminhao', icon: 'truck', name: 'Caminhão', text: 'Para paletes e cargas maiores, em veículo exclusivo ou carga fracionada.', img: 'img/caminhao.webp', alt: 'Operador levando um palete até um caminhão baú na doca' },
]
</script>

<template>
  <section id="frota" class="section wrap">
    <div class="container">
      <div class="head">
        <h2 class="h-lg">Moto, carro ou caminhão.</h2>
        <p class="lead">
          Você conta o tamanho e o peso da carga e a gente indica o transporte certo,
          em veículo exclusivo ou carga fracionada.
        </p>
      </div>

      <div class="fleet">
        <figure v-for="v in fleet" :key="v.key" class="vehicle" :class="`vehicle--${v.key}`">
          <img :src="base + v.img" :alt="v.alt" loading="lazy" width="1200" height="896">
          <figcaption>
            <span class="vehicle__name"><AppIcon :name="v.icon" :size="22" />{{ v.name }}</span>
            <span class="vehicle__text">{{ v.text }}</span>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>

<style scoped>
.head { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 24px 64px; align-items: end; margin-bottom: clamp(32px, 4vw, 52px); }
.head .lead { justify-self: end; }

.fleet {
  display: grid;
  grid-template-columns: 1.35fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 16px;
  min-height: 620px;
}
.vehicle {
  position: relative; overflow: hidden; border-radius: var(--r-lg); background: var(--sky);
  isolation: isolate;
}
.vehicle--moto { grid-row: 1 / span 2; }
.vehicle img { width: 100%; height: 100%; object-fit: cover; transition: transform .8s var(--ease-out); }
.vehicle:hover img { transform: scale(1.04); }
.vehicle figcaption {
  position: absolute; left: 14px; right: 14px; bottom: 14px;
  display: flex; flex-direction: column; gap: 4px;
  padding: 14px 18px; border-radius: var(--r-md);
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
}
.vehicle__name { display: flex; align-items: center; gap: 10px; font-weight: 750; font-size: 22px; letter-spacing: -0.02em; }
.vehicle__name :deep(svg) { color: var(--cobalt); }
.vehicle__text { color: var(--ink-2); font-size: 15px; line-height: 1.45; }

@media (max-width: 860px) {
  .head { grid-template-columns: 1fr; }
  .head .lead { justify-self: start; }
  .fleet { grid-template-columns: 1fr; grid-template-rows: none; min-height: 0; }
  .vehicle--moto { grid-row: auto; }
  .vehicle { aspect-ratio: 4 / 3.4; }
}
</style>
