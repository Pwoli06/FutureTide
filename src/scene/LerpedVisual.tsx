import { useFrame } from "@react-three/fiber";
import { createContext, useContext, useRef, type ReactNode } from "react";
import { Color } from "three";
import type { SceneVisual } from "./mapVisual";

export interface VisualStore {
  iceCoverage: number;
  krillSwarmCount: number;
  waterTurbidity: number;
  waterTint: Color;
  predatorCount: number;
  mpaBreachIntensity: number;
}

const VisualContext = createContext<React.MutableRefObject<VisualStore> | null>(null);

function createStore(visual: SceneVisual): VisualStore {
  return {
    iceCoverage: visual.iceCoverage,
    krillSwarmCount: visual.krillSwarmCount,
    waterTurbidity: visual.waterTurbidity,
    waterTint: new Color(visual.waterTint),
    predatorCount: visual.predatorCount,
    mpaBreachIntensity: visual.mpaBreachIntensity,
  };
}

export function LerpedVisualProvider({ target, children }: { target: SceneVisual; children: ReactNode }) {
  const store = useRef<VisualStore>(createStore(target));
  const targetRef = useRef(target);
  const targetColor = useRef(new Color(target.waterTint));
  targetRef.current = target;

  useFrame((_, delta) => {
    const current = store.current;
    const next = targetRef.current;
    const k = 1 - Math.exp(-Math.min(delta, 0.05) * 3.4);
    targetColor.current.set(next.waterTint);
    current.iceCoverage += (next.iceCoverage - current.iceCoverage) * k;
    current.krillSwarmCount += (next.krillSwarmCount - current.krillSwarmCount) * k;
    current.waterTurbidity += (next.waterTurbidity - current.waterTurbidity) * k;
    current.predatorCount += (next.predatorCount - current.predatorCount) * k;
    current.mpaBreachIntensity += (next.mpaBreachIntensity - current.mpaBreachIntensity) * k;
    current.waterTint.lerp(targetColor.current, k);
  });

  return <VisualContext.Provider value={store}>{children}</VisualContext.Provider>;
}

export function useVisualStore(): React.MutableRefObject<VisualStore> {
  const store = useContext(VisualContext);
  if (!store) {
    throw new Error("useVisualStore must be used inside LerpedVisualProvider");
  }
  return store;
}
