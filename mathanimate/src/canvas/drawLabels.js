export function drawText(ctx, text, x, y, options = {}) {
  const {
    color = '#fff',
    size = 14,
    font = 'sans-serif',
    align = 'center',
    alpha = 1,
  } = options;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.font = `${size}px ${font}`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
  ctx.restore();
}

export function drawCallout(ctx, text, x, y, options = {}) {
  const {
    color = '#fff',
    size = 13,
    font = 'sans-serif',
    align = 'center',
    alpha = 1,
    leaderDx = 20,
    leaderDy = -20,
  } = options;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + leaderDx, y + leaderDy);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.font = `${size}px ${font}`;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + leaderDx + (align === 'left' ? 4 : 0), y + leaderDy);
  ctx.restore();
}
