<script setup>
const base = import.meta.env.BASE_URL
</script>

<template>
  <footer class="footer wrap">
    <div class="container footer__inner">
      <img class="footer__logo" :src="base + 'brand/logo.webp'" alt="Logo da JBLog Express" width="96" height="96" loading="lazy">
      <div>
        <p class="footer__name">JBLog Express</p>
        <p class="footer__tagline">Agilidade no transporte. Transparência em cada entrega.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer { background: var(--sky); padding-top: 40px; padding-bottom: 48px; border-top: 1px solid var(--line); }
.footer__inner { display: flex; align-items: center; gap: 20px; }
.footer__logo { width: 96px; height: 96px; border-radius: 50%; flex: none; }
.footer__name { font-weight: 800; font-size: 20px; letter-spacing: -0.01em; }
.footer__tagline { color: var(--ink-2); }
</style>
