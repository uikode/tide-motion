/** Preset definition */
export interface PresetDef {
  keyframes: Keyframe[];
  duration: number;
  easing: string;
}

/** Internal preset registry */
const presets = new Map<string, PresetDef>()

// Built-in presets
presets.set("fadeIn", {
  keyframes: [{ opacity: "0" }, { opacity: "1" }],
  duration: 300,
  easing: "ease-out",
})

presets.set("fadeOut", {
  keyframes: [{ opacity: "1" }, { opacity: "0" }],
  duration: 300,
  easing: "ease-out",
})

presets.set("slideUp", {
  keyframes: [
    { transform: "translateY(20px)", opacity: "0" },
    { transform: "translateY(0)", opacity: "1" },
  ],
  duration: 400,
  easing: "ease-out",
})

presets.set("slideDown", {
  keyframes: [
    { transform: "translateY(-20px)", opacity: "0" },
    { transform: "translateY(0)", opacity: "1" },
  ],
  duration: 400,
  easing: "ease-out",
})

presets.set("scaleIn", {
  keyframes: [
    { transform: "scale(0.8)", opacity: "0" },
    { transform: "scale(1)", opacity: "1" },
  ],
  duration: 300,
  easing: "ease-out",
})

presets.set("goldPulse", {
  keyframes: [
    { boxShadow: "0 0 0 0 rgba(255, 215, 0, 0.7)" },
    { boxShadow: "0 0 0 10px rgba(255, 215, 0, 0)" },
    { boxShadow: "0 0 0 0 rgba(255, 215, 0, 0)" },
  ],
  duration: 600,
  easing: "ease-in-out",
})

/**
 * Resolve a preset by name. Returns null if not found.
 */
export function resolvePreset(name: string): PresetDef | null {
  if (typeof name !== "string") {
    throw new TypeError("resolvePreset: name must be a string")
  }
  return presets.get(name) ?? null
}

/**
 * Register a custom preset.
 */
export function registerPreset(name: string, def: PresetDef): void {
  if (typeof name !== "string") {
    throw new TypeError("registerPreset: name must be a string")
  }
  if (def == null || typeof def !== "object") {
    throw new TypeError("registerPreset: def must be a PresetDef object")
  }
  presets.set(name, def)
}
