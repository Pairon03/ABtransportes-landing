import { onBeforeUnmount, ref, watchEffect } from 'vue'
import { LOGO, LOGO_SIZE, PLACEMENTS } from '../brand'

const base = import.meta.env.BASE_URL
const cache = new Map()
let logoPromise

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

// Homografia do quadrado unitário para um quadrilátero (Heckbert).
// q = [tl, tr, br, bl]. Devolve (u, v) -> [x, y].
function squareToQuad(q) {
  const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q
  const sx = x0 - x1 + x2 - x3
  const sy = y0 - y1 + y2 - y3
  let a, b, c, d, e, f, g, h
  if (Math.abs(sx) < 1e-6 && Math.abs(sy) < 1e-6) {
    a = x1 - x0; b = x2 - x1; c = x0
    d = y1 - y0; e = y2 - y1; f = y0
    g = 0; h = 0
  } else {
    const dx1 = x1 - x2, dx2 = x3 - x2, dy1 = y1 - y2, dy2 = y3 - y2
    const den = dx1 * dy2 - dx2 * dy1
    g = (sx * dy2 - dx2 * sy) / den
    h = (dx1 * sy - sx * dy1) / den
    a = x1 - x0 + g * x1; b = x3 - x0 + h * x3; c = x0
    d = y1 - y0 + g * y1; e = y3 - y0 + h * y3; f = y0
  }
  return (u, v) => {
    const w = g * u + h * v + 1
    return [(a * u + b * v + c) / w, (d * u + e * v + f) / w]
  }
}

// Desenha um triângulo da imagem (s0, s1, s2) no destino (d0, d1, d2) com transformação afim.
function drawTriangle(ctx, img, s, d, size) {
  const [[u0, v0], [u1, v1], [u2, v2]] = s
  const [[x0, y0], [x1, y1], [x2, y2]] = d
  // recorte levemente ampliado para não sobrar fresta entre os triângulos
  const cx = (x0 + x1 + x2) / 3, cy = (y0 + y1 + y2) / 3
  const grow = (x, y) => {
    const dx = x - cx, dy = y - cy, len = Math.hypot(dx, dy) || 1
    return [x + (dx / len) * 0.7, y + (dy / len) * 0.7]
  }
  const den = u0 * (v1 - v2) + u1 * (v2 - v0) + u2 * (v0 - v1)
  if (!den) return
  const A = (x0 * (v1 - v2) + x1 * (v2 - v0) + x2 * (v0 - v1)) / den
  const C = (x0 * (u2 - u1) + x1 * (u0 - u2) + x2 * (u1 - u0)) / den
  const E = (x0 * (u1 * v2 - u2 * v1) + x1 * (u2 * v0 - u0 * v2) + x2 * (u0 * v1 - u1 * v0)) / den
  const B = (y0 * (v1 - v2) + y1 * (v2 - v0) + y2 * (v0 - v1)) / den
  const D = (y0 * (u2 - u1) + y1 * (u0 - u2) + y2 * (u1 - u0)) / den
  const F = (y0 * (u1 * v2 - u2 * v1) + y1 * (u2 * v0 - u0 * v2) + y2 * (u0 * v1 - u1 * v0)) / den
  ctx.save()
  ctx.beginPath()
  const [a0, a1, a2] = [grow(x0, y0), grow(x1, y1), grow(x2, y2)]
  ctx.moveTo(a0[0], a0[1]); ctx.lineTo(a1[0], a1[1]); ctx.lineTo(a2[0], a2[1])
  ctx.closePath()
  ctx.clip()
  ctx.transform(A, B, C, D, E, F)
  ctx.drawImage(img, 0, 0, size.w, size.h)
  ctx.restore()
}

// Logo em perspectiva: divide em uma malha de triângulos e desenha cada um.
function drawLogoQuad(ctx, logo, quad, { w, h }, steps = 10) {
  const map = squareToQuad(quad)
  const xs = quad.map((p) => p[0]), ys = quad.map((p) => p[1])
  const bx = Math.floor(Math.min(...xs)) - 2, by = Math.floor(Math.min(...ys)) - 2
  const bw = Math.ceil(Math.max(...xs)) - bx + 4, bh = Math.ceil(Math.max(...ys)) - by + 4
  const off = document.createElement('canvas')
  off.width = bw; off.height = bh
  const o = off.getContext('2d')
  o.translate(-bx, -by)
  for (let i = 0; i < steps; i++) {
    for (let j = 0; j < steps; j++) {
      const u0 = i / steps, u1 = (i + 1) / steps, v0 = j / steps, v1 = (j + 1) / steps
      const p00 = map(u0, v0), p10 = map(u1, v0), p11 = map(u1, v1), p01 = map(u0, v1)
      const s00 = [u0 * w, v0 * h], s10 = [u1 * w, v0 * h], s11 = [u1 * w, v1 * h], s01 = [u0 * w, v1 * h]
      drawTriangle(o, logo, [s00, s10, s11], [p00, p10, p11], { w, h })
      drawTriangle(o, logo, [s00, s11, s01], [p00, p11, p01], { w, h })
    }
  }
  return { canvas: off, x: bx, y: by }
}

const canvasCache = new Map()

// Desenha a foto e, por cima, a logo em cada posição configurada em brand.js. Devolve o canvas.
export function composeBrandedCanvas(path) {
  if (canvasCache.has(path)) return canvasCache.get(path)
  const job = (async () => {
    const spots = PLACEMENTS[path] || []
    logoPromise = logoPromise || loadImage(base + LOGO)
    const [photo, logo] = await Promise.all([loadImage(base + path), logoPromise])
    const canvas = document.createElement('canvas')
    canvas.width = photo.naturalWidth
    canvas.height = photo.naturalHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(photo, 0, 0)
    const { w, h } = LOGO_SIZE
    for (const s of spots) {
      ctx.save()
      ctx.globalCompositeOperation = s.blend || 'source-over'
      ctx.globalAlpha = s.opacity ?? 0.95
      if (s.quad) {
        const piece = drawLogoQuad(ctx, logo, s.quad, LOGO_SIZE)
        ctx.drawImage(piece.canvas, piece.x, piece.y)
      } else {
        // formato antigo: três cantos (tl, tr, bl), sem perspectiva
        const [x0, y0] = s.tl
        const [x1, y1] = s.tr
        const [x2, y2] = s.bl
        ctx.setTransform((x1 - x0) / w, (y1 - y0) / w, (x2 - x0) / h, (y2 - y0) / h, x0, y0)
        ctx.drawImage(logo, 0, 0, w, h)
      }
      ctx.restore()
    }
    return canvas
  })()
  canvasCache.set(path, job)
  return job
}

// Mesma composição, como endereço de imagem (blob) para usar em <img>.
export async function composeBranded(path) {
  const spots = PLACEMENTS[path]
  if (!spots || !spots.length) return base + path
  if (cache.has(path)) return cache.get(path)
  const job = (async () => {
    const canvas = await composeBrandedCanvas(path)
    const blob = await new Promise((r) => canvas.toBlob(r, 'image/webp', 0.92))
    return blob ? URL.createObjectURL(blob) : base + path
  })().catch(() => base + path)
  cache.set(path, job)
  return job
}

// Uso no componente: const src = useBrandedImage('img/v3/frota-moto.webp')
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
