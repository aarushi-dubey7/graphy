import type { LessonStep } from '../types';

interface StepNavigatorProps {
  steps: LessonStep[];
  activeStep: number;
  onStepChange: (next: number) => void;
}

export default function StepNavigator({ steps, activeStep, onStepChange }: StepNavigatorProps) {
  return (
    <section className="panel">
      <div className="section-header">
        <div>
          <p className="eyebrow">Guided Steps</p>
          <h2>Lesson sequence</h2>
        </div>
        <p className="section-meta">Step {activeStep + 1} of {steps.length}</p>
      </div>

      <div className="step-list">
        {steps.map((step, index) => (
          <button
            key={step.id}
            className={index === activeStep ? 'step-card is-active' : 'step-card'}
            onClick={() => onStepChange(index)}
          >
            <span className="step-index">{index + 1}</span>
            <span>
              <strong>{step.title}</strong>
              <small>{step.detail}</small>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
