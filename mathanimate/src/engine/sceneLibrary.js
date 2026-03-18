import {
  drawDot,
  drawLine,
  drawArrow,
  drawCircle,
  drawAxes,
  drawCurve,
  drawSineWave,
  drawRightTriangle,
} from '../canvas/drawPrimitives.js';
import { drawText, drawCallout } from '../canvas/drawLabels.js';

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export const sceneLibrary = {
  point: () => ({
    type: 'point',
    duration: 600,
    insight: 'Every mathematical story starts from a single point.',
    draw(ctx, t, W, H) {
      const e = easeInOut(t);
      ctx.globalAlpha = e;
      drawDot(ctx, W / 2, H / 2, 8, '#fff');
      ctx.globalAlpha = 1;
    },
  }),

  number_line: () => ({
    type: 'number_line',
    duration: 1000,
    insight: 'Numbers live on a line extending in both directions from zero.',
    draw(ctx, t, W, H) {
      const e = easeInOut(t);
      const cx = W / 2;
      const cy = H / 2;
      const extent = (W / 2 - 40) * e;
      drawArrow(ctx, cx, cy, cx + extent, cy, '#aaa', 2);
      drawArrow(ctx, cx, cy, cx - extent, cy, '#aaa', 2);

      const tickSpacing = 40;
      const tickCount = Math.floor(extent / tickSpacing);
      for (let i = 1; i <= tickCount; i++) {
        const x = tickSpacing * i;
        drawLine(ctx, cx + x, cy - 5, cx + x, cy + 5, '#aaa', 1);
        drawLine(ctx, cx - x, cy - 5, cx - x, cy + 5, '#aaa', 1);
        drawText(ctx, String(i), cx + x, cy + 16, { size: 11, color: '#aaa' });
        drawText(ctx, String(-i), cx - x, cy + 16, { size: 11, color: '#aaa' });
      }
      drawText(ctx, '0', cx, cy + 16, { size: 11, color: '#aaa' });
    },
  }),

  axes: () => ({
    type: 'axes',
    duration: 1200,
    insight: 'A coordinate plane lets us visualize relationships between two variables.',
    draw(ctx, t, W, H) {
      const e = easeInOut(t);
      drawAxes(ctx, W, H, '#555', e);
      if (t > 0.7) {
        const labelAlpha = (t - 0.7) / 0.3;
        drawText(ctx, 'x', W / 2 + W / 2 - 15, H / 2 + 16, { size: 13, color: '#777', alpha: labelAlpha });
        drawText(ctx, 'y', W / 2 + 12, H / 2 - H / 2 + 15, { size: 13, color: '#777', alpha: labelAlpha });
      }
    },
  }),

  circle: () => ({
    type: 'circle',
    duration: 1200,
    insight: 'A circle is all points equidistant from the center.',
    draw(ctx, t, W, H) {
      const e = easeInOut(t);
      drawAxes(ctx, W, H, '#333', 1);
      drawCircle(ctx, W / 2, H / 2, 120, '#4af4ff', 2, e);
    },
  }),

  unit_circle: () => ({
    type: 'unit_circle',
    duration: 1200,
    insight: 'The unit circle has radius 1 and is the foundation of trigonometry.',
    draw(ctx, t, W, H) {
      const e = easeInOut(t);
      const cx = W / 2;
      const cy = H / 2;
      const r = 120;
      drawAxes(ctx, W, H, '#333', 1);
      drawCircle(ctx, cx, cy, r, '#4af4ff', 2, e);

      if (t > 0.5) {
        const la = (t - 0.5) / 0.5;
        // radius label
        drawText(ctx, 'r = 1', cx + r / 2 + 8, cy - 10, { size: 13, color: '#4af4ff', alpha: la });

        // angle markers
        const markers = [
          { angle: 0, label: '0', dx: 16, dy: 0 },
          { angle: Math.PI / 2, label: 'π/2', dx: 0, dy: -16 },
          { angle: Math.PI, label: 'π', dx: -22, dy: 0 },
          { angle: (3 * Math.PI) / 2, label: '3π/2', dx: 0, dy: 18 },
        ];
        markers.forEach(({ angle, label, dx, dy }) => {
          const mx = cx + r * Math.cos(angle);
          const my = cy - r * Math.sin(angle);
          drawDot(ctx, mx, my, 4, '#ff9f4a');
          drawText(ctx, label, mx + dx, my + dy, { size: 11, color: '#ff9f4a', alpha: la });
        });
      }
    },
  }),

  angle_sweep: () => ({
    type: 'angle_sweep',
    duration: 2000,
    insight: 'As the angle θ sweeps around, sin(θ) and cos(θ) define the y and x positions.',
    draw(ctx, t, W, H) {
      const cx = W / 2;
      const cy = H / 2;
      const r = 120;
      drawAxes(ctx, W, H, '#333', 1);
      drawCircle(ctx, cx, cy, r, '#4af4ff', 1.5, 1);

      const angle = t * Math.PI * 2;
      const px = cx + r * Math.cos(angle);
      const py = cy - r * Math.sin(angle);

      // swept arc
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.25, 0, angle, false);
      ctx.strokeStyle = '#ff9f4a';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      drawLine(ctx, cx, cy, px, py, '#ff9f4a', 2);
      drawDot(ctx, px, py, 6, '#fff');

      if (t > 0.05) {
        const theta = (angle * 180 / Math.PI).toFixed(0);
        drawText(ctx, `θ = ${theta}°`, cx + 30, cy - r - 20, { size: 13, color: '#ff9f4a' });
      }
    },
  }),

  right_triangle: () => ({
    type: 'right_triangle',
    duration: 1200,
    insight: 'The right triangle inside the unit circle reveals sin as opposite/hypotenuse.',
    draw(ctx, t, W, H) {
      const cx = W / 2;
      const cy = H / 2;
      const r = 120;
      const angle = Math.PI / 4;
      drawAxes(ctx, W, H, '#333', 1);
      drawCircle(ctx, cx, cy, r, '#4af4ff', 1.5, 1);
      drawRightTriangle(ctx, cx, cy, r, angle, '#aaa', easeInOut(t));

      if (t > 0.7) {
        const la = (t - 0.7) / 0.3;
        const px = cx + r * Math.cos(angle);
        const py = cy - r * Math.sin(angle);
        drawText(ctx, 'sin θ', px + 18, (cy + py) / 2, { size: 12, color: '#ff9f4a', alpha: la });
        drawText(ctx, 'cos θ', (cx + px) / 2, cy + 18, { size: 12, color: '#4af4ff', alpha: la });
        drawText(ctx, '1', (cx + px) / 2 - 14, (cy + py) / 2 - 10, { size: 12, color: '#aaa', alpha: la });
      }
    },
  }),

  projection: () => ({
    type: 'projection',
    duration: 2000,
    insight: 'Project the point straight down — its height is exactly sin(θ).',
    draw(ctx, t, W, H) {
      const cx = W / 2;
      const cy = H / 2;
      const r = 120;
      drawAxes(ctx, W, H, '#333', 1);
      drawCircle(ctx, cx, cy, r, '#4af4ff', 1.5, 1);

      const angle = t * Math.PI * 2;
      const px = cx + r * Math.cos(angle);
      const py = cy - r * Math.sin(angle);

      drawLine(ctx, cx, cy, px, py, '#aaa', 1.5);
      drawDot(ctx, px, py, 5, '#fff');

      // projection dashed line to y-axis
      ctx.setLineDash([4, 4]);
      drawLine(ctx, px, py, cx, py, '#ff9f4a', 1.5);
      ctx.setLineDash([]);

      // bouncing dot on y-axis
      drawDot(ctx, cx, py, 7, '#ff9f4a');
      const sinVal = Math.sin(angle).toFixed(2);
      drawText(ctx, `sin(θ) = ${sinVal}`, cx + 40, cy - r - 20, { size: 13, color: '#ff9f4a' });
    },
  }),

  wave_unfurl: () => ({
    type: 'wave_unfurl',
    duration: 3000,
    insight: 'Unwrap the circular motion into time — and you get the sine wave.',
    draw(ctx, t, W, H) {
      const cx = W / 2 - 140;
      const cy = H / 2;
      const r = 80;
      drawAxes(ctx, W, H, '#333', 1);
      drawCircle(ctx, cx, cy, r, '#4af4ff', 1.5, 1);

      const angle = t * Math.PI * 2;
      const dotX = cx + r * Math.cos(angle);
      const dotY = cy - r * Math.sin(angle);
      drawLine(ctx, cx, cy, dotX, dotY, '#aaa', 1.5);
      drawDot(ctx, dotX, dotY, 5, '#fff');

      // wave starts at right edge of circle
      const waveStartX = cx + r;
      const waveLength = W / 2 - r - 20;
      drawSineWave(
        ctx,
        waveStartX,
        cy,
        r,
        (2 * Math.PI) / waveLength,
        0,
        waveLength,
        '#4af4ff',
        2,
        t
      );

      // connecting dashed line
      const waveX = waveStartX + waveLength * t;
      ctx.setLineDash([3, 4]);
      drawLine(ctx, dotY === cy ? dotX : dotX, dotY, waveX, dotY, '#ff9f4a88', 1);
      ctx.setLineDash([]);
    },
  }),

  function_trace: () => ({
    type: 'function_trace',
    duration: 2000,
    insight: 'Tracing the function reveals how output changes with input.',
    draw(ctx, t, W, H) {
      const cx = W / 2;
      const cy = H / 2;
      drawAxes(ctx, W, H, '#333', 1);

      const pts = [];
      const steps = 300;
      const visibleSteps = Math.floor(steps * easeInOut(t));
      for (let i = 0; i <= visibleSteps; i++) {
        const px = (i / steps) * W - W / 2;
        const py = -Math.sin(px / 40) * 80;
        pts.push({ x: cx + px, y: cy + py });
      }
      drawCurve(ctx, pts, '#4af4ff', 2.5);

      if (pts.length > 0) {
        const last = pts[pts.length - 1];
        drawDot(ctx, last.x, last.y, 5, '#ff9f4a');
      }
    },
  }),

  slope_walk: () => ({
    type: 'slope_walk',
    duration: 1800,
    insight: 'Slope is rise over run — for every step right, we go up by m.',
    draw(ctx, t, W, H) {
      const cx = W / 2;
      const cy = H / 2;
      const e = easeInOut(t);
      drawAxes(ctx, W, H, '#333', 1);

      const m = 1.5;
      const b = 0;
      const steps = 3;
      const runPx = 70;

      for (let i = 0; i < steps; i++) {
        const stepProgress = Math.max(0, Math.min(1, e * steps - i));
        if (stepProgress <= 0) break;
        const x0 = cx - runPx * steps / 2 + i * runPx;
        const y0 = cy - (m * (x0 - cx) + b * 40);
        const x1 = x0 + runPx * stepProgress;
        const riseY = y0 - m * runPx * stepProgress;

        // run (horizontal)
        drawLine(ctx, x0, y0, x1, y0, '#4af4ff', 2);
        // rise (vertical)
        if (stepProgress > 0.5) {
          const rp = (stepProgress - 0.5) * 2;
          drawLine(ctx, x1, y0, x1, y0 - m * runPx * rp, '#ff9f4a', 2);
        }
      }

      // full line
      if (t > 0.8) {
        const la = (t - 0.8) / 0.2;
        const x1 = cx - 200;
        const x2 = cx + 200;
        const pts = [
          { x: x1, y: cy - m * (x1 - cx) },
          { x: x2, y: cy - m * (x2 - cx) },
        ];
        ctx.globalAlpha = la;
        drawCurve(ctx, pts, '#aaa', 1.5);
        ctx.globalAlpha = 1;
        drawText(ctx, `slope = ${m}`, cx + 20, cy - 100, { size: 13, color: '#ff9f4a', alpha: la });
      }
    },
  }),

  y_intercept: () => ({
    type: 'y_intercept',
    duration: 1000,
    insight: 'The y-intercept b is where the line crosses the y-axis when x=0.',
    draw(ctx, t, W, H) {
      const cx = W / 2;
      const cy = H / 2;
      const b = 60;
      const e = easeInOut(t);
      drawAxes(ctx, W, H, '#333', 1);
      drawDot(ctx, cx, cy - b, 8 * e, '#ff9f4a');
      if (t > 0.4) {
        const la = (t - 0.4) / 0.6;
        drawCallout(ctx, 'b = y-intercept', cx, cy - b, {
          size: 13, color: '#ff9f4a', alpha: la, leaderDx: 24, leaderDy: -20,
        });
      }
    },
  }),

  line_extend: () => ({
    type: 'line_extend',
    duration: 1500,
    insight: 'The line extends infinitely, defined completely by its slope and y-intercept.',
    draw(ctx, t, W, H) {
      const cx = W / 2;
      const cy = H / 2;
      const m = 1.2;
      const b = 40;
      const e = easeInOut(t);
      drawAxes(ctx, W, H, '#333', 1);

      const halfW = (W / 2 + 20) * e;
      const x1 = cx - halfW;
      const x2 = cx + halfW;
      const pts = [
        { x: x1, y: cy - (m * (x1 - cx) + b) },
        { x: x2, y: cy - (m * (x2 - cx) + b) },
      ];
      drawCurve(ctx, pts, '#4af4ff', 2.5);
    },
  }),

  vertex: () => ({
    type: 'vertex',
    duration: 800,
    insight: 'The vertex is the turning point of the parabola.',
    draw(ctx, t, W, H) {
      const cx = W / 2;
      const cy = H / 2 + 80;
      const e = easeInOut(t);
      drawAxes(ctx, W, H, '#333', 1);
      ctx.globalAlpha = e;
      drawDot(ctx, cx, cy, 9, '#ff9f4a');
      ctx.globalAlpha = 1;
      if (t > 0.5) {
        const la = (t - 0.5) / 0.5;
        drawCallout(ctx, 'vertex', cx, cy, { size: 13, color: '#ff9f4a', alpha: la, leaderDx: 18, leaderDy: -18 });
      }
    },
  }),

  parabola_grow: () => ({
    type: 'parabola_grow',
    duration: 2000,
    insight: 'The parabola grows symmetrically — for every x, x² gives the same value as (-x)².',
    draw(ctx, t, W, H) {
      const cx = W / 2;
      const cy = H / 2 + 80;
      const e = easeInOut(t);
      const a = 0.03;
      drawAxes(ctx, W, H, '#333', 1);

      const maxX = 160 * e;
      const pts = [];
      for (let px = -maxX; px <= maxX; px += 2) {
        pts.push({ x: cx + px, y: cy - a * px * px });
      }
      drawCurve(ctx, pts, '#4af4ff', 2.5);

      if (pts.length > 0) {
        drawDot(ctx, cx, cy, 7, '#ff9f4a');
      }
    },
  }),
};
