import { animateElement } from "../core"
import type { StaggerConfig } from "../types"

/**
 * SolidJS directive: use:stagger
 * Staggers animation of children with configurable delay and direction.
 */
export function stagger(el: HTMLElement, config: () => StaggerConfig): void {
  if (el == null) {
    throw new TypeError("stagger directive: el is required")
  }
  queueMicrotask(() => {
    const cfg = config()
    if (!cfg) return

    const children = Array.from(el.children) as HTMLElement[]
    if (children.length === 0) return

    const delay = cfg.delay ?? 50
    const from = cfg.from ?? "start"
    const duration = cfg.duration ?? 300
    const easing = cfg.easing ?? "ease-out"

    let ordered: HTMLElement[]
    switch (from) {
      case "end":
        ordered = [...children].reverse()
        break
      case "center": {
        const mid = Math.floor(children.length / 2)
        ordered = []
        for (let i = 0; i <= mid; i++) {
          if (children[mid - i]) ordered.push(children[mid - i])
          if (i !== 0 && children[mid + i]) ordered.push(children[mid + i])
        }
        break
      }
      default:
        ordered = children
    }

    ordered.forEach((child, i) => {
      try {
        animateElement(child, {
          keyframes: cfg.keyframes,
          duration,
          easing,
          delay: i * delay,
        })
      } catch {
        // Skip disconnected children
      }
    })
  })
}
