import type { NumericalViewSpec } from '../types';

interface NumericalPanelProps {
  view: NumericalViewSpec;
}

export default function NumericalPanel({ view }: NumericalPanelProps) {
  return (
    <section className="panel">
      <div className="section-header">
        <div>
          <p className="eyebrow">Numerical View</p>
          <h2>{view.title}</h2>
        </div>
      </div>

      <div className="metric-grid">
        {view.metrics.map((metric) => (
          <article key={metric.label} className="metric-card">
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </div>

      {view.trigTable ? (
        <table className="value-table">
          <thead>
            <tr>
              <th>Angle</th>
              <th>Radians</th>
              <th>sin</th>
              <th>cos</th>
              <th>tan</th>
            </tr>
          </thead>
          <tbody>
            {view.trigTable.map((row) => (
              <tr key={row.angleDegrees}>
                <td>{row.angleDegrees}°</td>
                <td>{row.radians}</td>
                <td>{row.sin}</td>
                <td>{row.cos}</td>
                <td>{row.tan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      {view.vectorTable ? (
        <table className="value-table">
          <thead>
            <tr>
              <th>Vector</th>
              <th>x</th>
              <th>y</th>
              <th>|v|</th>
            </tr>
          </thead>
          <tbody>
            {view.vectorTable.map((row) => (
              <tr key={row.label}>
                <td>{row.label}</td>
                <td>{row.x}</td>
                <td>{row.y}</td>
                <td>{row.magnitude}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </section>
  );
}
