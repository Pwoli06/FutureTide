import { useState } from "react";
import { getBaseline, getScenario, PATHWAYS, type PathwayChoice, type Scenario, type Selection } from "../data";
import { OceanScene } from "../scene";
import { ExplanationCard, ScenarioControls, StatsPanel } from "../ui";

const PRESETS: { label: string; left: Selection; right: Selection }[] = [
  { label: "Best vs worst 2100", left: { pathway: "reducing", year: 2100 }, right: { pathway: "increasing", year: 2100 } },
  { label: "Best vs worst 2050", left: { pathway: "reducing", year: 2050 }, right: { pathway: "increasing", year: 2050 } },
  { label: "High emissions: 2035 vs 2100", left: { pathway: "increasing", year: 2035 }, right: { pathway: "increasing", year: 2100 } },
];

export function CompareView() {
  const [left, setLeft] = useState<Selection>(PRESETS[0].left);
  const [right, setRight] = useState<Selection>(PRESETS[0].right);
  const leftScenario = getScenario(left.pathway, left.year);
  const rightScenario = getScenario(right.pathway, right.year);
  const same = (a: Selection, b: Selection) => a.pathway === b.pathway && a.year === b.year;

  return (
    <div className="compare-wrap">
      <div className="compare-presets" role="group" aria-label="Comparison presets">
        <span className="pane-kicker">Quick compare</span>
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            className={same(preset.left, left) && same(preset.right, right) ? "preset is-on" : "preset"}
            onClick={() => {
              setLeft(preset.left);
              setRight(preset.right);
            }}
          >
            {preset.label}
          </button>
        ))}
        <button
          type="button"
          className="preset"
          onClick={() => {
            setLeft(right);
            setRight(left);
          }}
        >
          ⇄ Swap
        </button>
      </div>
      <div className="compare">
        <Pane title="A" selection={left} onChange={setLeft} scenario={leftScenario} />
        <Pane title="B" selection={right} onChange={setRight} scenario={rightScenario} />
      </div>
      <div className="compare-insights">
        <DiffTable a={leftScenario} b={rightScenario} />
        <TrajectoryChart active={[left.pathway, right.pathway]} />
      </div>
    </div>
  );
}

function Pane({
  title,
  selection,
  onChange,
  scenario,
}: {
  title: string;
  selection: Selection;
  onChange: (next: Selection) => void;
  scenario: Scenario;
}) {
  return (
    <section className="compare-pane" aria-label={`Scenario ${title}`}>
      <div className="pane-bar">
        <p className="pane-kicker">Scenario {title}</p>
        <ScenarioControls value={selection} onChange={onChange} compact />
      </div>
      <div className="pane-stage">
        <OceanScene scenario={scenario} quality="low" />
      </div>
      <ExplanationCard scenario={scenario} compact />
      <StatsPanel scenario={scenario} compact />
    </section>
  );
}

/* ---------- Difference table ---------- */

interface Metric {
  label: string;
  unit: string;
  decimals: number;
  higherIsBetter: boolean;
  get: (s: Scenario) => number;
}

const METRICS: Metric[] = [
  { label: "Sea surface warming", unit: "°C", decimals: 2, higherIsBetter: false, get: (s) => s.sstAnomalyC },
  { label: "Sea ice extent", unit: "% of today", decimals: 0, higherIsBetter: true, get: (s) => s.seaIceExtentPctOfToday },
  { label: "Krill density", unit: "% of today", decimals: 0, higherIsBetter: true, get: (s) => s.krillDensityPctOfToday },
  { label: "Krill hotspots outside MPAs", unit: "%", decimals: 0, higherIsBetter: false, get: (s) => s.krillOutsideMpaPct },
  { label: "Penguin health", unit: "/100", decimals: 0, higherIsBetter: true, get: (s) => s.predatorHealth.penguins },
  { label: "Whale health", unit: "/100", decimals: 0, higherIsBetter: true, get: (s) => s.predatorHealth.whales },
  { label: "Seal health", unit: "/100", decimals: 0, higherIsBetter: true, get: (s) => s.predatorHealth.seals },
  { label: "Ecosystem stress", unit: "/100", decimals: 0, higherIsBetter: false, get: (s) => s.ecosystemStress },
];

function fmt(n: number, d: number) {
  return n.toFixed(d);
}

