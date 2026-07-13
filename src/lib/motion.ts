// Small math helpers shared by the 3D world and the HTML overlay.

import { SCROLL_PAGES } from "../theme";

export const clamp = (v: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, v));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Classic smoothstep easing.
export const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

// A 0..1 "activity" pulse for a section: ramps up as the camera approaches its
// center and ramps back down as it leaves. Used to fade content + animations.
export function sectionActivity(offset: number, index: number): number {
  const center = (index + 0.5) / SCROLL_PAGES;
  const half = 0.5 / SCROLL_PAGES; // half a page on either side
  const d = Math.abs(offset - center) / (half * 1.9);
  return clamp(1 - d);
}

// Normalized global scroll progress helper (0 at first section, 1 at last).
export function journeyProgress(offset: number): number {
  return clamp(offset);
}
