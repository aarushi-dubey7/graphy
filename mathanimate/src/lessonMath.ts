import type { GraphicalViewSpec, LessonControlSpec, LessonSpec, Topic, TrigPoint, VectorSample } from './types';

function round(value: number): number {
  return Number(value.toFixed(4));
}

function formatTan(value: number): string {
  if (!Number.isFinite(value) || Math.abs(value) > 9999) {
    return 'undefined';
  }
  return round(value).toString();
}

function trigRows(angleDegrees: number): TrigPoint[] {
  const baseAngles = [-90, -45, 0, 30, 45, 60, 90];
  const angles = Array.from(new Set([...baseAngles, Math.round(angleDegrees)]))
    .sort((a, b) => a - b);

  return angles.map((degrees) => {
    const radians = (degrees * Math.PI) / 180;
    const sin = round(Math.sin(radians));
    const cos = round(Math.cos(radians));
    const tan = formatTan(Math.tan(radians));
    return { angleDegrees: degrees, radians: round(radians), sin, cos, tan };
  });
}

function magnitude([x, y]: [number, number]): number {
  return Math.sqrt(x ** 2 + y ** 2);
}

function vectorTable(vectorA: [number, number], vectorB: [number, number], scalar: number): VectorSample[] {
  const resultant: [number, number] = [vectorA[0] + vectorB[0], vectorA[1] + vectorB[1]];
  const scaled: [number, number] = [vectorA[0] * scalar, vectorA[1] * scalar];
  return [
    { label: 'Vector A', x: vectorA[0], y: vectorA[1], magnitude: round(magnitude(vectorA)) },
    { label: 'Vector B', x: vectorB[0], y: vectorB[1], magnitude: round(magnitude(vectorB)) },
    { label: 'A + B', x: resultant[0], y: resultant[1], magnitude: round(magnitude(resultant)) },
    { label: `${scalar} × A`, x: scaled[0], y: scaled[1], magnitude: round(magnitude(scaled)) },
  ];
}

export function applyControls(lesson: LessonSpec, controls: LessonControlSpec): LessonSpec {
  if (lesson.topic === 'trig') {
    const angleDegrees = controls.angleDegrees ?? lesson.controls.angleDegrees ?? 45;
    const radians = (angleDegrees * Math.PI) / 180;
    const sinValue = round(Math.sin(radians));
    const cosValue = round(Math.cos(radians));
    const tanValue = formatTan(Math.tan(radians));

    return {
      ...lesson,
      controls: {
        ...lesson.controls,
        angleDegrees,
      },
      views: {
        graphical: {
          ...lesson.views.graphical,
          angleDegrees,
        },
        numerical: {
          ...lesson.views.numerical,
          metrics: [
            { label: 'Angle', value: `${round(angleDegrees)}°` },
            { label: 'Radians', value: round(radians).toString() },
            { label: 'sin(θ)', value: sinValue.toString() },
            { label: 'cos(θ)', value: cosValue.toString() },
            { label: 'tan(θ)', value: tanValue },
          ],
          trigTable: trigRows(angleDegrees),
        },
        explanation: {
          ...lesson.views.explanation,
          blocks: lesson.views.explanation.blocks.map((block, index) =>
            index === 0
              ? {
                  ...block,
                  body: `At ${round(angleDegrees)}°, the point on the unit circle is (${cosValue}, ${sinValue}). The sine value is the vertical projection and the cosine value is the horizontal projection.`,
                }
              : block,
          ),
        },
      },
    };
  }

  const vectorA = controls.vectorA ?? lesson.controls.vectorA ?? [2, 1];
  const vectorB = controls.vectorB ?? lesson.controls.vectorB ?? [1, 3];
  const scalar = controls.scalar ?? lesson.controls.scalar ?? 2;
  const resultant: [number, number] = [vectorA[0] + vectorB[0], vectorA[1] + vectorB[1]];
  const dot = round(vectorA[0] * vectorB[0] + vectorA[1] * vectorB[1]);

  return {
    ...lesson,
    controls: {
      ...lesson.controls,
      vectorA,
      vectorB,
      scalar,
    },
    views: {
      graphical: {
        ...lesson.views.graphical,
        vectorA,
        vectorB,
        resultant,
        projection: [dot / (magnitude(vectorB) || 1), 0],
      } as GraphicalViewSpec,
      numerical: {
        ...lesson.views.numerical,
        metrics: [
          { label: 'A magnitude', value: round(magnitude(vectorA)).toString() },
          { label: 'B magnitude', value: round(magnitude(vectorB)).toString() },
          { label: 'A · B', value: dot.toString() },
          { label: 'Resultant', value: `[${resultant[0]}, ${resultant[1]}]` },
        ],
        vectorTable: vectorTable(vectorA, vectorB, scalar),
      },
      explanation: {
        ...lesson.views.explanation,
        blocks: lesson.views.explanation.blocks.map((block, index) =>
          index === 0
            ? {
                ...block,
                body: `Vector A = [${vectorA[0]}, ${vectorA[1]}] and Vector B = [${vectorB[0]}, ${vectorB[1]}]. Their sum is [${resultant[0]}, ${resultant[1]}], so the parallelogram diagonal represents the combined displacement.`,
              }
            : block,
        ),
      },
    },
  };
}

export function defaultInputForTopic(topic: Topic): string {
  return topic === 'trig' ? 'show sine on the unit circle' : 'add [2,1] and [1,3]';
}
