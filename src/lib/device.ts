// One-time device tier check used to scale expensive effects (reflections,
// bloom, particle counts) down on phones / low-core devices so the scene
// stays smooth instead of dropping frames that can look like "nothing is
// rendering". Read once at module load — this never changes mid-session.

const width = typeof window !== "undefined" ? window.innerWidth : 1280;
const cores = typeof navigator !== "undefined" ? navigator.hardwareConcurrency ?? 4 : 4;
const coarsePointer =
  typeof window !== "undefined" && window.matchMedia
    ? window.matchMedia("(pointer: coarse)").matches
    : false;

export const isMobile = width < 820;
export const isLowPower = isMobile || coarsePointer || cores <= 4;

export const quality = {
  dpr: (isLowPower ? [1, 1.5] : [1, 2]) as [number, number],
  reflectorResolution: isLowPower ? 256 : 512,
  bloomIntensity: isLowPower ? 0.6 : 0.9,
  particleScale: isLowPower ? 0.5 : 1,
};
