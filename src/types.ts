/** Easing function type */
export type EasingFn = string | number[];

/** Configuration for animateElement */
export interface AnimateConfig {
  keyframes: Keyframe[];
  duration?: number;
  easing?: string;
  delay?: number;
  fill?: FillMode;
  iterations?: number;
  direction?: PlaybackDirection;
  preset?: string;
}

/** Configuration for use:stagger directive */
export interface StaggerConfig {
  keyframes: Keyframe[];
  duration?: number;
  easing?: string;
  delay?: number;
  from?: "start" | "end" | "center";
}

/** Configuration for use:reveal directive */
export interface RevealConfig {
  keyframes: Keyframe[];
  duration?: number;
  easing?: string;
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
}

/** Configuration for use:press directive */
export interface PressConfig {
  scale?: number;
  duration?: number;
  easing?: string;
}

// Module augmentation for SolidJS directives
// Consumers should import this file or use:
// declare module "solid-js" { namespace JSX { interface Directives { ... } } }
export interface TideMotionDirectives {
  animate: AnimateConfig;
  stagger: StaggerConfig;
  reveal: RevealConfig;
  press: PressConfig;
}
