import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Instances, Instance } from "@react-three/drei";
import * as THREE from "three";
import { Drone } from "../components/Drone";
import { travel } from "../lib/travel";
import { clamp } from "../lib/motion";
import { palette } from "../theme";

const DOOR_Z = -6;
const WALL_W = 5.2; // each side wall segment width
const GAP = 3.6; // doorway gap half-width

/** The arrival: a towering HQ facade at night, holographic logo, auto-opening
 * doors, patrolling drones. */
export function Exterior() {
  const doorL = useRef<THREE.Mesh>(null);
  const doorR = useRef<THREE.Mesh>(null);

  // window grid on the tower
  const windows = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let x = -5; x <= 5; x++)
      for (let y = 0; y <= 9; y++)
        arr.push([x * 1.0, 10 + y * 1.3, -12]);
    return arr;
  }, []);

  useFrame(() => {
    // doors slide open as the walker approaches
    const dist = travel.z - DOOR_Z; // shrinks toward 0 then negative
    const open = clamp(1 - dist / 9) * GAP * 0.92;
    if (doorL.current) doorL.current.position.x = -GAP / 2 - open;
    if (doorR.current) doorR.current.position.x = GAP / 2 + open;
  });

  return (
    <group>
      {/* setback tower */}
      <mesh position={[0, 16, -12]}>
        <boxGeometry args={[13, 34, 3]} />
        <meshStandardMaterial color="#070b18" metalness={0.7} roughness={0.35} />
      </mesh>
      <Instances limit={windows.length} range={windows.length}>
        <boxGeometry args={[0.6, 0.7, 0.2]} />
        <meshStandardMaterial
          color={palette.cyan}
          emissive={palette.cyan}
          emissiveIntensity={1.4}
          toneMapped={false}
        />
        {windows.map((p, i) => (
          <Instance key={i} position={p} />
        ))}
      </Instances>

      {/* facade side walls flanking the entrance */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (GAP + WALL_W / 2), 4.2, DOOR_Z]}>
          <boxGeometry args={[WALL_W, 8.4, 1]} />
          <meshStandardMaterial color="#0a1122" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      {/* lintel */}
      <mesh position={[0, 8.7, DOOR_Z]}>
        <boxGeometry args={[GAP * 2 + WALL_W * 2, 1.4, 1.1]} />
        <meshStandardMaterial
          color="#0a1122"
          metalness={0.6}
          roughness={0.4}
          emissive={palette.violet}
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* sliding glass doors */}
      {[doorL, doorR].map((ref, i) => (
        <mesh key={i} ref={ref} position={[(i === 0 ? -1 : 1) * (GAP / 2), 3.8, DOOR_Z + 0.1]}>
          <boxGeometry args={[GAP, 7.4, 0.15]} />
          <meshStandardMaterial
            color={palette.cyan}
            transparent
            opacity={0.28}
            emissive={palette.cyan}
            emissiveIntensity={0.5}
            metalness={0.4}
            roughness={0.1}
          />
        </mesh>
      ))}

      {/* holographic logo */}
      <Html position={[0, 11.4, DOOR_Z + 0.2]} transform distanceFactor={11} occlude={false} center>
        <div className="holo-logo">
          <span className="holo-logo__mark">◆</span>
          <span className="holo-logo__text">AImagino Solution</span>
          <span className="holo-logo__sub">ENTER THE AI HEADQUARTERS</span>
        </div>
      </Html>

      {/* ground uplights */}
      <pointLight position={[-4, 1, DOOR_Z + 3]} color={palette.cyan} intensity={12} distance={16} />
      <pointLight position={[4, 1, DOOR_Z + 3]} color={palette.violet} intensity={12} distance={16} />

      {/* patrolling drones */}
      <Drone center={[0, 9, -2]} radius={6} speed={0.5} phase={0} color={palette.cyan} />
      <Drone center={[2, 11, -6]} radius={4} speed={-0.4} phase={2} color={palette.magenta} />
      <Drone center={[-3, 10, -4]} radius={5} speed={0.35} phase={4} color={palette.violet} />
    </group>
  );
}
