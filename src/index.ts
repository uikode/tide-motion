// Types
export type { AnimateConfig, StaggerConfig, RevealConfig, PressConfig, EasingFn, TideMotionDirectives } from "./types"
export type { PresetDef } from "./presets"

// Core
export { animateElement, cancelAnimation } from "./core"

// Presets
export { resolvePreset, registerPreset } from "./presets"

// Easing
export { resolveEasing } from "./easing"

// Directives
export { animate } from "./directives/animate"
export { stagger } from "./directives/stagger"
export { reveal } from "./directives/reveal"
export { press } from "./directives/press"
