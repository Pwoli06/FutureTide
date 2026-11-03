import raw from "../../data/scenarios.json";
import type { Pathway, Scenario, ScenarioFile } from "../../data/schema";

export type { Pathway, Scenario, ScenarioFile };

/** Selectable futures. Baseline is the comparison anchor, not a picker option. */
export type PathwayChoice = Exclude<Pathway, "baseline">;

export interface Selection {
  pathway: PathwayChoice;
  year: number;
}

const file = raw as ScenarioFile;

export function getScenarioFile(): ScenarioFile {
  return file;
}

export function getBaseline(): Scenario {
  return file.baseline;
}

export function listScenarios(): readonly Scenario[] {
  return file.scenarios;
}

export function getScenario(pathway: PathwayChoice, year: number): Scenario {
  const found = file.scenarios.find((scenario) => scenario.pathway === pathway && scenario.year === year);
  if (!found) {
    throw new Error(`No FutureTide scenario for ${pathway} ${year}`);
  }
  return found;
}

export const PATHWAYS: readonly PathwayChoice[] = ["reducing", "maintaining", "increasing"];
