<script setup>
const base = import.meta.env.BASE_URL
const year = new Date().getFullYear()
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
    <div class="container footer__credits">
      <span>© {{ year }} JBLog Express</span>
      <span>Desenvolvido por <strong>Praxis RM</strong></span>
    </div>
  </footer>
</template>

<style scoped>
.footer { background: var(--sky); padding-top: 40px; padding-bottom: 48px; border-top: 1px solid var(--line); }
.footer__inner { display: flex; align-items: center; gap: 20px; }
.footer__logo { width: 96px; height: 96px; border-radius: 50%; flex: none; }
.footer__name { font-weight: 800; font-size: 20px; letter-spacing: -0.01em; }
.footer__tagline { color: var(--ink-2); }
.footer__credits {
  display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px 24px;
  margin-top: 32px; padding-top: 20px; border-top: 1px solid var(--line);
  font-size: 14px; color: var(--ink-3);
}
.footer__credits strong { color: var(--ink); font-weight: 700; }
</style>
