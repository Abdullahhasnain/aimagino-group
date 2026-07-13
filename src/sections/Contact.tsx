import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { COMPANY } from "../content";
import { palette } from "../theme";

interface Card {
  label: string;
  value: string;
  href: string;
  accent: string;
}

const CARDS: Card[] = [
  { label: "Email", value: COMPANY.email, href: `mailto:${COMPANY.email}`, accent: palette.cyan },
  { label: "Alt Email", value: COMPANY.altEmail, href: `mailto:${COMPANY.altEmail}`, accent: palette.blue },
  { label: "WhatsApp", value: "+92 371 0023087", href: COMPANY.whatsapp, accent: palette.green },
  { label: "LinkedIn", value: "Abdullah Hasnain", href: COMPANY.linkedin, accent: palette.violet },
  { label: "Instagram", value: "@aimaginosolution", href: COMPANY.instagram, accent: palette.magenta },
];

/** The command center: a greeting AI orb, holographic contact cards in an arc,
 * and a giant glowing "Start Your AI Project" button that floods the room. */
export function Contact() {
  const burst = useRef(0);
  const flood = useRef<THREE.PointLight>(null);

  useFrame((_, delta) => {
    if (burst.current > 0) burst.current = Math.max(0, burst.current - delta * 1.6);
    if (flood.current) flood.current.intensity = 6 + burst.current * 60;
  });

  return (
    <group position={[0, 0, -6]}>
      {/* greeting AI orb */}
      <AssistantOrb />

      {/* arc of contact cards */}
      {CARDS.map((c, i) => {
        const a = (i - (CARDS.length - 1) / 2) * 0.4;
        return (
          <group key={c.label} position={[Math.sin(a) * 8, 4.4, -3 + Math.cos(a) * -2]} rotation={[0, -a, 0]}>
            <Html center transform distanceFactor={7}>
              <a className="contact-card" href={c.href} target="_blank" rel="noreferrer" style={{ "--accent": c.accent } as CSSProperties}>
                <span className="contact-card__label">{c.label}</span>
                <span className="contact-card__value">{c.value}</span>
              </a>
            </Html>
          </group>
        );
      })}

      {/* founder / location plate */}
      <Html center transform distanceFactor={7} position={[0, 6.4, -4]}>
        <div className="founder-plate">
          <strong>{COMPANY.founder}</strong> · Founder
          <span>{COMPANY.location}</span>
        </div>
      </Html>

      {/* giant glowing button */}
      <StartButton onPress={() => (burst.current = 1)} />

      <pointLight ref={flood} position={[0, 5, 2]} color={palette.cyan} intensity={6} distance={40} />
      <pointLight position={[0, 2, -8]} color={palette.violet} intensity={7} distance={24} />
    </group>
  );
}

function AssistantOrb() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = 8.4 + Math.sin(state.clock.elapsedTime) * 0.2;
      ref.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });
  return (
    <group ref={ref} position={[0, 8.4, -6]}>
      <mesh>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshStandardMaterial color={palette.cyan} emissive={palette.cyan} emissiveIntensity={1.4} toneMapped={false} />
      </mesh>
      <mesh>
        <torusGeometry args={[1.1, 0.03, 8, 64]} />
        <meshBasicMaterial color={palette.white} toneMapped={false} />
      </mesh>
    </group>
  );
}

function StartButton({ onPress }: { onPress: () => void }) {
  const [hover, setHover] = useState(false);
  const ring = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ring.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.05 + (hover ? 0.12 : 0);
      ring.current.scale.setScalar(s);
    }
  });
  return (
    <group
      position={[0, 1.4, 2]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHover(false);
        document.body.style.cursor = "auto";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onPress();
        window.open(COMPANY.whatsapp, "_blank", "noopener");
      }}
    >
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.7, 0.4, 48]} />
        <meshStandardMaterial color="#0b1020" metalness={0.8} roughness={0.25} emissive={palette.cyan} emissiveIntensity={hover ? 1.2 : 0.6} toneMapped={false} />
      </mesh>
      <mesh ref={ring} position={[0, 0.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 1.9, 48]} />
        <meshBasicMaterial color={palette.cyan} transparent opacity={0.9} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      <Html center position={[0, 0.5, 0]} distanceFactor={9}>
        <div className="start-btn-label">START YOUR AI PROJECT</div>
      </Html>
    </group>
  );
}
