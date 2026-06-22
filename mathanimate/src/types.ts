export type Topic = 'trig' | 'vector2d';

export type InputMode = 'freeform' | 'preset';

export interface LessonRequest {
  topic: Topic;
  input: string;
  viewPrefs?: string[];
}

export interface LessonSummaryMetric {
  label: string;
  value: string;
}

export interface ExplanationBlock {
  title: string;
  body: string;
}

export interface LessonStep {
  id: string;
  title: string;
  detail: string;
  focus: string[];
}

export interface TrigPoint {
  angleDegrees: number;
  radians: number;
  sin: number;
  cos: number;
  tan: string;
}

export interface VectorSample {
  label: string;
  x: number;
  y: number;
  magnitude: number;
}

export interface GraphicalViewSpec {
  kind: 'trig' | 'vector2d';
  title: string;
  angleDegrees?: number;
  trigFunction?: 'sin' | 'cos' | 'tan';
  vectorA?: [number, number];
  vectorB?: [number, number];
  resultant?: [number, number];
  projection?: [number, number];
}

export interface NumericalViewSpec {
  title: string;
  metrics: LessonSummaryMetric[];
  trigTable?: TrigPoint[];
  vectorTable?: VectorSample[];
}

export interface ExplanationViewSpec {
  title: string;
  blocks: ExplanationBlock[];
}

export interface LessonControlSpec {
  angleDegrees?: number;
  vectorA?: [number, number];
  vectorB?: [number, number];
  scalar?: number;
}

export interface LessonSpec {
  topic: Topic;
  title: string;
  summary: string;
  concepts: string[];
  controls: LessonControlSpec;
  views: {
    graphical: GraphicalViewSpec;
    numerical: NumericalViewSpec;
    explanation: ExplanationViewSpec;
  };
  steps: LessonStep[];
}
