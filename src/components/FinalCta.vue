<script setup>
import { waLink } from '../config'
import ArrowIcon from './ArrowIcon.vue'
</script>

<template>
  <section class="wrap-x final">
    <div class="final__inner">
      <span class="eyebrow">Fale agora com nossa equipe</span>
      <a class="final__phone" :href="waLink()" target="_blank" rel="noopener">(19) 99114<em>-</em>8000</a>
      <a class="btn btn--ink" :href="waLink()" target="_blank" rel="noopener">Solicitar pelo WhatsApp <ArrowIcon /></a>
    </div>
  </section>
</template>

<style scoped>
.final { padding-top: clamp(96px, 12vw, 180px); padding-bottom: clamp(96px, 12vw, 180px); text-align: center; }
.final__inner { max-width: 1100px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 32px; }
.eyebrow { letter-spacing: 5px; }
.final__phone {
  font-family: var(--serif); font-weight: 300; font-size: clamp(52px, 9vw, 140px);
  line-height: 1; letter-spacing: -2px; text-decoration: none;
}
.final__phone em { color: var(--wine); }
</style>
