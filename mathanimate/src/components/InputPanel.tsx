import type { Topic } from '../types';

interface InputPanelProps {
  topic: Topic;
  input: string;
  loading: boolean;
  error: string | null;
  onTopicChange: (topic: Topic) => void;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
}

export default function InputPanel({
  topic,
  input,
  loading,
  error,
  onTopicChange,
  onInputChange,
  onSubmit,
}: InputPanelProps) {
  return (
    <section className="panel panel-input">
      <div className="panel-heading">
        <p className="eyebrow">Concept Input</p>
        <h1>Graphy</h1>
        <p className="lede">Deterministic math lessons with synchronized visual, numerical, and explanatory views.</p>
      </div>

      <div className="topic-tabs" role="tablist" aria-label="Topic">
        <button
          className={topic === 'trig' ? 'tab is-active' : 'tab'}
          onClick={() => onTopicChange('trig')}
        >
          Trigonometry
        </button>
        <button
          className={topic === 'vector2d' ? 'tab is-active' : 'tab'}
          onClick={() => onTopicChange('vector2d')}
        >
          2D Vectors
        </button>
      </div>

      <label className="input-label" htmlFor="prompt-input">Prompt or expression</label>
      <div className="input-row">
        <input
          id="prompt-input"
          className="eq-input"
          value={input}
          onChange={(event) => onInputChange(event.target.value)}
          onKeyDown={(event) => event.key === 'Enter' && onSubmit()}
          placeholder={topic === 'trig' ? 'show sine on the unit circle' : 'add [2,1] and [1,3]'}
        />
        <button className="go-btn" onClick={onSubmit} disabled={loading}>
          {loading ? 'Loading…' : 'Explore'}
        </button>
      </div>

      {error ? <p className="error-text">{error}</p> : null}
    </section>
  );
}
