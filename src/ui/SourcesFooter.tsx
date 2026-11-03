import { getScenarioFile } from "../data";

export function SourcesFooter() {
  const { sources, referenceProject, region } = getScenarioFile();
  return (
    <footer className="sources">
      <p>
        {region}. Extends <a href={referenceProject}>FishCast</a>.
      </p>
      <ul>
        {sources.map((source) => (
          <li key={source}>{source}</li>
        ))}
      </ul>
    </footer>
  );
}
