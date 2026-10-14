<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { PHONE_LABEL, waLink } from '../config'
import AppIcon from './AppIcon.vue'

// Aparece depois que a pessoa rola além do topo
const visible = ref(false)
const onScroll = () => { visible.value = window.scrollY > window.innerHeight * 0.6 }
onMounted(() => { onScroll(); window.addEventListener('scroll', onScroll, { passive: true }) })
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <a
    class="float"
    :class="{ 'float--on': visible }"
    :href="waLink()"
    target="_blank"
    rel="noopener"
    :aria-label="`Falar no WhatsApp: ${PHONE_LABEL}`"
    :tabindex="visible ? 0 : -1"
  >
    <AppIcon name="chat" :size="28" />
  </a>
</template>

<style scoped>
.float {
  position: fixed; right: 20px; bottom: 20px; z-index: 40;
  display: grid; place-items: center; width: 62px; height: 62px; border-radius: 50%;
  background: var(--cobalt); color: #fff; text-decoration: none;
  box-shadow: 0 14px 30px -10px rgba(31, 79, 255, 0.7);
  transform: translateY(100px) scale(.8); opacity: 0;
  transition: transform .4s var(--ease-out), opacity .3s ease, background-color .2s ease;
}
.float--on { transform: none; opacity: 1; }
.float:hover { background: var(--cobalt-2); }
</style>
