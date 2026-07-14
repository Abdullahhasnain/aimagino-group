// Small math helpers shared by the 3D world and the HTML overlay.

import { SECTIONS } from "../theme";

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
  // Divides by SECTIONS.length (not SCROLL_PAGES): the camera's world-Z is a
  // straight lerp of `offset` across the N department slots, so this has to
  // divide the same way or the fade drifts out of sync with the camera —
  // worst for the last section, whose fade-out then finishes before offset
  // ever reaches 1, leaving it invisible right when scroll actually ends.
  const last = SECTIONS.length - 1;
  const center = (index + 0.5) / SECTIONS.length;
  const half = 0.5 / SECTIONS.length;
  // The first/last sections have no neighbor beyond the scroll boundary, so
  // their bell curve would otherwise peak mid-slot and already be fading by
  // offset 0 / 1 — the exact ends a user naturally scrolls to. Hold them at
  // full activity from their center out to that boundary instead.
  let d: number;
  if (index === 0 && offset <= center) d = 0;
  else if (index === last && offset >= center) d = 0;
  else d = Math.abs(offset - center) / (half * 1.9);
  return clamp(1 - d);
}

// Normalized global scroll progress helper (0 at first section, 1 at last).
export function journeyProgress(offset: number): number {
  return clamp(offset);
}
