import { useEffect, useRef, useState } from "react";
import { travel } from "../lib/travel";
import { SECTIONS } from "../theme";
import { COPY } from "../content";

const SHORT: Record<string, string> = {
  exterior: "Entrance",
  agents: "AI Agents",
  automation: "Automation",
  data: "Data",
  lab: "Lab",
  industries: "Industries",
  portfolio: "Portfolio",
  why: "Why Us",
  contact: "Contact",
};

/** Fixed chrome that sits above the canvas: brand, a live department rail, and
 * a scroll hint. Driven by the travel singleton via a light rAF loop. */
export function HUD() {
  const [active, setActive] = useState(0);
  const [started, setStarted] = useState(false);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const o = travel.offset;
      // nearest department center
      let best = 0;
      let bestD = Infinity;
      for (let i = 0; i < SECTIONS.length; i++) {
        const d = Math.abs(o - (i + 0.5) / SECTIONS.length);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      setActive(best);
      setStarted(o > 0.015);
      if (bar.current) bar.current.style.height = `${Math.min(100, o * 100)}%`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Keyboard travel: wheel/touch aren't the only way through the building.
  // Arrows/PageUp/PageDown/Space/Home/End drive the same scroll element
  // drei's ScrollControls creates inside the canvas wrapper.
  useEffect(() => {
    const findScrollEl = (): HTMLElement | null => {
      const canvas = document.querySelector<HTMLCanvasElement>(".stage canvas");
      if (!canvas || !canvas.parentElement) return null;
      for (const child of canvas.parentElement.children) {
        if (child !== canvas && (child as HTMLElement).scrollHeight > (child as HTMLElement).clientHeight) {
          return child as HTMLElement;
        }
      }
      return null;
    };
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      const el = findScrollEl();
      if (!el) return;
      const page = el.clientHeight;
      let delta = 0;
      if (e.key === "ArrowDown") delta = page * 0.18;
      else if (e.key === "ArrowUp") delta = -page * 0.18;
      else if (e.key === "PageDown" || (e.key === " " && !e.shiftKey)) delta = page * 0.85;
      else if (e.key === "PageUp" || (e.key === " " && e.shiftKey)) delta = -page * 0.85;
      else if (e.key === "Home") { el.scrollTop = 0; e.preventDefault(); return; }
      else if (e.key === "End") { el.scrollTop = el.scrollHeight; e.preventDefault(); return; }
      else return;
      el.scrollTop += delta;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div className="brand">
        <span className="brand__mark" aria-hidden="true">◆</span>
        AImagino <span className="brand__thin">Solution</span>
      </div>

      <nav className="rail" aria-label="Departments">
        <div className="rail__track">
          <div ref={bar} className="rail__fill" />
        </div>
        <ul>
          {SECTIONS.map((id, i) => (
            <li key={id} className={i === active ? "is-active" : ""}>
              <span className="rail__dot" />
              <span className="rail__label">{SHORT[id]}</span>
            </li>
          ))}
        </ul>
      </nav>

      <div className={`scroll-hint ${started ? "is-hidden" : ""}`}>
        <span>{COPY.exterior.kicker}</span>
        <div className="scroll-hint__mouse" aria-hidden="true">
          <div className="scroll-hint__wheel" />
        </div>
        Scroll to enter
      </div>
    </>
  );
}
