<script setup>
import { PHONE_LABEL, waLink } from '../config'

const links = [
  { href: '#servico', label: 'O serviço' },
  { href: '#percurso', label: 'O percurso' },
  { href: '#concierge', label: 'Orçamento' },
]
</script>

<template>
  <header class="wrap-x">
    <div class="container nav">
      <nav class="nav__links" aria-label="Seções">
        <a v-for="link in links" :key="link.href" :href="link.href">{{ link.label }}</a>
      </nav>
      <a class="brand" href="#topo" aria-label="Ponta a Ponta Brasil Express, início">
        <span class="brand__name">Ponta a Ponta</span>
        <span class="brand__sub">Brasil Express</span>
      </a>
      <div class="nav__cta">
        <a class="link-phone" :href="waLink()" target="_blank" rel="noopener">{{ PHONE_LABEL }}</a>
      </div>
    </div>
  </header>
</template>

<style scoped>
.nav {
  padding: 26px 0; display: flex; flex-wrap: wrap; gap: 16px 32px;
  align-items: center; justify-content: space-between; border-bottom: 1px solid var(--line);
}
.nav__links { flex: 1 1 260px; display: flex; flex-wrap: wrap; gap: 4px 32px; }
.nav__links a {
  font-size: 12px; font-weight: 500; letter-spacing: 3px; text-transform: uppercase;
  text-decoration: none; padding: 12px 0; color: var(--ink-2);
}
.nav__links a:hover { color: var(--wine); }
.brand { flex: 0 0 auto; text-decoration: none; display: flex; flex-direction: column; align-items: center; line-height: 1; }
.brand__name { font-family: var(--serif); font-size: 30px; letter-spacing: 6px; text-transform: uppercase; }
.brand__sub { font-size: 10px; font-weight: 500; letter-spacing: 7px; text-transform: uppercase; color: var(--wine); margin-top: 6px; }
.nav__cta { flex: 1 1 260px; display: flex; justify-content: flex-end; }
.link-phone {
  font-size: 12px; font-weight: 500; letter-spacing: 3px; text-transform: uppercase;
  text-decoration: none; padding: 12px 0; border-bottom: 1px solid currentColor;
}

@media (max-width: 720px) {
  .nav { justify-content: center; }
  .brand { order: -1; flex: 1 1 100%; }
  .nav__links, .nav__cta { flex: 1 1 100%; justify-content: center; }
}
</style>
