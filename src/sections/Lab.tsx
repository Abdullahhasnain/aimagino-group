import { useMemo, useRef } from "react";
import type { ComponentProps } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { HoloPanel } from "../components/Holo";
import { Robot } from "../components/Drone";
import { palette } from "../theme";

/** Enterprise AI Lab: a live neural network, predictive dashboards, and
 * engineers building intelligent systems. */
export function Lab() {
  return (
    <group>
      <group position={[0, 4.5, -8]}>
        <NeuralNet />
      </group>

      {/* dashboards flanking the net */}
      <HoloPanel width={3.4} height={2.2} color={palette.green} position={[-7, 3.6, -3]} rotation={[0, 0.6, 0]}>
        <MiniChart color={palette.green} />
      </HoloPanel>
      <HoloPanel width={3.4} height={2.2} color={palette.cyan} position={[7, 3.6, -3]} rotation={[0, -0.6, 0]}>
        <MiniChart color={palette.cyan} />
      </HoloPanel>

      {/* engineers at workstations */}
      <Workstation position={[-3.5, 0, 3]} rotation={[0, 0.4, 0]} color={palette.cyan} />
      <Workstation position={[3.5, 0, 3]} rotation={[0, -0.4, 0]} color={palette.violet} />

      <pointLight position={[0, 6, 2]} color={palette.green} intensity={8} distance={26} />
      <pointLight position={[0, 5, -10]} color={palette.violet} intensity={7} distance={24} />
    </group>
  );
}

function NeuralNet() {
  const group = useRef<THREE.Group>(null);
  const { nodes, lineGeo } = useMemo(() => {
    const layers = [4, 6, 6, 4];
    const nodes: THREE.Vector3[][] = [];
    layers.forEach((count, li) => {
      const col: THREE.Vector3[] = [];
      for (let n = 0; n < count; n++) {
        col.push(
          new THREE.Vector3(
            (li - (layers.length - 1) / 2) * 2.4,
            (n - (count - 1) / 2) * 1.1,
            0,
          ),
        );
      }
      nodes.push(col);
    });
    const pts: number[] = [];
    for (let li = 0; li < nodes.length - 1; li++) {
      nodes[li].forEach((a) =>
        nodes[li + 1].forEach((b) => {
          pts.push(a.x, a.y, a.z, b.x, b.y, b.z);
        }),
      );
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return { nodes: nodes.flat(), lineGeo: g };
  }, []);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.35;
    }
  });

  return (
    <group ref={group}>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color={palette.cyan} transparent opacity={0.25} toneMapped={false} />
      </lineSegments>
      {nodes.map((p, i) => (
        <PulseNode key={i} position={[p.x, p.y, p.z]} i={i} />
      ))}
    </group>
  );
}

function PulseNode({ position, i }: { position: [number, number, number]; i: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const s = 0.7 + Math.abs(Math.sin(state.clock.elapsedTime * 2 + i * 0.6)) * 0.9;
    ref.current.scale.setScalar(s);
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.16, 16, 16]} />
      <meshBasicMaterial color={palette.green} toneMapped={false} />
    </mesh>
  );
}

function MiniChart({ color }: { color: string }) {
  return (
    <group position={[0, -0.2, 0.03]}>
      {Array.from({ length: 7 }).map((_, i) => (
        <ChartBar key={i} x={-1.2 + i * 0.4} i={i} color={color} />
      ))}
    </group>
  );
}

function ChartBar({ x, i, color }: { x: number; i: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const h = 0.3 + Math.abs(Math.sin(state.clock.elapsedTime * 1.3 + i * 0.8)) * 1;
    ref.current.scale.y = h;
    ref.current.position.y = -0.7 + h / 2;
  });
  return (
    <mesh ref={ref} position={[x, -0.7, 0]}>
      <boxGeometry args={[0.22, 1, 0.05]} />
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
}

function Workstation({
  color,
  ...props
}: { color: string } & ComponentProps<"group">) {
  return (
    <group {...props}>
      <mesh position={[0, 0.9, 0]}>
        <boxGeometry args={[1.8, 0.1, 0.9]} />
        <meshStandardMaterial color="#0c1426" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* monitor */}
      <mesh position={[0, 1.5, -0.3]} rotation={[-0.2, 0, 0]}>
        <planeGeometry args={[1.2, 0.7]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} toneMapped={false} />
      </mesh>
      <Robot position={[0, 0, 0.9]} rotation={[0, Math.PI, 0]} scale={0.8} color={color} wave={false} />
    </group>
  );
}
