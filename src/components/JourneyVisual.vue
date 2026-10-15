<script setup>
import AppIcon from './AppIcon.vue'
import BrandedImg from './BrandedImg.vue'
import LiveMap from './LiveMap.vue'

// O quadro de cada parada da viagem. "active" liga as animações daquela parada.
defineProps({
  kind: { type: String, required: true },
  active: { type: Boolean, default: false },
  time: { type: String, default: '' },
})
const base = import.meta.env.BASE_URL
</script>

<template>
  <div class="jv" :class="[`jv--${kind}`, { 'jv--on': active }]">
    <!-- 1. pedido pelo WhatsApp -->
    <div v-if="kind === 'pedido'" class="chat" aria-label="Exemplo de conversa pedindo um orçamento pelo WhatsApp">
      <div class="chat__head">
        <img class="chat__avatar" :src="base + 'brand/logo-160.webp'" alt="" width="40" height="40">
        <span><strong>AB Transportes</strong><small>online</small></span>
      </div>
      <div class="chat__body">
        <p class="bubble bubble--me" style="--i: 0">Bom dia! Preciso levar 3 caixas de Campinas para São Paulo hoje. Conseguem?<time class="num">08:12</time></p>
        <p class="bubble bubble--them" style="--i: 1">Bom dia! Conseguimos sim. Me passa os endereços, o peso e as medidas que eu já mando a proposta.<time class="num">08:13</time></p>
        <p class="bubble bubble--me" style="--i: 2">Combinado. Pode ser a coleta às 9h?<time class="num">08:20</time></p>
        <p class="bubble bubble--them" style="--i: 3">Fechado, 9h estamos aí.<time class="num">08:21</time></p>
      </div>
    </div>

    <!-- 2. coleta com foto -->
    <figure v-else-if="kind === 'coleta'" class="shot">
      <div class="shot__frame">
        <BrandedImg path="img/v3/coleta.webp" alt="Caixa lacrada sobre o balcão, fotografada pelo motorista no momento da coleta" loading="lazy" width="928" height="1152" />
        <span class="shot__corners" aria-hidden="true"></span>
        <span class="shot__flash" aria-hidden="true"></span>
      </div>
      <figcaption class="tag"><AppIcon name="camera" :size="18" /> Foto da coleta registrada às <span class="num">{{ time }}</span></figcaption>
    </figure>

    <!-- 3. em trânsito -->
    <LiveMap v-else-if="kind === 'transito'" :active="active" />

    <!-- 4. entrega com foto -->
    <figure v-else class="shot">
      <div class="shot__frame">
        <img :src="base + 'img/v3/entrega.webp'" alt="Motorista da AB entregando a caixa para quem recebe, na porta de um prédio comercial" loading="lazy" width="928" height="1152">
        <span class="shot__flash" aria-hidden="true"></span>
        <span class="stamp" aria-hidden="true"><AppIcon name="check" :size="26" /> Entregue <span class="num">{{ time }}</span></span>
      </div>
      <figcaption class="tag"><AppIcon name="camera" :size="18" /> Foto da entrega registrada às <span class="num">{{ time }}</span></figcaption>
    </figure>
  </div>
</template>

<style scoped>
.jv { position: relative; width: 100%; }

/* conversa */
.chat {
  background: #141518; border-radius: 22px; padding: 14px; max-width: 460px;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .08), 0 40px 80px -40px rgba(0, 0, 0, .9);
}
.chat__head { display: flex; gap: 12px; align-items: center; padding: 4px 6px 12px; border-bottom: 1px solid #26282C; }
.chat__head strong { display: block; font-size: 16px; }
.chat__head small { display: block; font-size: 13px; color: #4ADE80; }
.chat__avatar { width: 40px; height: 40px; border-radius: 50%; flex: none; }
.chat__body { display: grid; gap: 8px; padding: 14px 2px 4px; }
.bubble {
  position: relative; max-width: 86%; padding: 9px 13px 20px; border-radius: 16px; font-size: 16px; line-height: 1.4;
  opacity: 0; transform: translateY(10px) scale(.98);
  transition: opacity .4s ease, transform .45s var(--ease-out); transition-delay: calc(var(--i) * .45s);
}
.bubble time { position: absolute; right: 10px; bottom: 4px; font-size: 11px; opacity: .7; }
.bubble--me { justify-self: end; background: var(--vermelho); color: #fff; border-bottom-right-radius: 4px; }
.bubble--them { justify-self: start; background: #26282C; color: var(--tinta); border-bottom-left-radius: 4px; }
.jv--on .bubble { opacity: 1; transform: none; }

/* fotos */
.shot { max-width: 440px; }
.shot__frame { position: relative; border-radius: 18px; overflow: hidden; box-shadow: 0 40px 80px -40px rgba(0, 0, 0, .9); }
.shot__frame :deep(img), .shot__frame > img { width: 100%; height: auto; aspect-ratio: 4 / 5; object-fit: cover; transform: scale(1.06); transition: transform 1.2s var(--ease-out); }
.jv--on .shot__frame :deep(img), .jv--on .shot__frame > img { transform: none; }
.shot__flash { position: absolute; inset: 0; background: #fff; opacity: 0; pointer-events: none; }
.jv--on .shot__flash { animation: flash .8s ease-out .2s; }
@keyframes flash { 0% { opacity: 0 } 10% { opacity: .9 } 100% { opacity: 0 } }
.shot__corners {
  position: absolute; inset: 22px; pointer-events: none; opacity: 0; transform: scale(1.08);
  background:
    linear-gradient(#fff, #fff) top left / 30px 3px no-repeat, linear-gradient(#fff, #fff) top left / 3px 30px no-repeat,
    linear-gradient(#fff, #fff) top right / 30px 3px no-repeat, linear-gradient(#fff, #fff) top right / 3px 30px no-repeat,
    linear-gradient(#fff, #fff) bottom left / 30px 3px no-repeat, linear-gradient(#fff, #fff) bottom left / 3px 30px no-repeat,
    linear-gradient(#fff, #fff) bottom right / 30px 3px no-repeat, linear-gradient(#fff, #fff) bottom right / 3px 30px no-repeat;
  transition: opacity .4s ease, transform .6s var(--ease-out);
}
.jv--on .shot__corners { opacity: 1; transform: none; }
.tag {
  display: inline-flex; align-items: center; gap: 8px; margin-top: 14px;
  font-size: 15px; font-weight: 600; color: var(--tinta-2);
}
.tag :deep(svg) { color: var(--vermelho-claro); }
.stamp {
  position: absolute; top: 24px; right: 20px; display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 14px; border-radius: 8px; border: 3px solid var(--vermelho); color: var(--vermelho);
  background: rgba(255, 255, 255, .92);
  font-family: var(--font-display); font-weight: 800; font-style: italic; font-size: 26px; line-height: 1;
  transform: rotate(-9deg) scale(1.7); opacity: 0;
  transition: transform .45s cubic-bezier(.2, 1.6, .4, 1), opacity .2s ease; transition-delay: .6s;
}
.stamp .num { font-size: 18px; font-style: normal; font-weight: 700; }
.jv--on .stamp { transform: rotate(-9deg) scale(1); opacity: 1; }

@media (prefers-reduced-motion: reduce) {
  .bubble, .stamp, .shot__corners { opacity: 1; transform: none; transition: none; }
  .stamp { transform: rotate(-9deg); }
  .shot__frame :deep(img), .shot__frame > img { transform: none; }
}
</style>
