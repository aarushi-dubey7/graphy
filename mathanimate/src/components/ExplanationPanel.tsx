import type { ExplanationViewSpec } from '../types';

interface ExplanationPanelProps {
  view: ExplanationViewSpec;
  summary: string;
  concepts: string[];
}

export default function ExplanationPanel({ view, summary, concepts }: ExplanationPanelProps) {
  return (
    <section className="panel">
      <div className="section-header">
        <div>
          <p className="eyebrow">Explanation View</p>
          <h2>{view.title}</h2>
        </div>
      </div>

      <p className="summary-card">{summary}</p>

      <div className="concept-tags">
        {concepts.map((concept) => (
          <span key={concept} className="concept-tag">{concept}</span>
        ))}
      </div>

      <div className="explanation-list">
        {view.blocks.map((block) => (
          <article key={block.title} className="explanation-card">
            <h3>{block.title}</h3>
            <p>{block.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
