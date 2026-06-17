// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from "vitest"
import { animate } from "../src/directives/animate"
import { stagger } from "../src/directives/stagger"
import { reveal } from "../src/directives/reveal"
import { press } from "../src/directives/press"

function mockElement(connected = true): HTMLElement {
  const el = document.createElement("div")
  Object.defineProperty(el, "isConnected", { value: connected })
  const mockAnimation = {
    cancel: vi.fn(),
    finished: Promise.resolve(),
    playState: "running",
  }
  el.animate = vi.fn().mockReturnValue(mockAnimation)
  return el
}

describe("animate directive", () => {
  beforeEach(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockReturnValue({ matches: false }),
    })
  })

  it("is a function", () => {
    expect(typeof animate).toBe("function")
  })

  it("accepts el and config accessor", () => {
    const el = mockElement()
    expect(() =>
      animate(el, () => ({
        keyframes: [{ opacity: "0" }, { opacity: "1" }],
        duration: 300,
      }))
    ).not.toThrow()
  })

  it("throws TypeError if el is null", () => {
    expect(() =>
      animate(null as any, () => ({
        keyframes: [{ opacity: "0" }, { opacity: "1" }],
      }))
    ).toThrow(TypeError)
  })
})

describe("stagger directive", () => {
  it("is a function", () => {
    expect(typeof stagger).toBe("function")
  })

  it("accepts el and config accessor", () => {
    const el = mockElement()
    el.innerHTML = "<span>a</span><span>b</span><span>c</span>"
    // Mock children's animate
    Array.from(el.children).forEach((child) => {
      (child as HTMLElement).animate = vi.fn().mockReturnValue({
        cancel: vi.fn(),
        finished: Promise.resolve(),
        playState: "running",
      })
      Object.defineProperty(child, "isConnected", { value: true })
    })
    expect(() =>
      stagger(el, () => ({
        keyframes: [{ opacity: "0" }, { opacity: "1" }],
        delay: 50,
        from: "start",
      }))
    ).not.toThrow()
  })

  it("throws TypeError if el is null", () => {
    expect(() =>
      stagger(null as any, () => ({
        keyframes: [{ opacity: "0" }, { opacity: "1" }],
        delay: 50,
      }))
    ).toThrow(TypeError)
  })
})

describe("reveal directive", () => {
  beforeEach(() => {
    // Mock IntersectionObserver
    global.IntersectionObserver = vi.fn().mockImplementation((callback) => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    })) as any
  })

  it("is a function", () => {
    expect(typeof reveal).toBe("function")
  })

  it("accepts el and config accessor", () => {
    const el = mockElement()
    expect(() =>
      reveal(el, () => ({
        keyframes: [{ opacity: "0" }, { opacity: "1" }],
      }))
    ).not.toThrow()
  })

  it("throws TypeError if el is null", () => {
    expect(() =>
      reveal(null as any, () => ({
        keyframes: [{ opacity: "0" }, { opacity: "1" }],
      }))
    ).toThrow(TypeError)
  })

  it("returns early in SSR (no IntersectionObserver)", () => {
    const originalIO = global.IntersectionObserver
    // @ts-ignore
    delete global.IntersectionObserver
    const el = mockElement()
    expect(() =>
      reveal(el, () => ({
        keyframes: [{ opacity: "0" }, { opacity: "1" }],
      }))
    ).not.toThrow()
    global.IntersectionObserver = originalIO
  })
})

describe("press directive", () => {
  it("is a function", () => {
    expect(typeof press).toBe("function")
  })

  it("accepts el and config accessor", () => {
    const el = mockElement()
    expect(() => press(el, () => ({ scale: 0.95 }))).not.toThrow()
  })

  it("throws TypeError if el is null", () => {
    expect(() => press(null as any, () => ({ scale: 0.95 }))).toThrow(TypeError)
  })

  it("attaches pointerdown listener", () => {
    const el = mockElement()
    const spy = vi.spyOn(el, "addEventListener")
    press(el, () => ({ scale: 0.95 }))
    expect(spy).toHaveBeenCalledWith("pointerdown", expect.any(Function))
  })
})
