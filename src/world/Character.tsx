import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { travel } from "../lib/travel";
import { palette } from "../theme";

/**
 * A stylized figure seen from behind — the body the visitor "controls". Limbs
 * swing on a walk cycle driven by scroll velocity, so the walker only strides
 * when the user is actually moving. Faces -Z (into the building); camera sits
 * behind at +Z.
 */
export function Character() {
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);

  useFrame(() => {
    const swing = Math.sin(travel.step) * 0.7;
    const gait = Math.min(1, travel.velocity * 26); // 0 idle .. 1 striding
    if (legL.current) legL.current.rotation.x = swing * gait;
    if (legR.current) legR.current.rotation.x = -swing * gait;
    if (armL.current) armL.current.rotation.x = -swing * gait * 0.8;
    if (armR.current) armR.current.rotation.x = swing * gait * 0.8;
    if (body.current) {
      // subtle vertical bob + idle breathing
      body.current.position.y =
        Math.abs(Math.sin(travel.step)) * 0.06 * gait + Math.sin(travel.step * 0.5) * 0.01;
    }
  });

  const suit = new THREE.MeshStandardMaterial({
    color: "#121a2e",
    metalness: 0.5,
    roughness: 0.4,
    emissive: new THREE.Color(palette.cyan),
    emissiveIntensity: 0.08,
  });
  const skin = new THREE.MeshStandardMaterial({
    color: "#1a2542",
    metalness: 0.3,
    roughness: 0.6,
  });

  return (
    <group ref={body} rotation={[0, Math.PI, 0]}>
      {/* torso */}
      <mesh position={[0, 1.15, 0]} material={suit} castShadow>
        <capsuleGeometry args={[0.28, 0.55, 8, 16]} />
      </mesh>
      {/* subtle rim glow around shoulders */}
      <mesh position={[0, 1.45, -0.02]}>
        <torusGeometry args={[0.3, 0.02, 8, 24]} />
        <meshBasicMaterial color={palette.cyan} toneMapped={false} />
      </mesh>
      {/* head */}
      <mesh position={[0, 1.75, 0]} material={skin} castShadow>
        <sphereGeometry args={[0.2, 24, 24]} />
      </mesh>
      {/* arms */}
      <group ref={armL} position={[0.34, 1.42, 0]}>
        <mesh position={[0, -0.32, 0]} material={suit}>
          <capsuleGeometry args={[0.09, 0.55, 6, 12]} />
        </mesh>
      </group>
      <group ref={armR} position={[-0.34, 1.42, 0]}>
        <mesh position={[0, -0.32, 0]} material={suit}>
          <capsuleGeometry args={[0.09, 0.55, 6, 12]} />
        </mesh>
      </group>
      {/* legs */}
      <group ref={legL} position={[0.15, 0.75, 0]}>
        <mesh position={[0, -0.37, 0]} material={suit}>
          <capsuleGeometry args={[0.11, 0.6, 6, 12]} />
        </mesh>
      </group>
      <group ref={legR} position={[-0.15, 0.75, 0]}>
        <mesh position={[0, -0.37, 0]} material={suit}>
          <capsuleGeometry args={[0.11, 0.6, 6, 12]} />
        </mesh>
      </group>
    </group>
  );
}
