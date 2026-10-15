<script setup>
import { EMAIL, INSTAGRAM, INSTAGRAM_HANDLE, PHONE_LABEL, waLink } from '../config'
import AppIcon from './AppIcon.vue'

const base = import.meta.env.BASE_URL
const year = new Date().getFullYear()
const DEV_EMAIL = 'cv.korvex@gmail.com'
</script>

<template>
  <footer class="footer wrap">
    <div class="container footer__inner">
      <img class="footer__logo" :src="base + 'brand/logo.webp'" alt="Logo da AB Transportes" width="96" height="96" loading="lazy">
      <div class="footer__brand">
        <p class="footer__name">AB Transportes</p>
        <p class="footer__tagline">Agilidade no transporte. Transparência em cada entrega.</p>
        <p class="footer__contact">
          <a :href="waLink()" target="_blank" rel="noopener">{{ PHONE_LABEL }}</a>
          <a :href="`mailto:${EMAIL}`">{{ EMAIL }}</a>
        </p>
      </div>
      <a class="insta" :href="INSTAGRAM" target="_blank" rel="noopener" aria-label="Instagram da AB Transportes">
        <span class="insta__icon"><AppIcon name="instagram" :size="22" /></span>
        <span class="insta__text">
          <small>Siga no Instagram</small>
          <strong>{{ INSTAGRAM_HANDLE }}</strong>
        </span>
      </a>
    </div>
    <div class="container footer__credits">
      <span>© {{ year }} AB Transportes</span>
      <span class="footer__dev">
        <span>Desenvolvido por <strong>Korvex</strong></span>
        <a :href="`mailto:${DEV_EMAIL}`">{{ DEV_EMAIL }}</a>
      </span>
    </div>
  </footer>
</template>

<style scoped>
.footer { background: var(--noite); padding-top: 40px; padding-bottom: 48px; border-top: 1px solid rgba(255, 255, 255, .06); }
.footer__inner { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
.footer__brand { margin-right: auto; }
.footer__logo { width: 96px; height: 96px; border-radius: 50%; flex: none; }
.footer__name { font-family: var(--font-display); font-style: italic; font-weight: 800; font-size: 28px; line-height: 1; }
.footer__tagline { color: var(--ink-2); }
.footer__contact { display: flex; flex-wrap: wrap; gap: 4px 20px; margin-top: 8px; font-size: 16px; }
.footer__contact a { color: var(--tinta); text-decoration: none; font-weight: 600; overflow-wrap: anywhere; }
.footer__contact a:hover { color: var(--vermelho-claro); text-decoration: underline; }

.insta {
  display: inline-flex; align-items: center; gap: 12px; text-decoration: none; color: var(--ink);
  padding: 10px 18px 10px 10px; border-radius: 999px; border: 1px solid var(--line); background: var(--paper);
  transition: border-color .25s ease, transform .25s var(--ease-out);
}
.insta:hover { border-color: var(--orange); transform: translateY(-2px); }
.insta:focus-visible { outline: 3px solid var(--orange); outline-offset: 3px; }
.insta__icon {
  display: grid; place-items: center; width: 42px; height: 42px; border-radius: 50%; color: #fff;
  background: linear-gradient(135deg, #E3141B, #8A0B10);
}
.insta__text { display: grid; line-height: 1.2; }
.insta__text small { font-size: 12px; color: var(--ink-3); }
.insta__text strong { font-size: 16px; font-weight: 700; }

.footer__credits {
  display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px 24px;
  margin-top: 32px; padding-top: 20px; border-top: 1px solid var(--line);
  font-size: 14px; color: var(--ink-3);
}
.footer__credits strong { color: var(--ink); font-weight: 700; }
.footer__dev { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; text-align: right; }
.footer__dev a { color: var(--tinta-3); font-size: 13px; text-decoration: none; }
.footer__dev a:hover { color: var(--tinta); text-decoration: underline; }

@media (max-width: 640px) {
  .footer { padding-bottom: 104px; }
  .footer__brand { flex: 1 1 100%; }
  .footer__logo { width: 72px; height: 72px; }
  .footer__contact { flex-direction: column; }
  .footer__dev { align-items: flex-start; text-align: left; }
  .insta { width: 100%; }
}
</style>
