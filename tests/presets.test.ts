// @vitest-environment jsdom
import { describe, it, expect } from "vitest"
import { resolvePreset, registerPreset } from "../src/presets"

describe("resolvePreset", () => {
  it("throws TypeError if name is not a string", () => {
    expect(() => resolvePreset(123 as any)).toThrow(TypeError)
    expect(() => resolvePreset(null as any)).toThrow(TypeError)
    expect(() => resolvePreset(undefined as any)).toThrow(TypeError)
  })

  it("returns null for unknown preset name", () => {
    expect(resolvePreset("nonexistent")).toBeNull()
  })

  it("resolves fadeIn preset with opacity keyframes", () => {
    const preset = resolvePreset("fadeIn")
    expect(preset).not.toBeNull()
    expect(preset!.keyframes).toBeDefined()
    expect(preset!.keyframes.length).toBeGreaterThan(0)
  })

  it("resolves fadeOut preset", () => {
    const preset = resolvePreset("fadeOut")
    expect(preset).not.toBeNull()
    expect(preset!.keyframes).toBeDefined()
  })

  it("resolves slideUp preset", () => {
    const preset = resolvePreset("slideUp")
    expect(preset).not.toBeNull()
    expect(preset!.keyframes).toBeDefined()
  })

  it("resolves slideDown preset", () => {
    const preset = resolvePreset("slideDown")
    expect(preset).not.toBeNull()
    expect(preset!.keyframes).toBeDefined()
  })

  it("resolves scaleIn preset", () => {
    const preset = resolvePreset("scaleIn")
    expect(preset).not.toBeNull()
    expect(preset!.keyframes).toBeDefined()
  })

  it("resolves goldPulse preset", () => {
    const preset = resolvePreset("goldPulse")
    expect(preset).not.toBeNull()
    expect(preset!.keyframes).toBeDefined()
  })
})

describe("registerPreset", () => {
  it("registers a custom preset and resolves it", () => {
    registerPreset("customBounce", {
      keyframes: [{ transform: "scale(1)" }, { transform: "scale(1.2)" }, { transform: "scale(1)" }],
      duration: 400,
      easing: "ease-in-out",
    })
    const preset = resolvePreset("customBounce")
    expect(preset).not.toBeNull()
    expect(preset!.duration).toBe(400)
  })

  it("throws TypeError if name is not a string", () => {
    expect(() => registerPreset(123 as any, { keyframes: [], duration: 300, easing: "ease" })).toThrow(TypeError)
  })

  it("throws TypeError if def is not provided", () => {
    expect(() => registerPreset("test", undefined as any)).toThrow(TypeError)
  })
})
