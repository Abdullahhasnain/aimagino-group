import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { quality } from "../lib/device";

interface ParticlesProps {
  count?: number;
  radius?: number;
  size?: number;
  color?: string;
  /** volume shape: "sphere" fills a ball, "box" fills a slab (w,h,d via radius/spread) */
  shape?: "sphere" | "box";
  spread?: [number, number, number];
  spin?: number; // radians/sec around Y
  drift?: number; // vertical bob amplitude
  opacity?: number;
  position?: [number, number, number];
}

/**
 * A lightweight, additively-blended point cloud. Reused everywhere: neural
 * particles, floating data motes, atmosphere dust. Cheap enough to place many.
 */
export function Particles({
  count: rawCount = 600,
  radius = 20,
  size = 0.08,
  color = "#25e8ff",
  shape = "sphere",
  spread = [40, 12, 40],
  spin = 0.03,
  drift = 0.4,
  opacity = 0.9,
  position = [0, 0, 0],
}: ParticlesProps) {
  const ref = useRef<THREE.Points>(null);
  const count = Math.max(20, Math.round(rawCount * quality.particleScale));

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      if (shape === "sphere") {
        // even-ish distribution in a ball
        const r = radius * Math.cbrt(pseudo(i * 3.13));
        const theta = pseudo(i * 7.7) * Math.PI * 2;
        const phi = Math.acos(2 * pseudo(i * 2.1) - 1);
        arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        arr[i * 3 + 2] = r * Math.cos(phi);
      } else {
        arr[i * 3] = (pseudo(i * 1.7) - 0.5) * spread[0];
        arr[i * 3 + 1] = (pseudo(i * 4.3) - 0.5) * spread[1];
        arr[i * 3 + 2] = (pseudo(i * 9.1) - 0.5) * spread[2];
      }
    }
    return arr;
  }, [count, radius, shape, spread]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * spin;
    ref.current.position.y = position[1] + Math.sin(t * 0.4) * drift;
  });

  return (
    <points ref={ref} position={position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={opacity}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}

// Deterministic pseudo-random so geometry is stable across renders (no Math.random
// in render paths — keeps SSR/HMR and re-renders consistent).
function pseudo(n: number): number {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}
