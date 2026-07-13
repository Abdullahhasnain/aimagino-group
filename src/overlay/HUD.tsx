import { useEffect, useRef, useState } from "react";
import { travel } from "../lib/travel";
import { SECTIONS, SCROLL_PAGES } from "../theme";
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
        const d = Math.abs(o - (i + 0.5) / SCROLL_PAGES);
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

  return (
    <>
      <div className="brand">
        <span className="brand__mark">◆</span>
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
        <div className="scroll-hint__mouse">
          <div className="scroll-hint__wheel" />
        </div>
        Scroll to enter
      </div>
    </>
  );
}
