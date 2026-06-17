// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { animateElement, cancelAnimation } from "../src/core"
import type { AnimateConfig } from "../src/types"

// Mock Web Animations API
function mockElement(connected = true): HTMLElement {
  const el = document.createElement("div")
  Object.defineProperty(el, "isConnected", { value: connected })
  const mockAnimation = {
    cancel: vi.fn(),
    finished: Promise.resolve(),
    playState: "running" as string,
  }
  el.animate = vi.fn().mockReturnValue(mockAnimation)
  return el
}

describe("animateElement", () => {
  beforeEach(() => {
    // Default: no reduced motion
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockReturnValue({ matches: false }),
    })
  })

  it("throws TypeError if el is null", () => {
    const config: AnimateConfig = { keyframes: [{ opacity: "0" }, { opacity: "1" }] }
    expect(() => animateElement(null as any, config)).toThrow(TypeError)
  })

  it("throws TypeError if el is undefined", () => {
    const config: AnimateConfig = { keyframes: [{ opacity: "0" }, { opacity: "1" }] }
    expect(() => animateElement(undefined as any, config)).toThrow(TypeError)
  })

  it("throws TypeError if config is not provided", () => {
    const el = mockElement()
    expect(() => animateElement(el, undefined as any)).toThrow(TypeError)
  })

  it("throws TypeError if element is not connected", () => {
    const el = mockElement(false)
    const config: AnimateConfig = { keyframes: [{ opacity: "0" }, { opacity: "1" }] }
    expect(() => animateElement(el, config)).toThrow(TypeError)
  })

  it("throws RangeError if duration is negative", () => {
    const el = mockElement()
    const config: AnimateConfig = { keyframes: [{ opacity: "0" }, { opacity: "1" }], duration: -100 }
    expect(() => animateElement(el, config)).toThrow(RangeError)
  })

  it("allows duration of 0", () => {
    const el = mockElement()
    const config: AnimateConfig = { keyframes: [{ opacity: "0" }, { opacity: "1" }], duration: 0 }
    expect(() => animateElement(el, config)).not.toThrow()
  })

  it("calls el.animate with keyframes and options", () => {
    const el = mockElement()
    const config: AnimateConfig = {
      keyframes: [{ opacity: "0" }, { opacity: "1" }],
      duration: 300,
      easing: "ease-out",
    }
    animateElement(el, config)
    expect(el.animate).toHaveBeenCalledWith(
      config.keyframes,
      expect.objectContaining({ duration: 300, easing: "ease-out" })
    )
  })

  it("uses default duration of 300ms when not specified", () => {
    const el = mockElement()
    const config: AnimateConfig = { keyframes: [{ opacity: "0" }, { opacity: "1" }] }
    animateElement(el, config)
    expect(el.animate).toHaveBeenCalledWith(
      config.keyframes,
      expect.objectContaining({ duration: 300 })
    )
  })

  it("handles empty keyframes array without calling animate", () => {
    const el = mockElement()
    const config: AnimateConfig = { keyframes: [] }
    const result = animateElement(el, config)
    expect(result).toBeNull()
    expect(el.animate).not.toHaveBeenCalled()
  })

  it("respects prefers-reduced-motion", () => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockReturnValue({ matches: true }),
    })
    const el = mockElement()
    const config: AnimateConfig = { keyframes: [{ opacity: "0" }, { opacity: "1" }], duration: 300 }
    const result = animateElement(el, config)
    expect(result).toBeNull()
    expect(el.animate).not.toHaveBeenCalled()
  })

  it("returns null in SSR environment (no window)", () => {
    const originalWindow = globalThis.window
    // @ts-ignore
    delete globalThis.window
    const el = mockElement()
    const config: AnimateConfig = { keyframes: [{ opacity: "0" }, { opacity: "1" }] }
    const result = animateElement(el, config)
    expect(result).toBeNull()
    globalThis.window = originalWindow
  })
})

describe("cancelAnimation", () => {
  it("throws TypeError if el is null", () => {
    expect(() => cancelAnimation(null as any)).toThrow(TypeError)
  })

  it("throws TypeError if el is undefined", () => {
    expect(() => cancelAnimation(undefined as any)).toThrow(TypeError)
  })

  it("cancels running animation on element", () => {
    const el = mockElement()
    const config: AnimateConfig = { keyframes: [{ opacity: "0" }, { opacity: "1" }] }
    animateElement(el, config)
    // cancelAnimation should not throw
    expect(() => cancelAnimation(el)).not.toThrow()
  })
})
