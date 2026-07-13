import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { COUNTRIES } from "../content";
import { palette } from "../theme";

const R = 3.3;

function latLonToVec3(lat: number, lon: number, r: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  );
}

/** A slowly rotating data globe. The USA, Spain and Pakistan light up with
 * pins; an orbiting ring of nodes represents the industries served. */
export function Industries() {
  const globe = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (globe.current) globe.current.rotation.y = state.clock.elapsedTime * 0.12;
  });

  // surface dots
  const dots = useMemo(() => {
    const arr: THREE.Vector3[] = [];
    for (let i = 0; i < 700; i++) {
      const y = 1 - (i / 699) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = i * 2.399963; // golden angle
      arr.push(new THREE.Vector3(Math.cos(theta) * radius, y, Math.sin(theta) * radius).multiplyScalar(R));
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(arr.flatMap((v) => [v.x, v.y, v.z]), 3),
    );
    return g;
  }, []);

  return (
    <group position={[0, 4.6, -9]}>
      {/* atmosphere glow */}
      <mesh>
        <sphereGeometry args={[R + 0.25, 48, 48]} />
        <meshBasicMaterial color={palette.cyan} transparent opacity={0.06} side={THREE.BackSide} toneMapped={false} />
      </mesh>

      <group ref={globe}>
        {/* solid dark core */}
        <mesh>
          <sphereGeometry args={[R - 0.05, 48, 48]} />
          <meshStandardMaterial color="#060b1a" metalness={0.4} roughness={0.7} />
        </mesh>
        {/* wire lat/long */}
        <mesh>
          <sphereGeometry args={[R, 24, 16]} />
          <meshBasicMaterial color={palette.cyan} wireframe transparent opacity={0.12} toneMapped={false} />
        </mesh>
        {/* surface data dots */}
        <points geometry={dots}>
          <pointsMaterial color={palette.cyan} size={0.05} sizeAttenuation transparent opacity={0.5} toneMapped={false} />
        </points>

        {/* country pins */}
        {COUNTRIES.map((c) => {
          const p = latLonToVec3(c.lat, c.lon, R);
          return (
            <group key={c.name} position={p}>
              <mesh>
                <sphereGeometry args={[0.13, 12, 12]} />
                <meshBasicMaterial color={palette.magenta} toneMapped={false} />
              </mesh>
              <mesh>
                <ringGeometry args={[0.2, 0.28, 24]} />
                <meshBasicMaterial color={palette.amber} transparent opacity={0.8} side={THREE.DoubleSide} toneMapped={false} />
              </mesh>
              <Html center distanceFactor={9} position={[0, 0.55, 0]}>
                <div className="globe-pin">
                  <span className="globe-pin__flag">{c.flag}</span>
                  {c.name}
                </div>
              </Html>
            </group>
          );
        })}
      </group>

      {/* orbiting industry ring */}
      <IndustryRing />

      <pointLight position={[4, 4, 4]} color={palette.cyan} intensity={9} distance={26} />
      <pointLight position={[-5, -2, 3]} color={palette.violet} intensity={7} distance={22} />
    </group>
  );
}

function IndustryRing() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = -state.clock.elapsedTime * 0.25;
  });
  const count = 13;
  return (
    <group ref={ref} rotation={[Math.PI / 2.6, 0, 0]}>
      {Array.from({ length: count }).map((_, i) => {
        const a = (i / count) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * (R + 1.6), 0, Math.sin(a) * (R + 1.6)]}>
            <sphereGeometry args={[0.12, 10, 10]} />
            <meshBasicMaterial color={i % 2 ? palette.green : palette.cyan} toneMapped={false} />
          </mesh>
        );
      })}
      <mesh>
        <torusGeometry args={[R + 1.6, 0.02, 8, 96]} />
        <meshBasicMaterial color={palette.cyan} transparent opacity={0.4} toneMapped={false} />
      </mesh>
    </group>
  );
}
