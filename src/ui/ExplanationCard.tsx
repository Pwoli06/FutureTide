import type { Scenario } from "../data";

export function ConfidenceBadge({ level }: { level: Scenario["confidence"] }) {
  return <span className={`badge badge-${level}`}>{level} confidence</span>;
}

export function ExplanationCard({ scenario, compact = false }: { scenario: Scenario; compact?: boolean }) {
  return (
    <article className={compact ? "explain compact" : "explain"}>
      <div className="explain-meta">
        <span className="ssp">{scenario.sspLabel}</span>
        <span className="year-chip">{scenario.year}</span>
        <ConfidenceBadge level={scenario.confidence} />
      </div>
      <h2>{scenario.headline}</h2>
      {compact ? null : <p>{scenario.explanation}</p>}
      {compact ? null : (
        <ul className="drivers">
          {scenario.keyDrivers.map((driver) => (
            <li key={driver}>{driver}</li>
          ))}
        </ul>
      )}
    </article>
  );
}
