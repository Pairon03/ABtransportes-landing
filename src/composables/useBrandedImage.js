import { onBeforeUnmount, ref, watchEffect } from 'vue'
import { LOGO, LOGO_SIZE, PLACEMENTS } from '../brand'

const base = import.meta.env.BASE_URL
const cache = new Map()
let logoPromise

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

// Desenha a foto e, por cima, a logo em cada posição configurada em brand.js.
export async function composeBranded(path) {
  const spots = PLACEMENTS[path]
  if (!spots || !spots.length) return base + path
  if (cache.has(path)) return cache.get(path)
  const job = (async () => {
    logoPromise = logoPromise || loadImage(base + LOGO)
    const [photo, logo] = await Promise.all([loadImage(base + path), logoPromise])
    const canvas = document.createElement('canvas')
    canvas.width = photo.naturalWidth
    canvas.height = photo.naturalHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(photo, 0, 0)
    const { w, h } = LOGO_SIZE
    for (const s of spots) {
      const [x0, y0] = s.tl
      const [x1, y1] = s.tr
      const [x2, y2] = s.bl
      ctx.save()
      ctx.globalCompositeOperation = s.blend || 'source-over'
      ctx.globalAlpha = s.opacity ?? 0.95
      ctx.setTransform((x1 - x0) / w, (y1 - y0) / w, (x2 - x0) / h, (y2 - y0) / h, x0, y0)
      ctx.drawImage(logo, 0, 0, w, h)
      ctx.restore()
    }
    const blob = await new Promise((r) => canvas.toBlob(r, 'image/webp', 0.9))
    return blob ? URL.createObjectURL(blob) : base + path
  })().catch(() => base + path)
  cache.set(path, job)
  return job
}

// Uso no componente: const src = useBrandedImage('img/moto.webp')
// Mostra a foto original na hora e troca pela versão com logo assim que fica pronta.
export function useBrandedImage(pathGetter) {
  const get = typeof pathGetter === 'function' ? pathGetter : () => pathGetter
  const src = ref(base + get())
  let alive = true
  watchEffect(() => {
    const p = get()
    src.value = base + p
    composeBranded(p).then((url) => { if (alive && get() === p) src.value = url })
  })
  onBeforeUnmount(() => { alive = false })
  return src
}
