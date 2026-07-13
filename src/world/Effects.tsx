import { EffectComposer, Bloom, Vignette, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { quality } from "../lib/device";

/** Cinematic post: bloom on all the emissive neon, a filmic vignette, and a
 * whisper of grain so gradients don't band. SMAA was dropped — it loads
 * extra lookup textures that can fail in constrained environments, and
 * WebGL's built-in antialias (set on the renderer) already covers edges. */
export function Effects() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={quality.bloomIntensity}
        luminanceThreshold={0.18}
        luminanceSmoothing={0.5}
        mipmapBlur
        radius={0.7}
      />
      <Vignette eskil={false} offset={0.25} darkness={0.75} />
      <Noise opacity={0.03} blendFunction={BlendFunction.OVERLAY} />
    </EffectComposer>
  );
}
