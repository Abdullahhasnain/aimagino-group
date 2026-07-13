import { useRef } from "react";
import type { ComponentProps } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { palette } from "../theme";

const BELT_LEN = 34;
const BELT_START = 8;

/** AI Automation Factory: conveyor lines that never stop, robotic arms working
 * the pipeline, and machine housings pulsing with process activity. */
export function Automation() {
  return (
    <group>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 7, 0, -6]}>
          <Belt color={side < 0 ? palette.cyan : palette.amber} dir={side} />
          <RoboticArm position={[side * -2.2, 0, -4]} color={palette.violet} phase={side} />
          <RoboticArm position={[side * -2.2, 0, 6]} color={palette.cyan} phase={side + 1.5} />
        </group>
      ))}

      {/* central machine core with rotating rings */}
      <group position={[0, 3.5, -8]}>
        <GearRing radius={2.2} color={palette.cyan} speed={0.5} />
        <GearRing radius={1.5} color={palette.magenta} speed={-0.8} />
        <mesh>
          <icosahedronGeometry args={[0.9, 0]} />
          <meshStandardMaterial
            color="#0b1020"
            metalness={0.9}
            roughness={0.2}
            emissive={palette.amber}
            emissiveIntensity={0.8}
          />
        </mesh>
        <pointLight color={palette.amber} intensity={8} distance={20} />
      </group>

      <pointLight position={[0, 7, 2]} color={palette.cyan} intensity={8} distance={30} />
    </group>
  );
}

function Belt({ color, dir }: { color: string; dir: number }) {
  const crates = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!crates.current) return;
    crates.current.children.forEach((c) => {
      c.position.z += delta * 3 * dir;
      if (dir > 0 && c.position.z > BELT_START) c.position.z -= BELT_LEN;
      if (dir < 0 && c.position.z < BELT_START - BELT_LEN) c.position.z += BELT_LEN;
      c.rotation.y = state.clock.elapsedTime * 0.5;
    });
  });
  return (
    <group>
      {/* belt surface */}
      <mesh position={[0, 0.6, BELT_START - BELT_LEN / 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.2, BELT_LEN]} />
        <meshStandardMaterial color="#0c1426" metalness={0.6} roughness={0.5} />
      </mesh>
      {/* rails */}
      {[-1.1, 1.1].map((x) => (
        <mesh key={x} position={[x, 0.55, BELT_START - BELT_LEN / 2]}>
          <boxGeometry args={[0.12, 0.3, BELT_LEN]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} toneMapped={false} />
        </mesh>
      ))}
      {/* crates */}
      <group ref={crates}>
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh key={i} position={[0, 1, BELT_START - i * (BELT_LEN / 6)]}>
            <boxGeometry args={[0.9, 0.7, 0.9]} />
            <meshStandardMaterial
              color="#16233f"
              metalness={0.5}
              roughness={0.4}
              emissive={color}
              emissiveIntensity={0.25}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function RoboticArm({
  color,
  phase,
  ...props
}: { color: string; phase: number } & ComponentProps<"group">) {
  const upper = useRef<THREE.Group>(null);
  const lower = useRef<THREE.Group>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime * 1.6 + phase;
    if (upper.current) upper.current.rotation.z = -0.5 + Math.sin(t) * 0.4;
    if (lower.current) lower.current.rotation.z = 0.8 + Math.cos(t) * 0.5;
  });
  return (
    <group {...props}>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.4, 0.5, 0.8, 16]} />
        <meshStandardMaterial color="#1a2138" metalness={0.7} roughness={0.3} />
      </mesh>
      <group ref={upper} position={[0, 0.8, 0]}>
        <mesh position={[0, 0.9, 0]}>
          <boxGeometry args={[0.28, 1.8, 0.28]} />
          <meshStandardMaterial color="#22304f" metalness={0.6} roughness={0.35} />
        </mesh>
        <group ref={lower} position={[0, 1.8, 0]}>
          <mesh position={[0, 0.7, 0]}>
            <boxGeometry args={[0.22, 1.4, 0.22]} />
            <meshStandardMaterial color="#22304f" metalness={0.6} roughness={0.35} />
          </mesh>
          <mesh position={[0, 1.4, 0]}>
            <sphereGeometry args={[0.18, 12, 12]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.4} toneMapped={false} />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function GearRing({ radius, color, speed }: { radius: number; color: string; speed: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.z = state.clock.elapsedTime * speed;
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[radius, 0.12, 8, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} toneMapped={false} />
    </mesh>
  );
}
