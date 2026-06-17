import { animateElement } from "../core"
import type { AnimateConfig } from "../types"

/**
 * SolidJS directive: use:animate
 * Runs animateElement on mount via queueMicrotask.
 */
export function animate(el: HTMLElement, config: () => AnimateConfig): void {
  if (el == null) {
    throw new TypeError("animate directive: el is required")
  }
  queueMicrotask(() => {
    const cfg = config()
    if (!cfg) return
    try {
      animateElement(el, cfg)
    } catch {
      // Silently skip if element disconnected between mount and microtask
    }
  })
}
