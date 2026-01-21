import Lenis from 'lenis'

let lenisInstance = null

export function useLenis() {
  const isInitialized = ref(false)

  function init() {
    if (import.meta.server || lenisInstance) return

    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    })

    // Jelly scroll effect
    let currentVelocity = 0
    let targetVelocity = 0

    lenisInstance.on('scroll', ({ velocity }) => {
      targetVelocity = velocity
    })

    function applyJellyEffect() {
      // Query sections each frame (they may not exist on init)
      const sections = document.querySelectorAll('.jelly-section')

      // Smooth interpolation for velocity
      currentVelocity += (targetVelocity - currentVelocity) * 0.15

      // Decay target velocity when not scrolling
      targetVelocity *= 0.9

      // Calculate squish factor (more noticeable effect)
      const squishFactor = Math.max(0.92, Math.min(1.00, 1 - currentVelocity * 0.002))

      sections.forEach((section) => {
        section.style.transform = `scaleY(${squishFactor})`
      })

      requestAnimationFrame(applyJellyEffect)
    }

    function raf(time) {
      lenisInstance?.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
    requestAnimationFrame(applyJellyEffect)

    isInitialized.value = true
  }

  function destroy() {
    if (lenisInstance) {
      lenisInstance.destroy()
      lenisInstance = null
      isInitialized.value = false
    }
  }

  return {
    init,
    destroy,
    isInitialized,
  }
}
