import { onBeforeUnmount, onMounted, ref } from 'vue'

// Fica true uma única vez, quando o elemento entra na tela.
// Usado para disparar animações de rolagem só uma vez.
export function useInView(options = { threshold: 0.35 }) {
  const target = ref(null)
  const inView = ref(false)
  let observer

  onMounted(() => {
    if (!('IntersectionObserver' in window) || !target.value) {
      inView.value = true
      return
    }
    observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        inView.value = true
        observer.disconnect()
      }
    }, options)
    observer.observe(target.value)
  })

  onBeforeUnmount(() => observer && observer.disconnect())

  return { target, inView }
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
