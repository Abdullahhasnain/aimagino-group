import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Particles } from "../components/Particles";
import { palette } from "../theme";

/** Data Infrastructure Center: aisles of glowing server racks, fiber runs
 * overhead, and data particles streaming through the room. */
export function DataCenter() {
  return (
    <group>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 6.5, 0, 0]}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Rack
              key={i}
              position={[0, 2.1, 6 - i * 4]}
              rotation={[0, -side * Math.PI * 0.5, 0]}
              tint={i % 2 === 0 ? palette.cyan : palette.green}
              phase={i + (side > 0 ? 3 : 0)}
            />
          ))}
        </group>
      ))}

      {/* fiber runs overhead */}
      <Fiber color={palette.cyan} y={7} offset={0} />
      <Fiber color={palette.violet} y={7.6} offset={1.4} />
      <Fiber color={palette.magenta} y={6.6} offset={-1.2} />

      {/* streaming data motes down the aisle */}
      <StreamingMotes />
      <Particles
        count={500}
        shape="box"
        spread={[16, 10, 34]}
        position={[0, 5, -6]}
        color={palette.cyan}
        size={0.05}
        opacity={0.5}
        spin={0.01}
      />

      <pointLight position={[0, 6, 2]} color={palette.cyan} intensity={9} distance={30} />
      <pointLight position={[0, 4, -12]} color={palette.green} intensity={7} distance={26} />
    </group>
  );
}

function Rack({
  tint,
  phase,
  ...props
}: { tint: string; phase: number } & React.ComponentProps<"group">) {
  const lights = useRef<THREE.Group>(null);
  const rows = 9;
  useFrame((state) => {
    if (!lights.current) return;
    const t = state.clock.elapsedTime * 4;
    lights.current.children.forEach((c, i) => {
      const m = (c as THREE.Mesh).material as THREE.MeshBasicMaterial;
      m.opacity = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t + i * 1.3 + phase));
    });
  });
  return (
    <group {...props}>
      {/* chassis */}
      <mesh>
        <boxGeometry args={[1.6, 4, 1]} />
        <meshStandardMaterial color="#080d1a" metalness={0.7} roughness={0.35} />
      </mesh>
      {/* blinking light rows on the front face */}
      <group ref={lights} position={[0, 0, 0.52]}>
        {Array.from({ length: rows }).map((_, i) => (
          <mesh key={i} position={[0, 1.7 - i * 0.42, 0]}>
            <planeGeometry args={[1.3, 0.14]} />
            <meshBasicMaterial color={tint} transparent opacity={0.7} toneMapped={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Fiber({ color, y, offset }: { color: string; y: number; offset: number }) {
  const geo = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(offset, y, 8),
      new THREE.Vector3(offset + 1.5, y + 0.6, 0),
      new THREE.Vector3(offset - 1.2, y - 0.4, -8),
      new THREE.Vector3(offset, y + 0.3, -16),
    ]);
    return new THREE.TubeGeometry(curve, 40, 0.05, 8, false);
  }, [y, offset]);
  return (
    <mesh geometry={geo}>
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}

function StreamingMotes() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.children.forEach((c) => {
      c.position.z -= delta * 10;
      if (c.position.z < -18) c.position.z += 26;
    });
    ref.current.rotation.z = state.clock.elapsedTime * 0.1;
  });
  return (
    <group ref={ref}>
      {Array.from({ length: 24 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (pseudo(i) - 0.5) * 8,
            1 + pseudo(i * 2) * 6,
            8 - i,
          ]}
        >
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshBasicMaterial color={palette.cyan} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

function pseudo(n: number): number {
  const s = Math.sin(n * 91.7 + 13.1) * 43758.5453;
  return s - Math.floor(s);
}
