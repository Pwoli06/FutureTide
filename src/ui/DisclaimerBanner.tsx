import { getScenarioFile } from "../data";

export function DisclaimerBanner() {
  const { disclaimer } = getScenarioFile();
  return (
    <div className="disclaimer" role="note">
      <strong>Illustrative</strong>
      <span>{disclaimer}</span>
    </div>
  );
}
