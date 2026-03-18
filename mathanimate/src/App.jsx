import { useState, useEffect, useRef } from 'react';
import './App.css';
import { AnimationEngine } from './engine/AnimationEngine.js';
import { classifyEquation } from './engine/classifier.js';
import { getSinScript, getCosScript, getTanScript } from './scripts/trig.js';
import { getLinearScript } from './scripts/linear.js';
import { getQuadraticScript } from './scripts/quadratic.js';
import Controls from './components/Controls.jsx';
import InsightPanel from './components/InsightPanel.jsx';

function getScript(equation) {
  const type = classifyEquation(equation);
  if (type === 'sin') return getSinScript();
  if (type === 'cos') return getCosScript();
  if (type === 'tan') return getTanScript();
  if (type === 'linear') return getLinearScript();
  if (type === 'quadratic') return getQuadraticScript();
  return getSinScript();
}

export default function App() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const [inputVal, setInputVal] = useState('sin(x)');
  const [isPlaying, setIsPlaying] = useState(true);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [sceneCount, setSceneCount] = useState(0);
  const [insight, setInsight] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    const engine = new AnimationEngine(canvas);
    engineRef.current = engine;

    engine.onSceneChange((idx) => {
      setSceneIndex(idx);
      const scene = engine.getCurrentScene();
      if (scene) setInsight(scene.insight);
    });

    const script = getScript('sin(x)');
    engine.loadScript(script);
    setSceneCount(script.length);
    setSceneIndex(0);
    setInsight(script[0]?.insight || '');

    return () => engine.destroy();
  }, []);

  function handleSubmit() {
    const engine = engineRef.current;
    if (!engine) return;
    const script = getScript(inputVal);
    engine.loadScript(script);
    setSceneCount(script.length);
    setSceneIndex(0);
    setInsight(script[0]?.insight || '');
    setIsPlaying(true);
  }

  function handlePlay() {
    engineRef.current?.play();
    setIsPlaying(true);
  }

  function handlePause() {
    engineRef.current?.pause();
    setIsPlaying(false);
  }

  function handleNext() {
    const engine = engineRef.current;
    if (!engine) return;
    engine.nextScene();
    setSceneIndex(engine.getSceneIndex());
    const scene = engine.getCurrentScene();
    if (scene) setInsight(scene.insight);
  }

  function handlePrev() {
    const engine = engineRef.current;
    if (!engine) return;
    engine.prevScene();
    setSceneIndex(engine.getSceneIndex());
    const scene = engine.getCurrentScene();
    if (scene) setInsight(scene.insight);
  }

  function handleSeek(index) {
    const engine = engineRef.current;
    if (!engine) return;
    engine.seekTo(index);
    setSceneIndex(engine.getSceneIndex());
    const scene = engine.getCurrentScene();
    if (scene) setInsight(scene.insight);
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-title">
          <span className="logo-icon">∿</span>
          <h1 className="app-title">MathAnimate</h1>
        </div>
        <div className="input-row">
          <input
            className="eq-input"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Enter equation, e.g. sin(x)"
          />
          <button className="go-btn" onClick={handleSubmit}>Go →</button>
        </div>
      </header>

      <div className="canvas-wrapper">
        <canvas ref={canvasRef} width={800} height={500} className="main-canvas" />
      </div>

      <Controls
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onNext={handleNext}
        onPrev={handlePrev}
        sceneIndex={sceneIndex}
        sceneCount={sceneCount}
        onSeek={handleSeek}
      />

      <InsightPanel insight={insight} />
    </div>
  );
}
