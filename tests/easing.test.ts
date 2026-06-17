// @vitest-environment jsdom
import { describe, it, expect } from "vitest"
import { resolveEasing } from "../src/easing"

describe("resolveEasing", () => {
  it("throws TypeError if input is not a string or number array", () => {
    expect(() => resolveEasing(123 as any)).toThrow(TypeError)
    expect(() => resolveEasing(null as any)).toThrow(TypeError)
    expect(() => resolveEasing(undefined as any)).toThrow(TypeError)
    expect(() => resolveEasing({} as any)).toThrow(TypeError)
  })

  it("resolves 'ease-out' named easing", () => {
    const result = resolveEasing("ease-out")
    expect(result).toBe("ease-out")
  })

  it("resolves 'ease-in' named easing", () => {
    const result = resolveEasing("ease-in")
    expect(result).toBe("ease-in")
  })

  it("resolves 'ease-in-out' named easing", () => {
    const result = resolveEasing("ease-in-out")
    expect(result).toBe("ease-in-out")
  })

  it("resolves 'spring' to a cubic-bezier string", () => {
    const result = resolveEasing("spring")
    expect(result).toMatch(/^cubic-bezier\(/)
  })

  it("resolves 'bounce' to a cubic-bezier string", () => {
    const result = resolveEasing("bounce")
    expect(result).toMatch(/^cubic-bezier\(/)
  })

  it("converts 4-number array to cubic-bezier string", () => {
    const result = resolveEasing([0.25, 0.1, 0.25, 1.0])
    expect(result).toBe("cubic-bezier(0.25, 0.1, 0.25, 1)")
  })

  it("throws RangeError if array does not have exactly 4 numbers", () => {
    expect(() => resolveEasing([0.25, 0.1, 0.25] as any)).toThrow(RangeError)
    expect(() => resolveEasing([0.25, 0.1, 0.25, 1.0, 0.5] as any)).toThrow(RangeError)
  })

  it("passes through unknown string values as-is (CSS easing)", () => {
    const result = resolveEasing("cubic-bezier(0.4, 0, 0.2, 1)")
    expect(result).toBe("cubic-bezier(0.4, 0, 0.2, 1)")
  })

  it("passes through 'linear' as-is", () => {
    const result = resolveEasing("linear")
    expect(result).toBe("linear")
  })
})
