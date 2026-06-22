import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { AnimationEngine } from '../engine/AnimationEngine.js';
import type { GraphicalViewSpec, LessonControlSpec, LessonStep, Topic } from '../types';

interface LessonStageProps {
  topic: Topic;
  view: GraphicalViewSpec;
  controls: LessonControlSpec;
  activeStep: LessonStep;
  onControlChange: (patch: Partial<LessonControlSpec>) => void;
}

const VIEW_SIZE = 640;
const ORIGIN = VIEW_SIZE / 2;
const UNIT = 70;

function linePath(from: [number, number], to: [number, number]): string {
  return `M ${ORIGIN + from[0] * UNIT} ${ORIGIN - from[1] * UNIT} L ${ORIGIN + to[0] * UNIT} ${ORIGIN - to[1] * UNIT}`;
}

function pointCoords([x, y]: [number, number]) {
  return {
    x: ORIGIN + x * UNIT,
    y: ORIGIN - y * UNIT,
  };
}

export default function LessonStage({
  topic,
  view,
  controls,
  activeStep,
  onControlChange,
}: LessonStageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<AnimationEngine | null>(null);
  const [dragging, setDragging] = useState<'a' | 'b' | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const engine = new AnimationEngine(canvas);
    engineRef.current = engine;
    return () => engine.destroy();
  }, []);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    const focusLabel = activeStep.focus.join(' • ');
    engine.loadScript([
      {
        duration: 900,
        insight: focusLabel,
        draw(ctx, t, width, height) {
          ctx.fillStyle = 'rgba(5, 10, 16, 0.0)';
          ctx.fillRect(0, 0, width, height);
          ctx.globalAlpha = 0.18 * Math.sin(Math.PI * t);
          ctx.strokeStyle = '#f7c66f';
          ctx.lineWidth = 3;
          ctx.strokeRect(20, 20, width - 40, height - 40);
          ctx.globalAlpha = 0.9;
          ctx.fillStyle = '#f7c66f';
          ctx.font = '600 14px ui-sans-serif, system-ui, sans-serif';
          ctx.fillText(focusLabel, 32, 40);
        },
      },
    ]);
  }, [activeStep]);

  const trigGeometry = useMemo(() => {
    const angleDegrees = controls.angleDegrees ?? view.angleDegrees ?? 45;
    const angle = (angleDegrees * Math.PI) / 180;
    return {
      point: {
        x: ORIGIN + Math.cos(angle) * UNIT * 2.2,
        y: ORIGIN - Math.sin(angle) * UNIT * 2.2,
      },
      angleDegrees,
    };
  }, [controls.angleDegrees, view.angleDegrees]);

  const vectorA = controls.vectorA ?? view.vectorA ?? [2, 1];
  const vectorB = controls.vectorB ?? view.vectorB ?? [1, 3];
  const resultant: [number, number] = [vectorA[0] + vectorB[0], vectorA[1] + vectorB[1]];

  function handlePointerMove(event: ReactPointerEvent<SVGCircleElement>) {
    if (!dragging) return;
    const bounds = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!bounds) return;
    const x = (event.clientX - bounds.left - ORIGIN) / UNIT;
    const y = -(event.clientY - bounds.top - ORIGIN) / UNIT;
    const next: [number, number] = [Number(x.toFixed(1)), Number(y.toFixed(1))];
    if (dragging === 'a') {
      onControlChange({ vectorA: next });
    } else {
      onControlChange({ vectorB: next });
    }
  }

  return (
    <section className="panel panel-stage">
      <div className="section-header">
        <div>
          <p className="eyebrow">Graphical View</p>
          <h2>{view.title}</h2>
        </div>
        <p className="section-meta">{activeStep.title}</p>
      </div>

      <div className="stage-shell">
        <div className="stage-viewport">
          <svg viewBox={`0 0 ${VIEW_SIZE} ${VIEW_SIZE}`} className="graph-svg" aria-label={`${topic} visualization`}>
            <defs>
              <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="5.4" refY="4" orient="auto">
                <path d="M 0 0 L 8 4 L 0 8 z" fill="#9cc7ff" />
              </marker>
              <marker id="arrowhead-accent" markerWidth="8" markerHeight="8" refX="5.4" refY="4" orient="auto">
                <path d="M 0 0 L 8 4 L 0 8 z" fill="#f7c66f" />
              </marker>
            </defs>

            <line x1={ORIGIN} y1={24} x2={ORIGIN} y2={VIEW_SIZE - 24} className="axis" />
            <line x1={24} y1={ORIGIN} x2={VIEW_SIZE - 24} y2={ORIGIN} className="axis" />

            {Array.from({ length: 9 }).map((_, index) => {
              const offset = (index - 4) * UNIT;
              return (
                <g key={offset}>
                  <line x1={ORIGIN + offset} y1={ORIGIN - 6} x2={ORIGIN + offset} y2={ORIGIN + 6} className="tick" />
                  <line x1={ORIGIN - 6} y1={ORIGIN + offset} x2={ORIGIN + 6} y2={ORIGIN + offset} className="tick" />
                </g>
              );
            })}

            {topic === 'trig' ? (
              <>
                <circle cx={ORIGIN} cy={ORIGIN} r={UNIT * 2.2} className="unit-circle" />
                <path d={`M ${ORIGIN} ${ORIGIN} L ${trigGeometry.point.x} ${trigGeometry.point.y}`} className="vector-line" markerEnd="url(#arrowhead)" />
                <line x1={trigGeometry.point.x} y1={trigGeometry.point.y} x2={trigGeometry.point.x} y2={ORIGIN} className="projection-line" />
                <line x1={trigGeometry.point.x} y1={trigGeometry.point.y} x2={ORIGIN} y2={trigGeometry.point.y} className="projection-line alt" />
                <circle cx={trigGeometry.point.x} cy={trigGeometry.point.y} r="8" className="drag-point" />
                <text x={trigGeometry.point.x + 14} y={trigGeometry.point.y - 14} className="graph-label">
                  θ = {trigGeometry.angleDegrees.toFixed(0)}°
                </text>
                <polyline
                  className="wave-line"
                  points={Array.from({ length: 120 }).map((_, index) => {
                    const px = ORIGIN + 170 + index * 2.7;
                    const radians = (index / 120) * Math.PI * 2;
                    const py = ORIGIN - Math.sin(radians) * UNIT * 0.9;
                    return `${px},${py}`;
                  }).join(' ')}
                />
              </>
            ) : (
              <>
                <path d={linePath([0, 0], vectorA)} className="vector-line" markerEnd="url(#arrowhead)" />
                <path d={linePath([0, 0], vectorB)} className="vector-line secondary" markerEnd="url(#arrowhead-accent)" />
                <path d={linePath(vectorA, resultant)} className="helper-line" />
                <path d={linePath(vectorB, resultant)} className="helper-line" />
                <path d={linePath([0, 0], resultant)} className="result-line" markerEnd="url(#arrowhead-accent)" />
                <circle
                  {...pointCoords(vectorA)}
                  r="10"
                  className="drag-point"
                  onPointerDown={() => setDragging('a')}
                  onPointerMove={handlePointerMove}
                  onPointerUp={() => setDragging(null)}
                  onPointerLeave={() => setDragging(null)}
                />
                <circle
                  {...pointCoords(vectorB)}
                  r="10"
                  className="drag-point accent"
                  onPointerDown={() => setDragging('b')}
                  onPointerMove={handlePointerMove}
                  onPointerUp={() => setDragging(null)}
                  onPointerLeave={() => setDragging(null)}
                />
                <circle {...pointCoords(resultant)} r="8" className="result-point" />
                <text x={pointCoords(vectorA).x + 12} y={pointCoords(vectorA).y - 12} className="graph-label">A</text>
                <text x={pointCoords(vectorB).x + 12} y={pointCoords(vectorB).y - 12} className="graph-label">B</text>
                <text x={pointCoords(resultant).x + 12} y={pointCoords(resultant).y - 12} className="graph-label">A + B</text>
              </>
            )}
          </svg>

          <canvas ref={canvasRef} width={VIEW_SIZE} height={VIEW_SIZE} className="stage-overlay" />
        </div>

        <div className="control-stack">
          {topic === 'trig' ? (
            <label className="control-card">
              <span>Angle</span>
              <input
                type="range"
                min="-180"
                max="180"
                value={controls.angleDegrees ?? 45}
                onChange={(event) => onControlChange({ angleDegrees: Number(event.target.value) })}
              />
              <strong>{controls.angleDegrees ?? 45}°</strong>
            </label>
          ) : (
            <>
              <label className="control-card">
                <span>Scalar for A</span>
                <input
                  type="range"
                  min="-3"
                  max="4"
                  step="0.5"
                  value={controls.scalar ?? 2}
                  onChange={(event) => onControlChange({ scalar: Number(event.target.value) })}
                />
                <strong>{controls.scalar ?? 2}</strong>
              </label>
              <div className="control-hint">
                Drag the points for vectors A and B directly on the plane.
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
