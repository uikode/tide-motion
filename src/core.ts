import type { AnimateConfig } from "./types"

/** WeakMap to track active animations per element */
const activeAnimations = new WeakMap<Element, Animation>()

/** Check if reduced motion is preferred (SSR-safe) */
function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false
  if (typeof window.matchMedia !== "function") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

/**
 * Animate an element using the Web Animations API.
 * Respects prefers-reduced-motion.
 * Returns the Animation object or null if skipped.
 */
export function animateElement(el: HTMLElement, config: AnimateConfig): Animation | null {
  if (el == null) {
    throw new TypeError("animateElement: el is required")
  }
  if (config == null) {
    throw new TypeError("animateElement: config is required")
  }
  if (!el.isConnected) {
    throw new TypeError("animateElement: element must be connected to the DOM")
  }
  if (config.duration !== undefined && config.duration < 0) {
    throw new RangeError("animateElement: duration must be non-negative")
  }

  // SSR guard
  if (typeof window === "undefined") return null

  // Respect prefers-reduced-motion
  if (prefersReducedMotion()) return null

  // Empty keyframes: nothing to animate
  if (!config.keyframes || config.keyframes.length === 0) return null

  const duration = config.duration ?? 300
  const easing = config.easing ?? "ease"
  const delay = config.delay ?? 0
  const fill = config.fill ?? "none"
  const iterations = config.iterations ?? 1
  const direction = config.direction ?? "normal"

  const animation = el.animate(config.keyframes, {
    duration,
    easing,
    delay,
    fill,
    iterations,
    direction,
  })

  activeAnimations.set(el, animation)
  return animation
}

/**
 * Cancel any running animation on an element.
 */
export function cancelAnimation(el: HTMLElement): void {
  if (el == null) {
    throw new TypeError("cancelAnimation: el is required")
  }
  const animation = activeAnimations.get(el)
  if (animation) {
    animation.cancel()
    activeAnimations.delete(el)
  }
}
