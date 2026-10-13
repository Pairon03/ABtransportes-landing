import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base relativa: funciona tanto no GitHub Pages (/ponta-a-ponta-landing/)
// quanto em qualquer hospedagem na raiz do domínio.
export default defineConfig({
  base: './',
  plugins: [vue()],
})
