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

const links = [
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#frota', label: 'Frota' },
  { href: '#orcamento', label: 'Orçamento' },
]
</script>

<template>
  <header class="header wrap" :class="{ 'header--scrolled': scrolled }">
    <div class="container header__inner">
      <a class="logo" href="#topo" aria-label="AB Transportes, início">
        <img class="logo__mark" :src="base + 'brand/logo-160.webp'" alt="" width="52" height="52">
        <span class="logo__text">AB <span>Transportes</span></span>
      </a>

      <nav class="nav" aria-label="Seções">
        <a v-for="l in links" :key="l.href" :href="l.href">{{ l.label }}</a>
      </nav>

      <a class="btn btn--red header__cta" :href="waLink()" target="_blank" rel="noopener">
        <AppIcon name="chat" :size="20" />
        <span class="header__cta-label">{{ PHONE_LABEL }}</span>
      </a>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky; top: 0; z-index: 30; height: var(--header-h);
  transition: background-color .3s ease, box-shadow .3s ease;
}
.header--scrolled {
  background: rgba(28, 29, 32, 0.88);
  backdrop-filter: saturate(160%) blur(12px);
  -webkit-backdrop-filter: saturate(160%) blur(12px);
  box-shadow: 0 1px 0 rgba(255, 255, 255, .08);
}
.header__inner { display: flex; align-items: center; gap: 28px; height: 100%; }
.logo { display: flex; align-items: center; gap: 12px; text-decoration: none; color: var(--tinta); margin-right: auto; }
.logo__mark { width: 50px; height: 50px; flex: none; border-radius: 50%; }
.logo__text {
  font-family: var(--font-display); font-style: italic; font-weight: 800;
  font-size: 26px; line-height: .9; letter-spacing: 0;
}
.logo__text span {
  display: block; font-weight: 700; font-size: 13px; color: var(--vermelho-claro);
  letter-spacing: .3em; text-transform: uppercase; font-style: italic;
}
.nav { display: flex; gap: 26px; }
.nav a {
  color: #E2E1DC; text-decoration: none; font-size: 16px; font-weight: 500;
  padding: 6px 0; background: linear-gradient(var(--vermelho), var(--vermelho)) 0 100% / 0 2px no-repeat;
  transition: background-size .3s var(--ease-out), color .2s ease;
}
.nav a:hover { color: #fff; background-size: 100% 2px; }
.header__cta { min-height: 46px; padding: 0 18px; font-size: 18px; box-shadow: 0 4px 0 var(--vinho); }

@media (max-width: 980px) {
  .nav { display: none; }
}
@media (max-width: 460px) {
  .header__cta-label { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
  .header__cta { width: 46px; padding: 0; }
}
</style>
