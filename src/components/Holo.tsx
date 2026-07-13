import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { ComponentProps, ReactNode } from "react";
import * as THREE from "three";

/** A translucent, additively-lit holographic panel with a glowing border. */
export function HoloPanel({
  width = 3,
  height = 2,
  color = "#25e8ff",
  opacity = 0.14,
  children,
  ...props
}: {
  width?: number;
  height?: number;
  color?: string;
  opacity?: number;
  children?: ReactNode;
} & ComponentProps<"group">) {
  const edges = useMemo(
    () => new THREE.EdgesGeometry(new THREE.PlaneGeometry(width, height)),
    [width, height],
  );
  return (
    <group {...props}>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={opacity}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      <lineSegments geometry={edges}>
        <lineBasicMaterial color={color} transparent opacity={0.9} toneMapped={false} />
      </lineSegments>
      {children}
    </group>
  );
}

/** Animated voice-equalizer bars, like a live speaking assistant. */
export function VoiceWave({
  bars = 9,
  color = "#25e8ff",
  width = 1.6,
  height = 0.6,
  seed = 0,
}: {
  bars?: number;
  color?: string;
  width?: number;
  height?: number;
  seed?: number;
}) {
  const group = useRef<THREE.Group>(null);
  const gap = width / bars;
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      const m = child as THREE.Mesh;
      const s =
        0.15 + Math.abs(Math.sin(t * 3 + i * 0.7 + seed)) * 0.85;
      m.scale.y = s;
      m.position.y = (s * height) / 2 - height / 2;
    });
  });
  return (
    <group ref={group}>
      {Array.from({ length: bars }).map((_, i) => (
        <mesh key={i} position={[(i - (bars - 1) / 2) * gap, 0, 0]}>
          <boxGeometry args={[gap * 0.5, height, gap * 0.5]} />
          <meshBasicMaterial color={color} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/** An emissive light strip / neon bar. */
export function GlowBar({
  length = 6,
  thickness = 0.08,
  color = "#25e8ff",
  intensity = 2,
  ...props
}: {
  length?: number;
  thickness?: number;
  color?: string;
  intensity?: number;
} & ComponentProps<"mesh">) {
  return (
    <mesh {...props}>
      <boxGeometry args={[length, thickness, thickness]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={intensity}
        toneMapped={false}
      />
    </mesh>
  );
}
