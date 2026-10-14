<script setup>
// Ícones de traço, desenhados para a página. Herdam a cor do texto (currentColor).
defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 24 },
})

const paths = {
  moto: '<circle cx="5.5" cy="17" r="3"/><circle cx="18.5" cy="17" r="3"/><path d="M8.5 17h5l3-6.5h-4.5"/><path d="M5.5 17 9 10.5h4"/><path d="M15.5 6.5H18l1.5 4"/>',
  car: '<path d="M3 16.5v-3.2l2.2-5A2 2 0 0 1 7 7h10a2 2 0 0 1 1.8 1.3l2.2 5v3.2"/><path d="M3 13.5h18"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',
  truck: '<path d="M2 6.5h12v10H2z"/><path d="M14 9.5h4.2l3.3 3.6v3.4H14"/><circle cx="6" cy="17.5" r="2"/><circle cx="17.5" cy="17.5" r="2"/>',
  camera: '<path d="M4 8h3.2l1.8-2.6h6L16.8 8H20v11H4z"/><circle cx="12" cy="13.2" r="3.4"/>',
  pin: '<path d="M12 21s-7-6.1-7-11.4a7 7 0 0 1 14 0C19 14.9 12 21 12 21z"/><circle cx="12" cy="9.6" r="2.6"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  bolt: '<path d="M13 2.5 4.5 14H11l-1 7.5L18.5 10H12z"/>',
  shield: '<path d="M12 3 4.5 6v5.5c0 4.3 3.1 8 7.5 9.5 4.4-1.5 7.5-5.2 7.5-9.5V6z"/><path d="m8.6 12 2.4 2.4 4.4-4.6"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  // balão de conversa com o telefone completo dentro (ícone do WhatsApp)
  chat: '<path d="M20.5 11.6a8.4 8.4 0 0 1-12.4 7.4L3.5 20.4l1.5-4.4a8.4 8.4 0 1 1 15.5-4.4z"/><path transform="translate(7.3 6.9) scale(.4)" fill="currentColor" stroke="none" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  arrowLeft: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  box: '<path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z"/><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9"/>',
  user: '<circle cx="12" cy="8" r="3.8"/><path d="M4.5 20c.8-3.8 3.8-6 7.5-6s6.7 2.2 7.5 6"/>',
  flag: '<path d="M5.5 21V4M5.5 4.5h11l-2 4 2 4h-11"/>',
}
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
    v-html="paths[name]"
  />
</template>
