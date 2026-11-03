export function SceneLegend({ year }: { year: number }) {
  return (
    <div className="legend">
      <span>
        <i className="swatch ice" /> Sea ice
      </span>
      <span>
        <i className="swatch krill" /> Krill
      </span>
      <span>
        <i className="swatch mpa" /> MPA boundary
      </span>
      {year === 2035 ? <span className="exag">2035 spacing exaggerated</span> : null}
    </div>
  );
}
