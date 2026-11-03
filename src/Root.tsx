import { Suspense, lazy, useState } from "react";
import App, { type ClassicMode } from "./App";
import { getScenarioFile } from "./data";

// Teammate @sohitpatro123's globe + dive simulation, loaded lazily so the classic views stay light.
const FutureTide = lazy(() =>
  import("@/components/futuretide/FutureTide").then((m) => ({ default: m.FutureTide })),
);

type View = "simulation" | ClassicMode;

const TABS: { id: View; label: string }[] = [
  { id: "simulation", label: "Simulation" },
  { id: "explore", label: "Explore" },
  { id: "compare", label: "Compare" },
];

export default function Root() {
  const [view, setView] = useState<View>("simulation");
  return (
    <>
      <nav className="shell-bar" aria-label="FutureTide views">
        <div className="shell-tabs" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={view === t.id}
              onClick={() => setView(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="shell-note" title={getScenarioFile().disclaimer}>
          <strong>Illustrative scenarios, not predictions.</strong>
          <span> Not FishCast model output.</span>
        </p>
      </nav>
      <div className="shell-body">
        {view === "simulation" ? (
          <Suspense fallback={<div className="shell-loading">Loading the Southern Ocean…</div>}>
            <FutureTide />
          </Suspense>
        ) : (
          <App mode={view} onMode={setView} />
        )}
      </div>
    </>
  );
}
