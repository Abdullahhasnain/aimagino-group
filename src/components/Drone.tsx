import { useRef } from "react";
import type { ComponentProps } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** A small AI drone that hovers and patrols a circular path overhead. */
export function Drone({
  center = [0, 6, 0],
  radius = 4,
  speed = 0.5,
  phase = 0,
  color = "#25e8ff",
  scale = 1,
}: {
  center?: [number, number, number];
  radius?: number;
  speed?: number;
  phase?: number;
  color?: string;
  scale?: number;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed + phase;
    ref.current.position.set(
      center[0] + Math.cos(t) * radius,
      center[1] + Math.sin(t * 1.7) * 0.6,
      center[2] + Math.sin(t) * radius,
    );
    ref.current.rotation.y = -t + Math.PI / 2;
  });
  return (
    <group ref={ref} scale={scale}>
      <mesh>
        <octahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial
          color="#0b1020"
          metalness={0.9}
          roughness={0.25}
          emissive={color}
          emissiveIntensity={0.4}
        />
      </mesh>
      {/* underside beam */}
      <mesh position={[0, -0.35, 0]}>
        <coneGeometry args={[0.5, 1.2, 16, 1, true]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.18}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      <pointLight color={color} intensity={3} distance={6} position={[0, -0.4, 0]} />
    </group>
  );
}

/** A stylized greeter robot standing beside the path. */
export function Robot({
  color = "#7c5cff",
  wave = true,
  ...props
}: { color?: string; wave?: boolean } & ComponentProps<"group">) {
  const arm = useRef<THREE.Group>(null);
  const head = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (arm.current && wave) arm.current.rotation.z = -0.6 + Math.sin(t * 4) * 0.4;
    if (head.current) head.current.rotation.y = Math.sin(t * 0.8) * 0.3;
  });
  return (
    <group {...props}>
      {/* body */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <capsuleGeometry args={[0.4, 0.9, 8, 16]} />
        <meshStandardMaterial color="#dfe8ff" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* head */}
      <mesh ref={head} position={[0, 2.05, 0]} castShadow>
        <boxGeometry args={[0.6, 0.5, 0.5]} />
        <meshStandardMaterial color="#0b1020" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* eye */}
      <mesh position={[0, 2.05, 0.26]}>
        <planeGeometry args={[0.4, 0.14]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      {/* waving arm */}
      <group ref={arm} position={[0.45, 1.5, 0]}>
        <mesh position={[0, -0.35, 0]}>
          <capsuleGeometry args={[0.12, 0.6, 6, 12]} />
          <meshStandardMaterial color="#dfe8ff" metalness={0.5} roughness={0.4} />
        </mesh>
      </group>
      {/* static arm */}
      <mesh position={[-0.45, 1.15, 0]}>
        <capsuleGeometry args={[0.12, 0.6, 6, 12]} />
        <meshStandardMaterial color="#dfe8ff" metalness={0.5} roughness={0.4} />
      </mesh>
      <pointLight color={color} intensity={2} distance={4} position={[0, 2, 0.5]} />
    </group>
  );
}
