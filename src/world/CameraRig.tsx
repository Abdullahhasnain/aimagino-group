import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import { easing } from "maath";
import * as THREE from "three";
import { Character } from "./Character";
import { travel } from "../lib/travel";
import { SECTIONS, sectionZ } from "../theme";

// The walker travels from outside the building (positive z) to the last dept.
const WALK_START = 15;
const WALK_END = sectionZ(SECTIONS.length - 1);

// Camera offset behind + above the walker's shoulder.
const CAM_BACK = 5.6;
const CAM_HEIGHT = 3.15;

/**
 * Scroll → cinematic dolly. Moves the walker forward, follows behind with
 * damped, slightly handheld motion, and publishes travel state each frame.
 */
export function CameraRig() {
  const scroll = useScroll();
  const walker = useRef<THREE.Group>(null);
  const lookTarget = useRef(new THREE.Vector3(0, 1.3, -8));
  const prevOffset = useRef(0);
  const velRef = useRef(0);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const offset = scroll.offset;

    // smoothed scroll speed → walk cadence + camera lean
    const raw = Math.abs(offset - prevOffset.current);
    prevOffset.current = offset;
    velRef.current = THREE.MathUtils.lerp(velRef.current, raw, 0.12);

    const z = THREE.MathUtils.lerp(WALK_START, WALK_END, offset);
    travel.offset = offset;
    travel.z = z;
    travel.velocity = velRef.current;
    travel.step += Math.max(velRef.current * 210, 0) + 0.004; // idle micro-motion

    // move the walker
    if (walker.current) {
      walker.current.position.z = z;
      // gentle sideways weave as they stride
      walker.current.position.x = Math.sin(travel.step * 0.5) * 0.12;
    }

    const t = state.clock.elapsedTime;
    const lean = Math.min(velRef.current * 40, 1);

    // handheld sway grows subtly with movement
    const swayX = Math.sin(t * 0.6) * (0.22 + lean * 0.3);
    const swayY = Math.cos(t * 0.9) * (0.12 + lean * 0.12);

    const camTarget: [number, number, number] = [
      swayX,
      CAM_HEIGHT + swayY,
      z + CAM_BACK - lean * 0.8, // pull in slightly when moving fast
    ];
    easing.damp3(state.camera.position, camTarget, 0.35, dt);

    // look ahead of the walker, over the shoulder
    easing.damp3(
      lookTarget.current,
      [walker.current ? walker.current.position.x : 0, 1.35, z - 7],
      0.4,
      dt,
    );
    state.camera.lookAt(lookTarget.current);
  });

  return (
    <group ref={walker} position={[0, 0, WALK_START]}>
      <Character />
    </group>
  );
}
