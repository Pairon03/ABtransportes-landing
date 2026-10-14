<script setup>
import { PHONE_LABEL, waLink } from '../config'
</script>

<template>
  <footer class="footer wrap">
    <div class="container footer__inner">
      <div>
        <p class="footer__name">Ponta a Ponta Brasil Express</p>
        <p class="footer__tagline">Agilidade no transporte. Transparência em cada entrega.</p>
      </div>
      <a :href="waLink()" target="_blank" rel="noopener">WhatsApp {{ PHONE_LABEL }}</a>
    </div>
  </footer>
</template>

<style scoped>
.footer { background: var(--sky); padding-top: 40px; padding-bottom: 48px; border-top: 1px solid var(--line); }
.footer__inner { display: flex; flex-wrap: wrap; gap: 16px 40px; justify-content: space-between; align-items: center; }
.footer__name { font-weight: 800; font-size: 18px; letter-spacing: -0.01em; }
.footer__tagline { color: var(--ink-2); }
.footer a { font-weight: 650; text-decoration: none; padding: 10px 0; }
.footer a:hover { text-decoration: underline; }
</style>