function DiffTable({ a, b }: { a: Scenario; b: Scenario }) {
  let aWins = 0;
  let bWins = 0;
  const rows = METRICS.map((m) => {
    const va = m.get(a);
    const vb = m.get(b);
    const diff = vb - va;
    let better: "A" | "B" | null = null;
    if (Math.abs(diff) > 1e-9) {
      better = (diff > 0) === m.higherIsBetter ? "B" : "A";
      if (better === "A") aWins++;
      else bWins++;
    }
    return { m, va, vb, diff, better };
  });
  const verdict =
    aWins === bWins
      ? "These two futures are about equally healthy."
      : `Future ${aWins > bWins ? "A" : "B"} is healthier on ${Math.max(aWins, bWins)} of ${METRICS.length} indicators.`;

  return (
    <section className="diff-card" aria-label="Difference between scenario A and B">
      <header className="diff-head">
        <h3>What changes between A and B</h3>
        <p>{verdict}</p>
      </header>
      <table className="diff">
        <thead>
          <tr>
            <th scope="col">Indicator</th>
            <th scope="col">A · {a.sspLabel} {a.year}</th>
            <th scope="col">B · {b.sspLabel} {b.year}</th>
            <th scope="col">B − A</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ m, va, vb, diff, better }) => (
            <tr key={m.label}>
              <th scope="row">
                {m.label} <span className="diff-unit">{m.unit}</span>
              </th>
              <td className={better === "A" ? "is-better" : undefined}>{fmt(va, m.decimals)}</td>
              <td className={better === "B" ? "is-better" : undefined}>{fmt(vb, m.decimals)}</td>
              <td className={better === null ? "diff-zero" : better === "B" ? "diff-good" : "diff-bad"}>
                {diff > 0 ? "+" : ""}
                {fmt(diff, m.decimals)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="diff-note">Green marks the healthier value. Illustrative scenario values, not predictions.</p>
    </section>
  );
}

/* ---------- Ecosystem stress trajectory ---------- */

const PATHWAY_COLORS: Record<PathwayChoice, string> = {
  reducing: "#3dd6b0",
  maintaining: "#e4c36a",
  increasing: "#ff6d5c",
};
const PATHWAY_LABELS: Record<PathwayChoice, string> = {
  reducing: "Reducing",
  maintaining: "Maintaining",
  increasing: "Increasing",
};

const W = 380;
const H = 190;
const PL = 34;
const PR = 20;
const PT = 14;
const PB = 26;
const xFor = (year: number) => PL + ((year - 2025) / 75) * (W - PL - PR);
const yFor = (v: number) => PT + (1 - v / 100) * (H - PT - PB);

function trajectory(pathway: PathwayChoice) {
  const base = getBaseline();
  return [
    { year: base.year, stress: base.ecosystemStress },
    ...[2035, 2050, 2100].map((year) => ({ year, stress: getScenario(pathway, year).ecosystemStress })),
  ];
}

function TrajectoryChart({ active }: { active: PathwayChoice[] }) {
  return (
    <figure className="traj-card">
      <figcaption>
        <h3>Ecosystem stress over time</h3>
        <p>All paths start from today (2025). Highlighted: the paths in A and B.</p>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Ecosystem stress from 2025 to 2100 for three pathways">
        {[0, 25, 50, 75, 100].map((t) => (
          <g key={t}>
            <line x1={PL} x2={W - PR} y1={yFor(t)} y2={yFor(t)} stroke="rgba(176,220,236,0.12)" />
            <text x={PL - 6} y={yFor(t) + 3} textAnchor="end" className="traj-tick">
              {t}
            </text>
          </g>
        ))}
        {[2025, 2035, 2050, 2100].map((y) => (
          <text key={y} x={xFor(y)} y={H - 8} textAnchor="middle" className="traj-tick">
            {y}
          </text>
        ))}
        {PATHWAYS.map((p) => {
          const on = active.includes(p);
          const pts = trajectory(p);
          return (
            <g key={p} opacity={on ? 1 : 0.3}>
              <polyline
                points={pts.map((pt) => `${xFor(pt.year)},${yFor(pt.stress)}`).join(" ")}
                fill="none"
                stroke={PATHWAY_COLORS[p]}
                strokeWidth={on ? 3 : 1.5}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {pts.map((pt) => (
                <circle key={pt.year} cx={xFor(pt.year)} cy={yFor(pt.stress)} r={on ? 3.6 : 2.2} fill={PATHWAY_COLORS[p]}>
                  <title>{`${PATHWAY_LABELS[p]} ${pt.year}: stress ${pt.stress}`}</title>
                </circle>
              ))}
            </g>
          );
        })}
      </svg>
      <ul className="traj-legend">
        {PATHWAYS.map((p) => (
          <li key={p} className={active.includes(p) ? "is-on" : undefined}>
            <i style={{ background: PATHWAY_COLORS[p] }} />
            {PATHWAY_LABELS[p]}
          </li>
        ))}
      </ul>
    </figure>
  );
}
