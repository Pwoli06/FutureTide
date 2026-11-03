// Static-site replacement for the original server-side Grok call.
// The Grok text ships pre-generated in data/scenarios.json (headline, explanation, keyDrivers),
// so the brief works on GitHub Pages with no API key and no backend.
import { getBaseline, getScenario, type Scenario } from "@/data";
import { PATHWAYS, metricsAt, sharedPathway, stationById, type Brief, type PathwayId } from "@/lib/futuretide/model";

export type BriefInput = {
  pathway: PathwayId;
  year: number;
  stationId: string;
  comparePathway?: PathwayId;
  compareYear?: number;
};

const SNAPSHOTS = [2035, 2050, 2100] as const;

/** Nearest Grok-written snapshot in data/scenarios.json for a pathway and clock year. */
export function snapshotFor(pathway: PathwayId, year: number): Scenario {
  if (year < 2030) return getBaseline();
  let best: number = SNAPSHOTS[0];
  for (const y of SNAPSHOTS) if (Math.abs(y - year) < Math.abs(best - year)) best = y;
  return getScenario(sharedPathway(pathway), best);
}

function r1(n: number) {
  return Math.round(n * 10) / 10;
}

export function buildBrief(input: BriefInput): Brief {
  const station = stationById(input.stationId);
  const path = PATHWAYS.find((p) => p.id === input.pathway)!;
  const snap = snapshotFor(input.pathway, input.year);
  const m = metricsAt(input.pathway, input.year, station);

  const consequences = [
    `At ${station.short}, the krill habitat index sits near ${Math.round(m.krill)} (100 = today) and the sea-ice season is about ${Math.round(m.ice)} days shorter.`,
    `About ${snap.krillOutsideMpaPct}% of krill hotspots would sit outside protected areas in the ${snap.sspLabel} ${snap.year} snapshot.`,
    `Predator health (penguins ${snap.predatorHealth.penguins}, whales ${snap.predatorHealth.whales}, seals ${snap.predatorHealth.seals} out of 100) tracks the krill supply.`,
  ];

  let narrative = snap.explanation;
  if (input.comparePathway && input.compareYear) {
    const other = snapshotFor(input.comparePathway, input.compareYear);
    const om = metricsAt(input.comparePathway, input.compareYear, station);
    const otherPath = PATHWAYS.find((p) => p.id === input.comparePathway)!;
    narrative += ` Compared with ${otherPath.label} (${otherPath.ssp}) in ${Math.round(input.compareYear)}: ocean heat +${r1(om.sst)} °C vs +${r1(m.sst)} °C, krill index ${Math.round(om.krill)} vs ${Math.round(m.krill)}, ecosystem stress ${other.ecosystemStress} vs ${snap.ecosystemStress}.`;
  }

  return {
    headline: snap.headline,
    narrative,
    consequences,
    uncertainty: `Confidence: ${snap.confidence}. ${path.label} follows the ${path.ssp}. These are illustrative scenario values written by Grok Bot from published CMIP6 / IPCC AR6 ranges, not FishCast model output and not a validated forecast.`,
    decisions: [
      ...snap.keyDrivers.map((d) => `Which CCAMLR or climate decisions most affect ${d.toLowerCase()}?`),
      `Is ${station.mpa.replace(/\.$/, "")} enough protection if krill shift south?`,
    ].slice(0, 4),
  };
}
