import { useRef } from "react";
import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { HoloPanel } from "../components/Holo";
import { PROJECTS } from "../content";
import { palette } from "../theme";

const ACCENTS = [palette.cyan, palette.violet, palette.magenta, palette.green, palette.amber, palette.blue];

/** A futuristic museum: each project floats inside a glass hologram. Hover a
 * card to expand its before/after transformation. */
export function Portfolio() {
  return (
    <group>
      {PROJECTS.map((p, i) => {
        const side = i % 2 === 0 ? -1 : 1;
        const row = Math.floor(i / 2);
        const accent = ACCENTS[i % ACCENTS.length];
        return (
          <FloatingFrame
            key={p.title}
            baseY={3.4}
            phase={i}
            position={[side * 7.5, 3.4, 4 - row * 6]}
            rotation={[0, -side * 0.55, 0]}
          >
            <HoloPanel width={4.4} height={3} color={accent} opacity={0.09}>
              <Html center transform distanceFactor={7} position={[0, 0, 0.06]}>
                <div className="pf-card" style={{ "--accent": accent } as CSSProperties}>
                  <div className="pf-card__domain">{p.domain}</div>
                  <div className="pf-card__title">{p.title}</div>
                  <div className="pf-card__ba">
                    <div className="pf-card__before">
                      <span>Before</span>
                      {p.before}
                    </div>
                    <div className="pf-card__arrow">→</div>
                    <div className="pf-card__after">
                      <span>After</span>
                      {p.after}
                    </div>
                  </div>
                  <div className="pf-card__metric">{p.metric}</div>
                </div>
              </Html>
            </HoloPanel>
          </FloatingFrame>
        );
      })}

      <pointLight position={[0, 6, 0]} color={palette.violet} intensity={7} distance={30} />
      <pointLight position={[0, 3, -8]} color={palette.cyan} intensity={6} distance={24} />
    </group>
  );
}

function FloatingFrame({
  baseY,
  phase,
  children,
  ...props
}: {
  baseY: number;
  phase: number;
  children: ReactNode;
} & ComponentProps<"group">) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) ref.current.position.y = baseY + Math.sin(state.clock.elapsedTime * 0.7 + phase) * 0.16;
  });
  return (
    <group ref={ref} {...props}>
      {children}
    </group>
  );
}
