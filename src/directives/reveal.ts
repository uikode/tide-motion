import { animateElement } from "../core"
import type { RevealConfig } from "../types"

/**
 * SolidJS directive: use:reveal
 * IntersectionObserver-based reveal animation. Once by default.
 */
export function reveal(el: HTMLElement, config: () => RevealConfig): void {
  if (el == null) {
    throw new TypeError("reveal directive: el is required")
  }

  // SSR guard
  if (typeof IntersectionObserver === "undefined") return

  const cfg = config()
  if (!cfg) return

  const once = cfg.once !== false
  const threshold = cfg.threshold ?? 0.1
  const rootMargin = cfg.rootMargin ?? "0px"
  const duration = cfg.duration ?? 300
  const easing = cfg.easing ?? "ease-out"

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          try {
            animateElement(entry.target as HTMLElement, {
              keyframes: cfg.keyframes,
              duration,
              easing,
            })
          } catch {
            // Skip if element became disconnected
          }
          if (once) {
            observer.unobserve(entry.target)
          }
        }
      }
    },
    { threshold, rootMargin }
  )

  observer.observe(el)
}
