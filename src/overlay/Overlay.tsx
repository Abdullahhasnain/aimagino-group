import { useRef } from "react";
import type { ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { SECTIONS } from "../theme";
import { COPY, COMPANY } from "../content";
import { sectionActivity } from "../lib/motion";

/**
 * The readable layer. Rendered inside <Scroll html> so it tracks the scroll,
 * but each panel also fades/rises based on how close the walker is to its
 * department — keeping copy legible and in sync with the 3D journey.
 */
export function Overlay() {
  return (
    <div className="overlay">
      {SECTIONS.map((id, i) => {
        const c = COPY[id];
        const align = id === "exterior" || id === "contact" || id === "why" ? "center" : i % 2 ? "right" : "left";
        return (
          <Panel key={id} index={i} align={align}>
            <p className="kicker">{c.kicker}</p>
            <h2 className="title">{c.title}</h2>
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
  const ref = useRef<HTMLDivElement>(null);
  const scroll = useScroll();
  useFrame(() => {
    const el = ref.current;
    if (!el) return;
    const a = sectionActivity(scroll.offset, index);
    el.style.opacity = String(a);
    el.style.transform = `translateY(${(1 - a) * 42}px)`;
    el.style.pointerEvents = a > 0.55 ? "auto" : "none";
    el.style.visibility = a > 0.02 ? "visible" : "hidden";
  });
  return (
    <section ref={ref} className={`panel panel--${align}`} style={{ top: `${index * 100}vh` }}>
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
