import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ScrollControls } from "@react-three/drei";
import { Experience } from "./world/Experience";
import { Overlay } from "./overlay/Overlay";
import { HUD } from "./overlay/HUD";
import { Loader } from "./overlay/Loader";
import { ErrorBoundary } from "./ErrorBoundary";
import { quality, isLowPower } from "./lib/device";
import { SCROLL_PAGES } from "./theme";

export default function App() {
  return (
    <ErrorBoundary>
      <Canvas
        className="stage"
        aria-hidden="true"
        dpr={quality.dpr}
        gl={{
          antialias: true,
          powerPreference: isLowPower ? "default" : "high-performance",
        }}
        camera={{ fov: 52, near: 0.1, far: 700, position: [0, 3.15, 20] }}
      >
        <Suspense fallback={null}>
          <ScrollControls pages={SCROLL_PAGES} damping={0.3}>
            <Experience />
          </ScrollControls>
        </Suspense>
      </Canvas>

      {/* Overlay lives in the main React tree (not drei's <Scroll html>
          sub-root) so content can never silently vanish if that hidden
          second root fails — it syncs to the camera via the travel
          singleton instead. */}
      <Overlay />
      <HUD />
      <Loader />
    </ErrorBoundary>
  );
}
