<script setup>
import { PHONE_LABEL, waLink } from '../config'
</script>

<template>
  <footer class="wrap-x footer">
    <div class="container footer__inner">
      <div class="footer__word" aria-hidden="true">Ponta a Ponta</div>
      <div class="footer__bar">
        <span class="footer__brand">Brasil Express</span>
        <span>Agilidade no transporte. Transparência em cada entrega.</span>
        <a :href="waLink()" target="_blank" rel="noopener">WhatsApp {{ PHONE_LABEL }}</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer { background: var(--ink); color: var(--dark-muted); padding-top: 56px; padding-bottom: 44px; }
.footer__inner { display: flex; flex-direction: column; gap: 40px; }
.footer__word {
  font-family: var(--serif); font-weight: 300; font-size: clamp(44px, 9.5vw, 148px);
  line-height: 0.9; letter-spacing: -2px; color: var(--bone); text-transform: uppercase;
}
.footer__bar {
  display: flex; flex-wrap: wrap; gap: 16px 40px; justify-content: space-between; align-items: baseline;
  border-top: 1px solid var(--dark-line); padding-top: 24px;
  font-size: 12px; letter-spacing: 2px; text-transform: uppercase;
}
.footer__brand { color: var(--rose); }
.footer__bar a { color: var(--bone); text-decoration: none; padding: 10px 0; }
.footer__bar a:hover { color: var(--rose); }
</style>
