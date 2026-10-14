<script setup>
import AppIcon from './AppIcon.vue'

// Faixa que corre sem parar, como as listras de uma rodovia
const items = [
  { icon: 'bolt', text: 'Coleta e entrega no mesmo dia' },
  { icon: 'pin', text: 'Acompanhamento em tempo real por até 8 horas' },
  { icon: 'camera', text: 'Foto na coleta e na entrega' },
  { icon: 'moto', text: 'Moto' },
  { icon: 'car', text: 'Carro' },
  { icon: 'truck', text: 'Caminhão' },
  { icon: 'shield', text: 'Compromisso do início ao fim' },
]
</script>

<template>
  <div class="marquee" role="region" aria-label="Destaques do serviço">
    <div class="marquee__track">
      <ul class="marquee__list">
        <li v-for="it in items" :key="it.text"><AppIcon :name="it.icon" :size="22" />{{ it.text }}</li>
      </ul>
      <ul class="marquee__list" aria-hidden="true">
        <li v-for="it in items" :key="it.text"><AppIcon :name="it.icon" :size="22" />{{ it.text }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.marquee {
  background: var(--orange); color: #fff; overflow: hidden;
  transform: rotate(-1.2deg) scale(1.02); margin: -14px 0 0; position: relative; z-index: 2;
  box-shadow: 0 20px 40px -20px rgba(0,0,0,.6);
}
.marquee__track { display: flex; width: max-content; animation: slide 38s linear infinite; }
.marquee:hover .marquee__track { animation-play-state: paused; }
.marquee__list { display: flex; list-style: none; margin: 0; padding: 18px 0; }
.marquee__list li {
  display: inline-flex; align-items: center; gap: 12px; white-space: nowrap;
  font-size: clamp(17px, 1.6vw, 21px); font-weight: 700; padding: 0 28px;
}
.marquee__list li::after { content: ''; width: 34px; height: 4px; border-radius: 4px; background: rgba(255,255,255,.55); margin-left: 28px; }
@keyframes slide { to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) {
  .marquee__track { animation: none; }
}
</style>
