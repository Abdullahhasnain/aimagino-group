import { useRef } from "react";
import type { ComponentProps } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { HoloPanel, VoiceWave } from "../components/Holo";
import { Robot } from "../components/Drone";
import { palette } from "../theme";

const COLORS = [palette.cyan, palette.violet, palette.magenta, palette.green];

/** AI Agent control room: banks of holographic assistants, live voice waves,
 * a central dashboard, and robotic helpers on the floor. */
export function Agents() {
  return (
    <group>
      {/* left + right banks of speaking-assistant panels */}
      {[-1, 1].map((side) =>
        [0, 1, 2].map((row) => (
          <FloatingAgent
            key={`${side}-${row}`}
            position={[side * 8, 2.4 + row * 2.3, -2 - row * 3]}
            rotation={[0, -side * 0.5, 0]}
            color={COLORS[(row + (side > 0 ? 1 : 0)) % COLORS.length]}
            phase={row + side}
          />
        )),
      )}

      {/* central dashboard */}
      <group position={[0, 4.2, -12]}>
        <HoloPanel width={7} height={4} color={palette.cyan} opacity={0.1}>
          <mesh position={[0, 0.9, 0.02]}>
            <planeGeometry args={[6.4, 0.5]} />
            <meshBasicMaterial color={palette.cyan} transparent opacity={0.35} toneMapped={false} />
          </mesh>
          {/* faux chart bars */}
          {Array.from({ length: 10 }).map((_, i) => (
            <ChartBar key={i} x={-2.7 + i * 0.6} i={i} />
          ))}
        </HoloPanel>
        <pointLight color={palette.cyan} intensity={6} distance={18} position={[0, 0, 2]} />
      </group>

      {/* greeter robots */}
      <Robot position={[-3.2, 0, 2]} rotation={[0, 0.5, 0]} color={palette.cyan} />
      <Robot position={[3.4, 0, -1]} rotation={[0, -0.6, 0]} color={palette.magenta} wave={false} />

      <pointLight position={[0, 6, 4]} color={palette.violet} intensity={10} distance={26} />
    </group>
  );
}

function FloatingAgent({
  color,
  phase,
  ...props
}: { color: string; phase: number } & ComponentProps<"group">) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y =
        (props.position as [number, number, number])[1] +
        Math.sin(state.clock.elapsedTime * 0.8 + phase) * 0.18;
    }
  });
  return (
    <group ref={ref} {...props}>
      <HoloPanel width={2.8} height={1.7} color={color}>
        <group position={[0, -0.1, 0.05]}>
          <VoiceWave bars={9} color={color} width={2} height={0.7} seed={phase} />
        </group>
        <mesh position={[0, 0.55, 0.03]}>
          <planeGeometry args={[2.4, 0.16]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} toneMapped={false} />
        </mesh>
      </HoloPanel>
    </group>
  );
}

function ChartBar({ x, i }: { x: number; i: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const h = 0.4 + Math.abs(Math.sin(state.clock.elapsedTime * 1.5 + i)) * 1.4;
    ref.current.scale.y = h;
    ref.current.position.y = -0.9 + h / 2;
  });
  return (
    <mesh ref={ref} position={[x, -0.9, 0.03]}>
      <boxGeometry args={[0.3, 1, 0.05]} />
      <meshBasicMaterial color={palette.green} toneMapped={false} />
    </mesh>
  );
}
