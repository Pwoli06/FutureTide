import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMemo } from "react";
import type { Scenario } from "../data";
import { KrillSwarms } from "./KrillSwarms";
import { LerpedVisualProvider } from "./LerpedVisual";
import { MpaRing } from "./MpaRing";
import { OceanVolume } from "./OceanVolume";
import { Predators } from "./Predators";
import { SeaIce } from "./SeaIce";
import { mapVisualForScene } from "./mapVisual";

export function OceanScene({ scenario, quality = "high" }: { scenario: Scenario; quality?: "high" | "low" }) {
  const visual = useMemo(() => mapVisualForScene(scenario), [scenario]);

  return (
    <Canvas
      dpr={quality === "high" ? [1, 1.6] : [1, 1.15]}
      camera={{ position: [13.5, 8.4, 16.5], fov: 40, near: 0.1, far: 90 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <LerpedVisualProvider target={visual}>
        <OceanVolume />
        <SeaIce />
        <KrillSwarms />
        <Predators />
        <MpaRing />
      </LerpedVisualProvider>
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        autoRotate
        autoRotateSpeed={0.35}
        minDistance={8}
        maxDistance={30}
        minPolarAngle={0.22}
        maxPolarAngle={1.25}
        target={[0, -1.1, 0]}
      />
    </Canvas>
  );
}
