// Central design tokens + world layout for the AImagino cinematic experience.

export const palette = {
  bg: "#03040a",
  bgDeep: "#010208",
  cyan: "#25e8ff",
  blue: "#3b82f6",
  violet: "#7c5cff",
  indigo: "#5b6bff",
  magenta: "#ff2d9b",
  amber: "#ffb020",
  green: "#2effc2",
  white: "#eaf2ff",
  mute: "#8ea3c8",
};

// Ordered journey through the headquarters. Each entry is one "location".
export const SECTIONS = [
  "exterior",
  "agents",
  "automation",
  "data",
  "lab",
  "industries",
  "portfolio",
  "why",
  "contact",
] as const;

export type SectionId = (typeof SECTIONS)[number];

// Distance (world units) the camera travels between department centers.
export const SECTION_DEPTH = 58;

// Total scroll pages (drives ScrollControls). One extra for entry/exit breathing room.
export const SCROLL_PAGES = SECTIONS.length + 0.6;

export function sectionZ(index: number): number {
  return -index * SECTION_DEPTH;
}

export function sectionIndex(id: SectionId): number {
  return SECTIONS.indexOf(id);
}

// Normalized scroll offset (0..1) at which a section is centered in view.
// Uses SECTIONS.length, NOT SCROLL_PAGES: the camera's world-Z position is a
// straight lerp of `offset` across the N department slots, so any timing
// that has to line up with the camera (HTML fade, rail nav) must divide by
// the same N. SCROLL_PAGES adds extra physical scroll distance for pacing/
// breathing room — using it here desyncs the last section's fade window
// from where the camera actually is, cutting it off before scroll ends.
export function sectionOffset(index: number): number {
  return (index + 0.5) / SECTIONS.length;
}
