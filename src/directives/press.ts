import type { PressConfig } from "../types"

/**
 * SolidJS directive: use:press
 * Scales element on pointerdown, restores on pointerup/leave.
 */
export function press(el: HTMLElement, config: () => PressConfig): void {
  if (el == null) {
    throw new TypeError("press directive: el is required")
  }

  // SSR guard
  if (typeof document === "undefined") return

  const cfg = config()
  if (!cfg) return

  const scale = cfg.scale ?? 0.95
  const duration = cfg.duration ?? 100
  const easing = cfg.easing ?? "ease-out"

  const scaleDown = () => {
    el.animate(
      [{ transform: `scale(${scale})` }],
      { duration, easing, fill: "forwards" }
    )
  }

  const scaleUp = () => {
    el.animate(
      [{ transform: "scale(1)" }],
      { duration, easing, fill: "forwards" }
    )
  }

  el.addEventListener("pointerdown", scaleDown)
  el.addEventListener("pointerup", scaleUp)
  el.addEventListener("pointerleave", scaleUp)
}
