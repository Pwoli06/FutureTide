// FutureTide scenario schema. Values are illustrative, not FishCast model output.
export type Pathway = "baseline" | "reducing" | "maintaining" | "increasing";

export interface Scenario {
  id: string;                      // e.g. "ssp585_2100"; baseline is "baseline_2025"
  pathway: Pathway;                // reducing=SSP1-2.6, maintaining=SSP2-4.5, increasing=SSP5-8.5
  sspLabel: string;                // "SSP1-2.6" | "SSP2-4.5" | "SSP5-8.5" | "Present day"
  year: number;                    // 2025 (baseline), 2035, 2050, 2100
  sstAnomalyC: number;             // Southern Ocean SST change vs 1995-2014, °C (~0.2 to 2.5)
  seaIceExtentPctOfToday: number;  // Antarctic sea ice extent, % of today (0-100)
  chlorophyllIndex: number;        // relative chlorophyll-a / productivity, 0-1
  krillDensityPctOfToday: number;  // krill density in Area 48, % of today
  hotspotProbability: number;      // chance a grid cell is a krill hotspot, 0-1
  krillOutsideMpaPct: number;      // % of krill hotspots outside CCAMLR MPAs, 0-100
  predatorHealth: { penguins: number; whales: number; seals: number }; // each 0-100 (100 = thriving)
  ecosystemStress: number;         // overall stress score, 0-100 (100 = severe)
  confidence: "low" | "medium";    // confidence in the direction/magnitude
  headline: string;                // one punchy sentence
  explanation: string;             // 3-4 plain-language sentences for policymakers
  keyDrivers: string[];            // 2-3 short drivers
  visual: {
    iceCoverage: number;           // fraction of sea-ice ceiling to render, 0-1
    krillSwarmCount: number;       // number of krill swarms to spawn (int, ~15-40)
    waterTurbidity: number;        // fog/murk density, 0-1
    waterTint: string;             // hex water color, blue (healthy) -> grey-green (stressed)
    predatorCount: number;         // penguins+whales+seals to render (int, ~5-12)
    mpaBreachIntensity: number;    // glow/drift of krill beyond MPA boundary, 0-1
  };
}

export interface ScenarioFile {
  version: string;
  project: string;
  referenceProject: string;
  region: string;
  disclaimer: string;              // show this in the UI
  sources: string[];
  pathways: Record<"reducing" | "maintaining" | "increasing", string>;
  years: number[];
  baseline: Scenario;
  scenarios: Scenario[];           // 9 entries: 3 pathways x 3 years
}
