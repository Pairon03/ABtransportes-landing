<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { PHONE_LABEL, waLink } from '../config'
import AppIcon from './AppIcon.vue'

const base = import.meta.env.BASE_URL

// Cabeçalho ganha fundo ao rolar a página
const scrolled = ref(false)
const onScroll = () => { scrolled.value = window.scrollY > 12 }
onMounted(() => { onScroll(); window.addEventListener('scroll', onScroll, { passive: true }) })
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header class="header wrap" :class="{ 'header--scrolled': scrolled }">
    <div class="container header__inner">
      <a class="logo" href="#topo" aria-label="AB Transportes, início">
        <img class="logo__mark" :src="base + 'brand/logo-160.webp'" alt="" width="52" height="52">
        <span class="logo__text">AB <span>Transportes</span></span>
      </a>

      <a class="btn btn--orange header__cta" :href="waLink()" target="_blank" rel="noopener">
        <AppIcon name="chat" :size="20" />
        <span class="header__cta-label">{{ PHONE_LABEL }}</span>
      </a>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky; top: 0; z-index: 30;
  transition: background-color .3s ease, box-shadow .3s ease;
}
.header--scrolled {
  background: rgba(43, 45, 49, 0.9);
  backdrop-filter: saturate(160%) blur(12px);
  -webkit-backdrop-filter: saturate(160%) blur(12px);
  box-shadow: 0 1px 0 var(--line);
}
.header__inner { display: flex; align-items: center; gap: 24px; min-height: 76px; }
.logo { display: flex; align-items: center; gap: 12px; text-decoration: none; color: var(--ink); margin-right: auto; }
.logo__mark { width: 52px; height: 52px; flex: none; border-radius: 50%; }
.logo__text { font-weight: 800; font-size: 21px; letter-spacing: -0.02em; line-height: 1.05; }
.logo__text span { display: block; font-weight: 600; font-size: 12px; color: #FF5A60; letter-spacing: .28em; text-transform: uppercase; }
.header__cta { min-height: 46px; padding: 0 18px; font-size: 15px; box-shadow: 0 4px 0 var(--orange-2); }

@media (max-width: 460px) {
  .header__cta-label { display: none; }
  .header__cta { width: 46px; padding: 0; }
  .header__cta::after { content: 'WhatsApp'; position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
}
</style>
