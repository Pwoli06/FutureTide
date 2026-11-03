import { useState } from "react";
import { CompareView } from "./compare";
import { getScenario, type Selection } from "./data";
import { OceanScene } from "./scene";
import {
  DisclaimerBanner,
  ExplanationCard,
  ScenarioControls,
  SceneLegend,
  SourcesFooter,
  StatsPanel,
  TopBar,
} from "./ui";
import "./ui/styles.css";

export default function App() {
  const [mode, setMode] = useState<"explore" | "compare">("explore");
  const [selection, setSelection] = useState<Selection>({ pathway: "increasing", year: 2100 });
  const scenario = getScenario(selection.pathway, selection.year);

  return (
    <div className="app">
      <TopBar mode={mode} onMode={setMode} />
      <DisclaimerBanner />
      {mode === "explore" ? (
        <main className="explore">
          <section className="stage" aria-label={`${scenario.sspLabel} ${scenario.year} Southern Ocean scene`}>
            <OceanScene scenario={scenario} />
            <SceneLegend year={scenario.year} />
            <p className="stage-caption">
              {scenario.sspLabel} · {scenario.year}
            </p>
          </section>
          <aside className="panel">
            <ScenarioControls value={selection} onChange={setSelection} />
            <ExplanationCard scenario={scenario} />
            <StatsPanel scenario={scenario} />
          </aside>
        </main>
      ) : (
        <CompareView />
      )}
      <SourcesFooter />
      <p className="sr-only" aria-live="polite">
        {scenario.sspLabel} {scenario.year}. {scenario.headline}
      </p>
    </div>
  );
}
