export function drawDot(ctx, x, y, radius = 6, color = '#fff') {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

export function drawLine(ctx, x1, y1, x2, y2, color = '#aaa', width = 2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

export function drawArrow(ctx, x1, y1, x2, y2, color = '#aaa', width = 2) {
  const headLen = 12;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(
    x2 - headLen * Math.cos(angle - Math.PI / 6),
    y2 - headLen * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    x2 - headLen * Math.cos(angle + Math.PI / 6),
    y2 - headLen * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

export function drawCircle(ctx, cx, cy, r, color = '#4af', width = 2, progress = 1) {
  ctx.beginPath();
  ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

export function drawAxes(ctx, width, height, color = '#555', progress = 1) {
  const cx = width / 2;
  const cy = height / 2;
  const xExtent = (width / 2) * progress;
  const yExtent = (height / 2) * progress;

  // x-axis
  drawArrow(ctx, cx - xExtent, cy, cx + xExtent, cy, color, 1.5);
  // y-axis
  drawArrow(ctx, cx, cy + yExtent, cx, cy - yExtent, color, 1.5);

  // tick marks
  const tickSpacing = 40;
  const tickSize = 4;
  const tickColor = color;
  ctx.strokeStyle = tickColor;
  ctx.lineWidth = 1;

  for (let x = tickSpacing; x <= xExtent - 10; x += tickSpacing) {
    ctx.beginPath();
    ctx.moveTo(cx + x, cy - tickSize);
    ctx.lineTo(cx + x, cy + tickSize);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - x, cy - tickSize);
    ctx.lineTo(cx - x, cy + tickSize);
    ctx.stroke();
  }
  for (let y = tickSpacing; y <= yExtent - 10; y += tickSpacing) {
    ctx.beginPath();
    ctx.moveTo(cx - tickSize, cy + y);
    ctx.lineTo(cx + tickSize, cy + y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - tickSize, cy - y);
    ctx.lineTo(cx + tickSize, cy - y);
    ctx.stroke();
  }
}

export function drawCurve(ctx, points, color = '#4af', width = 2) {
  if (points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i].x, points[i].y);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

export function drawSineWave(
  ctx, cx, cy, amplitude, freq, phase, length, color, width, progress
) {
  const pts = [];
  const visibleLength = length * progress;
  for (let px = 0; px <= visibleLength; px += 2) {
    pts.push({
      x: cx + px,
      y: cy - amplitude * Math.sin(freq * px + phase),
    });
  }
  drawCurve(ctx, pts, color, width);
}

export function drawRightTriangle(ctx, cx, cy, r, angle, color, progress) {
  const px = cx + r * Math.cos(angle);
  const py = cy - r * Math.sin(angle);
  const foot = cx + r * Math.cos(angle);
  const footY = cy;

  // hypotenuse (cx,cy) → (px,py)
  const hx = cx + (px - cx) * progress;
  const hy = cy + (py - cy) * progress;
  drawLine(ctx, cx, cy, hx, hy, color, 2);

  if (progress > 0.5) {
    const p2 = (progress - 0.5) * 2;
    // vertical leg
    drawLine(ctx, foot, cy, foot, cy - (cy - py) * p2, '#ff9f4a', 2);
    // horizontal leg
    drawLine(ctx, cx, cy, cx + (foot - cx) * p2, cy, '#4af4ff', 2);
  }

  drawDot(ctx, hx, hy, 5, '#fff');
}
