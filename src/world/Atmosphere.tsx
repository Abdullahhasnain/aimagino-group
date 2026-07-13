import { Stars } from "@react-three/drei";
import { palette } from "../theme";

/** Global background, fog, ambient fill and night sky. Per-scene accent lights
 * live inside each department. */
export function Atmosphere() {
  return (
    <>
      <color attach="background" args={[palette.bgDeep]} />
      <fogExp2 attach="fog" args={[palette.bgDeep, 0.011]} />

      <ambientLight intensity={0.35} color={palette.white} />
      <hemisphereLight
        intensity={0.5}
        color={palette.cyan}
        groundColor={palette.violet}
      />
      {/* soft key from above-front */}
      <directionalLight
        position={[6, 18, 10]}
        intensity={0.6}
        color={palette.white}
      />

      <Stars radius={200} depth={80} count={2600} factor={5} saturation={0} fade speed={0.6} />
    </>
  );
}
