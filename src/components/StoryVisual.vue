<script setup>
import AppIcon from './AppIcon.vue'
import RouteAnimation from './RouteAnimation.vue'

// O quadro visual de cada etapa da jornada. "active" liga as animações daquela etapa.
defineProps({
  kind: { type: String, required: true },
  active: { type: Boolean, default: false },
})
const base = import.meta.env.BASE_URL
</script>

<template>
  <div class="visual" :class="[`visual--${kind}`, { 'visual--on': active }]">
    <!-- 1. pedido pelo WhatsApp -->
    <div v-if="kind === 'pedido'" class="chat" aria-label="Exemplo de mensagem de orçamento pelo WhatsApp">
      <div class="chat__head">
        <span class="chat__avatar"><AppIcon name="chat" :size="18" /></span>
        <span><strong>Ponta a Ponta</strong><small>online</small></span>
      </div>
      <div class="chat__body">
        <p class="bubble bubble--me" style="--i: 0">Olá! Gostaria de solicitar um orçamento de transporte.</p>
        <p class="bubble bubble--me bubble--data" style="--i: 1">
          <span><b>Coleta:</b> Campinas/SP</span>
          <span><b>Entrega:</b> São Paulo/SP</span>
          <span><b>Carga:</b> 3 volumes, 25 kg</span>
        </p>
        <p class="bubble bubble--them" style="--i: 2">Recebido! Já estamos preparando sua proposta.</p>
      </div>
      <p class="visual__note">Exemplo ilustrativo</p>
    </div>

    <!-- 2. coleta com foto -->
    <figure v-else-if="kind === 'coleta'" class="shot">
      <img :src="base + 'img/coleta.webp'" alt="Caixa lacrada sobre o balcão, fotografada no momento da coleta" loading="lazy" width="928" height="1152">
      <span class="shot__flash" aria-hidden="true"></span>
      <span class="shot__frame" aria-hidden="true"></span>
      <figcaption class="badge"><AppIcon name="camera" :size="18" /> Foto da coleta registrada</figcaption>
    </figure>

    <!-- 3. em trânsito -->
    <div v-else-if="kind === 'transito'" class="route-wrap">
      <RouteAnimation />
    </div>

    <!-- 4. entrega com foto -->
    <figure v-else class="shot">
      <img :src="base + 'img/entrega.webp'" alt="Entregador passando a caixa para quem recebe, na porta de um escritório" loading="lazy" width="928" height="1152">
      <span class="shot__flash" aria-hidden="true"></span>
      <span class="stamp" aria-hidden="true"><AppIcon name="check" :size="30" /> Entregue</span>
      <figcaption class="badge"><AppIcon name="camera" :size="18" /> Foto da entrega registrada</figcaption>
    </figure>
  </div>
</template>

<style scoped>
.visual { position: relative; width: 100%; }
.visual__note { margin-top: 10px; font-size: 13px; color: var(--ink-3); text-align: center; }

/* conversa */
.chat { background: #0F1012; border-radius: 28px; padding: 16px; box-shadow: inset 0 0 0 1px var(--line), 0 40px 80px -40px rgba(0,0,0,.8); max-width: 420px; margin: 0 auto; }
.chat__head { display: flex; gap: 12px; align-items: center; padding: 4px 6px 14px; border-bottom: 1px solid #26282C; }
.chat__head strong { display: block; font-size: 15px; }
.chat__head small { display: block; font-size: 12px; color: #4ADE80; }
.chat__avatar { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 50%; background: var(--orange); color: #fff; }
.chat__body { display: grid; gap: 10px; padding: 16px 4px 6px; }
.bubble {
  max-width: 86%; padding: 10px 14px; border-radius: 18px; font-size: 15px; line-height: 1.45;
  opacity: 0; transform: translateY(12px) scale(.98);
  transition: opacity .45s ease, transform .45s var(--ease-out); transition-delay: calc(var(--i) * .55s);
}
.bubble--me { justify-self: end; background: var(--orange); color: #fff; border-bottom-right-radius: 6px; }
.bubble--them { justify-self: start; background: #26282C; color: var(--ink); border-bottom-left-radius: 6px; }
.bubble--data { display: grid; gap: 2px; }
.visual--on .bubble { opacity: 1; transform: none; }

/* fotos */
.shot { position: relative; margin: 0 auto; max-width: 420px; border-radius: 22px; overflow: hidden; background: #fff; padding: 12px 12px 64px; box-shadow: 0 40px 80px -40px rgba(0,0,0,.9); transform: rotate(-2deg); transition: transform .8s var(--ease-out); }
.visual--on .shot { transform: rotate(0); }
.shot img { width: 100%; height: auto; aspect-ratio: 4 / 5; object-fit: cover; border-radius: 12px; }
.shot__flash { position: absolute; inset: 0; background: #fff; opacity: 0; pointer-events: none; }
.visual--on .shot__flash { animation: flash .9s ease-out .25s; }
@keyframes flash { 0% { opacity: 0 } 12% { opacity: .95 } 100% { opacity: 0 } }
.shot__frame { position: absolute; inset: 34px 34px 86px; pointer-events: none; opacity: 0;
  background:
    linear-gradient(#fff, #fff) top left / 26px 3px no-repeat, linear-gradient(#fff, #fff) top left / 3px 26px no-repeat,
    linear-gradient(#fff, #fff) top right / 26px 3px no-repeat, linear-gradient(#fff, #fff) top right / 3px 26px no-repeat,
    linear-gradient(#fff, #fff) bottom left / 26px 3px no-repeat, linear-gradient(#fff, #fff) bottom left / 3px 26px no-repeat,
    linear-gradient(#fff, #fff) bottom right / 26px 3px no-repeat, linear-gradient(#fff, #fff) bottom right / 3px 26px no-repeat;
  transform: scale(1.1); transition: opacity .4s ease, transform .6s var(--ease-out);
}
.visual--on .shot__frame { opacity: 1; transform: none; }
.badge { position: absolute; left: 12px; right: 12px; bottom: 14px; display: flex; gap: 10px; align-items: center; justify-content: center; color: #141518; font-weight: 700; font-size: 16px; }
.badge :deep(svg) { color: var(--orange); }
.stamp {
  position: absolute; top: 40px; right: 34px; display: inline-flex; align-items: center; gap: 6px;
  padding: 10px 16px; border-radius: 12px; border: 3px solid var(--orange); color: var(--orange);
  background: rgba(255,255,255,.9); font-weight: 800; font-size: 22px; letter-spacing: -0.01em;
  transform: rotate(-10deg) scale(1.8); opacity: 0;
  transition: transform .45s cubic-bezier(.2, 1.6, .4, 1), opacity .2s ease; transition-delay: .7s;
}
.visual--on .stamp { transform: rotate(-10deg) scale(1); opacity: 1; }

.route-wrap { max-width: 520px; margin: 0 auto; }

@media (prefers-reduced-motion: reduce) {
  .bubble, .stamp, .shot__frame { opacity: 1; transform: none; transition: none; }
  .shot { transform: none; }
}
</style>
