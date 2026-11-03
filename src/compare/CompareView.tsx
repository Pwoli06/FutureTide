import { useState } from "react";
import { getScenario, type Selection } from "../data";
import { OceanScene } from "../scene";
import { ExplanationCard, ScenarioControls, StatsPanel } from "../ui";

export function CompareView() {
  const [left, setLeft] = useState<Selection>({ pathway: "reducing", year: 2100 });
  const [right, setRight] = useState<Selection>({ pathway: "increasing", year: 2100 });
  const leftScenario = getScenario(left.pathway, left.year);
  const rightScenario = getScenario(right.pathway, right.year);

  return (
    <div className="compare">
      <Pane title="A" selection={left} onChange={setLeft} scenario={leftScenario} />
      <Pane title="B" selection={right} onChange={setRight} scenario={rightScenario} />
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
  scenario: ReturnType<typeof getScenario>;
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
