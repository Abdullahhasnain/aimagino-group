import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

const BASE_FOV = 52; // tuned for a landscape/desktop aspect
const BASE_ASPECT = 16 / 9;

/**
 * Perspective FOV is vertical, so a narrow portrait viewport (phones) crops
 * the horizontal view badly at a fixed FOV. Widen the vertical FOV as the
 * aspect ratio drops below the desktop baseline so the horizontal field of
 * view — corridor walls, doorways — stays roughly consistent everywhere.
 */
export function ResponsiveCamera() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);

  useEffect(() => {
    if (!("fov" in camera)) return;
    const aspect = size.width / size.height;
    const fov = aspect >= BASE_ASPECT ? BASE_FOV : BASE_FOV * (BASE_ASPECT / aspect) ** 0.5;
    camera.fov = Math.min(fov, 100);
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
  }, [camera, size]);

  return null;
}
