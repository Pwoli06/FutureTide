import { listScenarios, type Scenario } from "../data";

export interface SceneVisual {
  iceCoverage: number;
  krillSwarmCount: number;
  waterTurbidity: number;
  waterTint: string;
  predatorCount: number;
  mpaBreachIntensity: number;
}

/**
 * How far 2035 visuals are pulled away from the three-pathway mean.
 * The underlying scenario numbers are not modified.
 */
const GAIN_2035 = 5;

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function average(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function hexToRgb(hex: string): [number, number, number] {
  const n = hex.replace("#", "");
  return [parseInt(n.slice(0, 2), 16), parseInt(n.slice(2, 4), 16), parseInt(n.slice(4, 6), 16)];
}

function rgbToHex(rgb: [number, number, number]): string {
  return `#${rgb.map((channel) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, "0")).join("")}`;
}

/** Nudge a near-identical 2035 tint toward blue or grey-green using exaggerated turbidity. */
function shiftTint(hex: string, turbidity: number): string {
  const base = hexToRgb(hex);
  const healthy: [number, number, number] = [8, 96, 162];
  const stressed: [number, number, number] = [96, 114, 100];
  const t = clamp((turbidity - 0.22) / 0.5, 0, 1);
  const mixed = base.map((channel, index) => {
    const target = healthy[index] + (stressed[index] - healthy[index]) * t;
    return channel * 0.25 + target * 0.75;
  }) as [number, number, number];
  return rgbToHex(mixed);
}

/**
 * Scene-only mapping. 2035 pathways are numerically very close, so mesh counts
 * and colors spread modestly around that year's mean. Later years pass through.
 */
export function mapVisualForScene(scenario: Scenario): SceneVisual {
  const visual = scenario.visual;
  if (scenario.year !== 2035) {
    return { ...visual };
  }

  const peers = listScenarios().filter((peer) => peer.year === 2035);
  const mean = {
    iceCoverage: average(peers.map((peer) => peer.visual.iceCoverage)),
    krillSwarmCount: average(peers.map((peer) => peer.visual.krillSwarmCount)),
    waterTurbidity: average(peers.map((peer) => peer.visual.waterTurbidity)),
    predatorCount: average(peers.map((peer) => peer.visual.predatorCount)),
    mpaBreachIntensity: average(peers.map((peer) => peer.visual.mpaBreachIntensity)),
  };

  const waterTurbidity = clamp(
    mean.waterTurbidity + (visual.waterTurbidity - mean.waterTurbidity) * GAIN_2035,
    0.12,
    0.85,
  );

  return {
    iceCoverage: clamp(mean.iceCoverage + (visual.iceCoverage - mean.iceCoverage) * GAIN_2035, 0.28, 0.95),
    krillSwarmCount: clamp(
      Math.round(mean.krillSwarmCount + (visual.krillSwarmCount - mean.krillSwarmCount) * GAIN_2035),
      10,
      56,
    ),
    waterTurbidity,
    waterTint: shiftTint(visual.waterTint, waterTurbidity),
    predatorCount: clamp(
      Math.round(mean.predatorCount + (visual.predatorCount - mean.predatorCount) * GAIN_2035),
      4,
      16,
    ),
    mpaBreachIntensity: clamp(
      mean.mpaBreachIntensity + (visual.mpaBreachIntensity - mean.mpaBreachIntensity) * GAIN_2035,
      0,
      1,
    ),
  };
}
