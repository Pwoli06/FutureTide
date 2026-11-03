import { PATHWAYS, getScenarioFile, type PathwayChoice, type Selection } from "../data";

const COPY: Record<PathwayChoice, { title: string; hint: string }> = {
  reducing: { title: "Reducing", hint: "Fossil fuels decline" },
  maintaining: { title: "Maintaining", hint: "Near today's course" },
  increasing: { title: "Increasing", hint: "Fossil fuels rise" },
};

export function ScenarioControls({
  value,
  onChange,
  compact = false,
}: {
  value: Selection;
  onChange: (next: Selection) => void;
  compact?: boolean;
}) {
  const file = getScenarioFile();

  return (
    <div className={compact ? "controls compact" : "controls"}>
      <div className="control-block">
        <p className="control-label">Fossil-fuel pathway</p>
        <div className="pathways" role="radiogroup" aria-label="Fossil-fuel pathway">
          {PATHWAYS.map((pathway) => (
            <button
              key={pathway}
              type="button"
              role="radio"
              aria-checked={value.pathway === pathway}
              className={`pathway pathway-${pathway}`}
              onClick={() => onChange({ ...value, pathway })}
            >
              <span className="pathway-title">{COPY[pathway].title}</span>
              <span className="pathway-ssp">{file.pathways[pathway]}</span>
              {compact ? null : <span className="pathway-hint">{COPY[pathway].hint}</span>}
            </button>
          ))}
        </div>
      </div>
      <div className="control-block">
        <p className="control-label">Year</p>
        <div className="years" role="radiogroup" aria-label="Year">
          {file.years.map((year) => (
            <button
              key={year}
              type="button"
              role="radio"
              aria-checked={value.year === year}
              className={value.year === year ? "year on" : "year"}
              onClick={() => onChange({ ...value, year })}
            >
              {year}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
