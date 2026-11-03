import { getScenarioFile } from "../data";

export function TopBar({
  mode,
  onMode,
}: {
  mode: "explore" | "compare";
  onMode: (mode: "explore" | "compare") => void;
}) {
  const { region } = getScenarioFile();
  return (
    <header className="topbar">
      <div className="brand">
        <span className="mark" aria-hidden="true" />
        <div>
          <p className="eyebrow">Georgia Tech BDBI · Grokathon</p>
          <h1>FutureTide</h1>
        </div>
      </div>
      <p className="region">{region}</p>
      <div className="modes" role="tablist" aria-label="View mode">
        <button type="button" role="tab" aria-selected={mode === "explore"} onClick={() => onMode("explore")}>
          Explore
        </button>
        <button type="button" role="tab" aria-selected={mode === "compare"} onClick={() => onMode("compare")}>
          Compare
        </button>
      </div>
    </header>
  );
}
