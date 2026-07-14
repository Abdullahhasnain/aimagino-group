import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { SECTIONS } from "../theme";
import { COPY, COMPANY } from "../content";
import { sectionActivity } from "../lib/motion";
import { travel } from "../lib/travel";

/**
 * The readable layer. Rendered in the MAIN React tree (not inside drei's
 * <Scroll html>): that helper mounts a second ReactDOM root inside the
 * canvas, and if that hidden root fails (createRoot-reuse errors during
 * HMR, bridge issues) every panel vanishes while the 3D keeps running —
 * with no visible error. Panels are viewport-fixed and fade/rise based on
 * the walker's position, read from the travel singleton the CameraRig
 * writes each frame (same pattern the HUD already uses).
 */
export function Overlay() {
  return (
    <div className="overlay">
      {SECTIONS.map((id, i) => {
        const c = COPY[id];
        const align = id === "exterior" || id === "contact" || id === "why" ? "center" : i % 2 ? "right" : "left";
        // The hero is the page's single h1; every department is an h2.
        const Heading = i === 0 ? "h1" : "h2";
        return (
          <Panel key={id} index={i} align={align}>
            <p className="kicker">{c.kicker}</p>
            <Heading className="title">{c.title}</Heading>
            <p className="tagline">{c.tagline}</p>

            {c.bullets && (
              <ul className="chips">
                {c.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}

            {id === "exterior" && (
              <p className="hint-inline">Scroll to walk inside ▾</p>
            )}

            {id === "contact" && <ContactBlock />}
          </Panel>
        );
      })}
    </div>
  );
}

function Panel({
  index,
  align,
  children,
}: {
  index: number;
  align: "left" | "right" | "center";
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = ref.current;
      if (el) {
        const a = sectionActivity(travel.offset, index);
        el.style.opacity = String(a);
        el.style.transform = `translateY(${(1 - a) * 42}px)`;
        el.style.visibility = a > 0.02 ? "visible" : "hidden";
        el.classList.toggle("is-live", a > 0.55);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [index]);

  // The entrance panel ships visible so the hero text shows even before the
  // first animation frame; the rest start hidden and fade in on approach.
  const initial =
    index === 0 ? undefined : ({ opacity: 0, visibility: "hidden" } as const);

  return (
    <section ref={ref} className={`panel panel--${align}`} style={initial}>
      <div className="panel__inner">{children}</div>
    </section>
  );
}

function ContactBlock() {
  return (
    <>
      <div className="contact-grid">
        <a className="contact-pill" href={COMPANY.whatsapp} target="_blank" rel="noreferrer">
          <b>WhatsApp</b> +92 371 0023087
        </a>
        <a className="contact-pill" href={`mailto:${COMPANY.email}`}>
          <b>Email</b> {COMPANY.email}
        </a>
        <a className="contact-pill" href={`mailto:${COMPANY.altEmail}`}>
          <b>Alt Email</b> {COMPANY.altEmail}
        </a>
        <a className="contact-pill" href={COMPANY.linkedin} target="_blank" rel="noreferrer">
          <b>LinkedIn</b> Abdullah Hasnain
        </a>
        <a className="contact-pill" href={COMPANY.instagram} target="_blank" rel="noreferrer">
          <b>Instagram</b> @aimaginosolution
        </a>
      </div>
      <a className="cta" href={COMPANY.whatsapp} target="_blank" rel="noreferrer">
        Start Your AI Project
      </a>
      <p className="fineprint">
        {COMPANY.founder} · Founder · {COMPANY.location}
        <br />
        {COMPANY.reach}
      </p>
    </>
  );
}
