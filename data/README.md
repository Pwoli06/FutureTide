# FutureTide scenario data

`scenarios.json` holds the present-day `baseline` (2025) plus 9 `scenarios` (3 pathways x 2035/2050/2100) for the Southern Ocean krill ecosystem (CCAMLR Area 48), which extends [FishCast](https://github.com/gt-big-data/fish-cast). Types are in `schema.ts`.

**Pathway mapping:** `reducing` = SSP1-2.6, `maintaining` = SSP2-4.5, `increasing` = SSP5-8.5 (the same CMIP6 scenarios FishCast uses).

**Usage (React/Vite):**
```ts
import data from './scenarios.json';
import type { ScenarioFile, Scenario } from './schema';
const file = data as ScenarioFile;
const pick = (p: string, y: number) => file.scenarios.find(s => s.pathway === p && s.year === y)!;
const delta = pick('increasing', 2100).krillDensityPctOfToday - file.baseline.krillDensityPctOfToday;
```

**Fields:** `sstAnomalyC` = SST change in °C vs 1995-2014; `seaIceExtentPctOfToday` and `krillDensityPctOfToday` = % of today; `krillOutsideMpaPct` = % of hotspots outside protected areas; `predatorHealth` and `ecosystemStress` = 0-100; `headline`, `explanation`, `keyDrivers` = text for the UI. The `visual` block is for the 3D scene: ice ceiling fraction, krill swarm count, water murk and tint, predator count, and MPA-breach glow.

**Always show `disclaimer` in the UI.** The values are illustrative and informed by IPCC AR6 / CMIP6 ranges. They are not FishCast model output.
