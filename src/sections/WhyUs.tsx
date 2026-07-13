import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Particles } from "../components/Particles";
import { palette } from "../theme";

/** Why AImagino: a massive pulsing AI core wrapped in energy rings and neural
 * particles — the single brain powering everything upstream. */
export function WhyUs() {
  return (
    <group position={[0, 4.6, -8]}>
      <Core />
      <Rings />
      <Particles count={900} radius={7} color={palette.cyan} size={0.06} opacity={0.6} spin={0.06} drift={0.2} />
      <Particles count={400} radius={4} color={palette.magenta} size={0.05} opacity={0.5} spin={-0.1} drift={0.15} />

      <pointLight color={palette.cyan} intensity={12} distance={30} />
      <pointLight position={[0, 0, 6]} color={palette.violet} intensity={8} distance={24} />
    </group>
  );
}

function Core() {
  const inner = useRef<THREE.Mesh>(null);
  const shell = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pulse = 1 + Math.sin(t * 2) * 0.06;
    if (inner.current) {
      inner.current.scale.setScalar(pulse);
      inner.current.rotation.y = t * 0.4;
      inner.current.rotation.x = t * 0.2;
    }
    if (shell.current) {
      shell.current.rotation.y = -t * 0.15;
      shell.current.rotation.z = t * 0.1;
    }
  });
  return (
    <group>
      <mesh ref={inner}>
        <icosahedronGeometry args={[1.7, 1]} />
        <meshStandardMaterial
          color={palette.cyan}
          emissive={palette.cyan}
          emissiveIntensity={1.6}
          metalness={0.6}
          roughness={0.2}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={shell}>
        <icosahedronGeometry args={[2.6, 1]} />
        <meshBasicMaterial color={palette.violet} wireframe transparent opacity={0.35} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Rings() {
  const g = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!g.current) return;
    const t = state.clock.elapsedTime;
    g.current.children.forEach((c, i) => {
      c.rotation.x = t * (0.3 + i * 0.15);
      c.rotation.y = t * (0.2 + i * 0.1);
    });
  });
  const colors = [palette.cyan, palette.magenta, palette.green];
  return (
    <group ref={g}>
      {colors.map((col, i) => (
        <mesh key={i} rotation={[i * 0.7, i * 0.5, 0]}>
          <torusGeometry args={[3.4 + i * 0.7, 0.04, 8, 120]} />
          <meshBasicMaterial color={col} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}
