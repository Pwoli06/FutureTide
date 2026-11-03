import { getBaseline, type Scenario } from "../data";

interface Metric {
  label: string;
  value: number;
  baseline: number;
  min: number;
  max: number;
  digits: number;
  unit: string;
  higherIsBetter: boolean;
}

function healthColor(health: number): string {
  const clamped = Math.min(1, Math.max(0, health));
  const stops = [
    [232, 98, 86],
    [232, 184, 92],
    [61, 214, 176],
  ];
  const index = clamped < 0.5 ? 0 : 1;
  const t = clamped < 0.5 ? clamped / 0.5 : (clamped - 0.5) / 0.5;
  const from = stops[index];
  const to = stops[index + 1];
  const channel = (slot: number) => Math.round(from[slot] + (to[slot] - from[slot]) * t);
  return `rgb(${channel(0)} ${channel(1)} ${channel(2)})`;
}

function Gauge({ metric }: { metric: Metric }) {
  const span = metric.max - metric.min;
  const pct = Math.min(1, Math.max(0, (metric.value - metric.min) / span));
  const basePct = Math.min(1, Math.max(0, (metric.baseline - metric.min) / span));
  const health = metric.higherIsBetter ? pct : 1 - pct;
  const delta = metric.value - metric.baseline;
  const favorable = metric.higherIsBetter ? delta >= -0.05 : delta <= 0.05;
  const shown = metric.value.toFixed(metric.digits);
  const deltaText = `${delta > 0 ? "+" : ""}${delta.toFixed(metric.digits)}`;

  return (
    <div className="gauge">
      <div className="gauge-top">
        <span>{metric.label}</span>
        <span className="gauge-value">
          {shown}
          <small>{metric.unit}</small>
        </span>
      </div>
      <div className="gauge-track" aria-hidden="true">
        <div className="gauge-fill" style={{ width: `${pct * 100}%`, background: healthColor(health) }} />
        <div className="gauge-base" style={{ left: `${basePct * 100}%` }} />
      </div>
      <p className={favorable ? "delta good" : "delta bad"}>{deltaText} vs baseline</p>
    </div>
  );
}

export function StatsPanel({ scenario, compact = false }: { scenario: Scenario; compact?: boolean }) {
  const baseline = getBaseline();
  const metrics: Metric[] = [
    {
      label: "Sea surface temperature",
      value: scenario.sstAnomalyC,
      baseline: baseline.sstAnomalyC,
      min: 0,
      max: 2.6,
      digits: 1,
      unit: "°C",
      higherIsBetter: false,
    },
    {
      label: "Sea ice extent",
      value: scenario.seaIceExtentPctOfToday,
      baseline: baseline.seaIceExtentPctOfToday,
      min: 0,
      max: 100,
      digits: 0,
      unit: "% of today",
      higherIsBetter: true,
    },
    {
      label: "Krill density",
      value: scenario.krillDensityPctOfToday,
      baseline: baseline.krillDensityPctOfToday,
      min: 0,
      max: 100,
      digits: 0,
      unit: "% of today",
      higherIsBetter: true,
    },
    {
      label: "Hotspots outside MPAs",
      value: scenario.krillOutsideMpaPct,
      baseline: baseline.krillOutsideMpaPct,
      min: 0,
      max: 100,
      digits: 0,
      unit: "%",
      higherIsBetter: false,
    },
    {
      label: "Ecosystem stress",
      value: scenario.ecosystemStress,
      baseline: baseline.ecosystemStress,
      min: 0,
      max: 100,
      digits: 0,
      unit: "/ 100",
      higherIsBetter: false,
    },
  ];

  const visible = compact ? metrics.filter((metric) => metric.label !== "Sea surface temperature") : metrics;

  const predators = [
    ["Penguins", scenario.predatorHealth.penguins, baseline.predatorHealth.penguins],
    ["Whales", scenario.predatorHealth.whales, baseline.predatorHealth.whales],
    ["Seals", scenario.predatorHealth.seals, baseline.predatorHealth.seals],
  ] as const;

  return (
    <section className={compact ? "stats compact" : "stats"} aria-label="Scenario statistics">
      <header className="stats-head">
        <h3>Compared with today</h3>
        <p>Tick mark is the 2025 baseline.</p>
      </header>
      {visible.map((metric) => (
        <Gauge key={metric.label} metric={metric} />
      ))}
      {compact ? null : (
        <div className="predators">
          {predators.map(([label, value, base]) => (
            <Gauge
              key={label}
              metric={{
                label,
                value,
                baseline: base,
                min: 0,
                max: 100,
                digits: 0,
                unit: "health",
                higherIsBetter: true,
              }}
            />
          ))}
        </div>
      )}
      {compact ? null : (
        <p className="chloro">
          Chlorophyll index {scenario.chlorophyllIndex.toFixed(2)}{" "}
          <span className={scenario.chlorophyllIndex - baseline.chlorophyllIndex >= -0.001 ? "delta good" : "delta bad"}>
            {scenario.chlorophyllIndex - baseline.chlorophyllIndex > 0 ? "+" : ""}
            {(scenario.chlorophyllIndex - baseline.chlorophyllIndex).toFixed(2)} vs baseline
          </span>
        </p>
      )}
    </section>
  );
}
