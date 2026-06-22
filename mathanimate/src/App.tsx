import { useEffect, useState } from 'react';
import './App.css';
import InputPanel from './components/InputPanel';
import ExplanationPanel from './components/ExplanationPanel';
import LessonStage from './components/LessonStage';
import NumericalPanel from './components/NumericalPanel';
import StepNavigator from './components/StepNavigator';
import { fetchLesson } from './api';
import { applyControls, defaultInputForTopic } from './lessonMath';
import type { LessonControlSpec, LessonSpec, Topic } from './types';

interface LessonQuery {
  topic: Topic;
  input: string;
}

export default function App() {
  const [topic, setTopic] = useState<Topic>('trig');
  const defaultInput = defaultInputForTopic('trig');
  const [input, setInput] = useState(defaultInput);
  const [query, setQuery] = useState<LessonQuery>({ topic: 'trig', input: defaultInput });
  const [serverLesson, setServerLesson] = useState<LessonSpec | null>(null);
  const [lesson, setLesson] = useState<LessonSpec | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadLesson(nextTopic: Topic, nextInput: string) {
    setLoading(true);
    setError(null);
    try {
      const generatedLesson = await fetchLesson({ topic: nextTopic, input: nextInput });
      setServerLesson(generatedLesson);
      setLesson(applyControls(generatedLesson, generatedLesson.controls));
      setActiveStep(0);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Failed to load lesson');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadLesson(query.topic, query.input);
  }, [query]);

  function handleTopicChange(nextTopic: Topic) {
    const nextInput = defaultInputForTopic(nextTopic);
    setTopic(nextTopic);
    setInput(nextInput);
    setQuery({ topic: nextTopic, input: nextInput });
  }

  function handleSubmit() {
    setQuery({ topic, input });
  }

  function handleControlChange(patch: Partial<LessonControlSpec>) {
    if (!serverLesson) return;
    const nextLesson = applyControls(serverLesson, {
      ...lesson?.controls,
      ...patch,
    });
    setLesson(nextLesson);
  }

  if (!lesson) {
    return (
      <main className="app">
        <InputPanel
          topic={topic}
          input={input}
          loading={loading}
          error={error}
          onTopicChange={handleTopicChange}
          onInputChange={setInput}
          onSubmit={handleSubmit}
        />
      </main>
    );
  }

  return (
    <main className="app">
      <InputPanel
        topic={topic}
        input={input}
        loading={loading}
        error={error}
        onTopicChange={handleTopicChange}
        onInputChange={setInput}
        onSubmit={handleSubmit}
      />

      <section className="hero-panel panel">
        <div>
          <p className="eyebrow">Lesson</p>
          <h2>{lesson.title}</h2>
        </div>
        <p className="hero-summary">{lesson.summary}</p>
      </section>

      <div className="explorer-grid">
        <LessonStage
          topic={lesson.topic}
          view={lesson.views.graphical}
          controls={lesson.controls}
          activeStep={lesson.steps[activeStep]}
          onControlChange={handleControlChange}
        />
        <NumericalPanel view={lesson.views.numerical} />
        <ExplanationPanel
          view={lesson.views.explanation}
          summary={lesson.summary}
          concepts={lesson.concepts}
        />
        <StepNavigator
          steps={lesson.steps}
          activeStep={activeStep}
          onStepChange={setActiveStep}
        />
      </div>
    </main>
  );
}
