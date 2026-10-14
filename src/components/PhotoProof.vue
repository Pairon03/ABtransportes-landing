<script setup>
import { useInView } from '../composables/useInView'
import AppIcon from './AppIcon.vue'

const base = import.meta.env.BASE_URL
const { target, inView } = useInView({ threshold: 0.3 })
</script>

<template>
  <section id="fotos" ref="target" class="section wrap proof" :class="{ 'proof--in': inView }">
    <div class="container proof__grid">
      <div class="proof__copy">
        <h2 class="h-lg">Você vê o seu material na coleta e na entrega.</h2>
        <p class="lead">
          Registramos fotos nos dois pontos da rota. Mais transparência e segurança
          para a sua operação, e você informado durante todo o processo.
        </p>
        <ul class="proof__list">
          <li><AppIcon name="camera" :size="22" />Foto do material no momento da coleta</li>
          <li><AppIcon name="pin" :size="22" />Acompanhamento em tempo real por até 8 horas</li>
          <li><AppIcon name="check" :size="22" />Foto do material entregue no destino</li>
        </ul>
      </div>

      <div class="photos" aria-label="Exemplo de registro fotográfico">
        <figure class="photo photo--a">
          <img :src="base + 'img/coleta.webp'" alt="Caixa lacrada sobre o balcão de uma loja, fotografada na coleta" loading="lazy" width="928" height="1152">
          <figcaption><span class="dot dot--a">A</span>Na coleta</figcaption>
        </figure>
        <figure class="photo photo--b">
          <img :src="base + 'img/entrega.webp'" alt="Entregador passando a caixa para quem recebe, na porta de um escritório" loading="lazy" width="928" height="1152">
          <figcaption><span class="dot dot--b">B</span>Na entrega</figcaption>
        </figure>
        <p class="photos__note">Imagens ilustrativas</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.proof { background: var(--sky); overflow: hidden; }
.proof__grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr); gap: clamp(40px, 6vw, 96px); align-items: center; }
.proof__copy { display: flex; flex-direction: column; gap: 22px; }
.proof__list { list-style: none; margin: 8px 0 0; padding: 0; display: grid; gap: 14px; }
.proof__list li { display: flex; gap: 14px; align-items: center; font-weight: 550; }
.proof__list :deep(svg) { color: var(--cobalt); flex: none; }

.photos { position: relative; display: grid; grid-template-columns: 1fr 1fr; gap: 0; padding: 20px 0 36px; }
.photo {
  background: #fff; padding: 12px 12px 18px; border-radius: 14px;
  box-shadow: 0 2px 0 var(--line), 0 30px 50px -28px rgba(15, 30, 54, 0.45);
  transition: transform .9s var(--ease-out), opacity .9s ease;
  opacity: 0;
}
.photo img { width: 100%; aspect-ratio: 4 / 5; object-fit: cover; border-radius: 6px; }
.photo figcaption { display: flex; align-items: center; gap: 10px; padding-top: 12px; font-weight: 700; font-size: 17px; }
.photo--a { transform: translate(40px, 30px) rotate(0deg); z-index: 1; }
.photo--b { transform: translate(-40px, 30px) rotate(0deg); margin-top: 56px; z-index: 2; }

/* quando a seção aparece, as fotos "caem" na mesa, uma de cada lado */
.proof--in .photo { opacity: 1; }
.proof--in .photo--a { transform: translate(14px, 0) rotate(-4deg); }
.proof--in .photo--b { transform: translate(-14px, 0) rotate(3deg); transition-delay: .15s; }
.proof--in .photo:hover { transform: translate(0, -6px) rotate(0deg); z-index: 3; }

.dot { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; font-size: 14px; font-weight: 800; }
.dot--a { background: var(--paper); color: var(--cobalt); box-shadow: inset 0 0 0 3px var(--cobalt); }
.dot--b { background: var(--orange); color: var(--ink); }
.photos__note { position: absolute; right: 0; bottom: 0; font-size: 13px; color: var(--ink-3); }

@media (max-width: 900px) {
  .proof__grid { grid-template-columns: 1fr; }
}
</style>
