import { useEffect, useState } from "react";

// The scene uses only procedural geometry (no textures/GLTFs), so there is
// nothing for drei's useProgress/DefaultLoadingManager to ever report — it
// would sit at 0% forever. Simulate a short, deterministic boot instead.
// Uses setInterval rather than requestAnimationFrame so it still completes
// if the tab loads in the background (rAF is throttled/paused when hidden).
const BOOT_MS = 900;
const TICK_MS = 40;

/** Branded boot screen. Fades out after a fixed, guaranteed-to-finish boot. */
export function Loader() {
  const [progress, setProgress] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / BOOT_MS);
      setProgress(Math.floor(t * 100));
      if (t >= 1) {
        clearInterval(interval);
        setTimeout(() => setGone(true), 350);
      }
    }, TICK_MS);
    return () => clearInterval(interval);
  }, []);

  if (gone) return null;

  return (
    <div className={`loader ${progress >= 100 ? "is-done" : ""}`}>
      <div className="loader__mark">◆</div>
      <div className="loader__name">AImagino Solution</div>
      <div className="loader__meta">INITIALIZING HEADQUARTERS</div>
      <div className="loader__bar">
        <div className="loader__fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="loader__pct">{progress}%</div>
    </div>
  );
}
