import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

// Movimento da página: GSAP (linhas do tempo e rolagem) + Lenis (rolagem suave no computador).
// Quem pediu "reduzir movimento" no sistema fica com a rolagem nativa e tudo parado.
gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

let lenis = null

export function startSmoothScroll() {
  if (lenis || reducedMotion()) return lenis
  lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)

  // links internos (#orcamento, #frota...) deslizam até a seção, descontando o cabeçalho
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href^="#"]')
    if (!a) return
    const id = a.getAttribute('href')
    if (id.length < 2) return
    const el = document.querySelector(id)
    if (!el) return
    e.preventDefault()
    lenis.scrollTo(el, {
      offset: -84,
      duration: 1.2,
      onComplete: () => {
        // leva o foco do teclado junto, como faria o link normal
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
        el.focus({ preventScroll: true })
      },
    })
    history.replaceState(null, '', id)
  })
  return lenis
}
