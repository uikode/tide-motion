import type { EasingFn } from "./types"

/** Named easing mappings */
const namedEasings: Record<string, string> = {
  "ease-out": "ease-out",
  "ease-in": "ease-in",
  "ease-in-out": "ease-in-out",
  spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
}

/**
 * Resolve an easing value to a CSS easing string.
 * Accepts: named string, cubic-bezier array [4 numbers], or passthrough string.
 */
export function resolveEasing(input: EasingFn): string {
  if (input == null) {
    throw new TypeError("resolveEasing: input must be a string or number[4]")
  }

  if (Array.isArray(input)) {
    if (input.length !== 4) {
      throw new RangeError("resolveEasing: array must have exactly 4 numbers")
    }
    return `cubic-bezier(${input[0]}, ${input[1]}, ${input[2]}, ${input[3]})`
  }

  if (typeof input !== "string") {
    throw new TypeError("resolveEasing: input must be a string or number[4]")
  }

  // Check named easings first
  if (namedEasings[input]) {
    return namedEasings[input]
  }

  // Passthrough (linear, cubic-bezier(...), etc.)
  return input
}
