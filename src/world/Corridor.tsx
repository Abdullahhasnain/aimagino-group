import { useMemo } from "react";
import { MeshReflectorMaterial } from "@react-three/drei";
import { GlowBar } from "../components/Holo";
import { quality } from "../lib/device";
import { palette, SECTIONS, SECTION_DEPTH, sectionZ } from "../theme";

const START_Z = 22;
const END_Z = sectionZ(SECTIONS.length - 1) - 14;
const LENGTH = START_Z - END_Z;
const MID_Z = (START_Z + END_Z) / 2;
const HALF_W = 13;

/** The architectural spine: one long mirror floor, ceiling light rails, edge
 * neon, and a glowing doorway arch at every department threshold. */
export function Corridor() {
  const doorways = useMemo(
    () =>
      SECTIONS.slice(0, -1).map((_, i) => sectionZ(i) - SECTION_DEPTH / 2),
    [],
  );

  return (
    <group>
      {/* reflective floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, MID_Z]}>
        <planeGeometry args={[HALF_W * 2, LENGTH]} />
        <MeshReflectorMaterial
          resolution={quality.reflectorResolution}
          mixBlur={1}
          mixStrength={6}
          blur={[400, 120]}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.2}
          color="#05060f"
          metalness={0.85}
          roughness={0.55}
          mirror={0.55}
        />
      </mesh>

      {/* floor edge neon */}
      <GlowBar
        length={LENGTH}
        thickness={0.12}
        color={palette.cyan}
        intensity={2.4}
        position={[-HALF_W + 0.4, 0.06, MID_Z]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <GlowBar
        length={LENGTH}
        thickness={0.12}
        color={palette.violet}
        intensity={2.4}
        position={[HALF_W - 0.4, 0.06, MID_Z]}
        rotation={[0, Math.PI / 2, 0]}
      />

      {/* ceiling light rails */}
      {[-3.5, 0, 3.5].map((x, i) => (
        <GlowBar
          key={i}
          length={LENGTH}
          thickness={0.16}
          color={i === 1 ? palette.white : palette.cyan}
          intensity={i === 1 ? 1.6 : 1}
          position={[x, 8.4, MID_Z]}
          rotation={[0, Math.PI / 2, 0]}
        />
      ))}

      {/* doorway arches at each threshold */}
      {doorways.map((z, i) => (
        <Doorway key={i} z={z} color={i % 2 === 0 ? palette.cyan : palette.violet} />
      ))}
    </group>
  );
}

function Doorway({ z, color }: { z: number; color: string }) {
  return (
    <group position={[0, 0, z]}>
      {[-HALF_W + 1.2, HALF_W - 1.2].map((x, i) => (
        <mesh key={i} position={[x, 4.2, 0]}>
          <boxGeometry args={[0.35, 8.4, 0.35]} />
          <meshStandardMaterial
            color="#0b1020"
            metalness={0.7}
            roughness={0.3}
            emissive={color}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
      <GlowBar
        length={HALF_W * 2 - 2}
        thickness={0.3}
        color={color}
        intensity={2}
        position={[0, 8.3, 0]}
      />
    </group>
  );
}
