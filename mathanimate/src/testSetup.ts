import '@testing-library/jest-dom/vitest';

HTMLCanvasElement.prototype.getContext = (() => {
  return {
    clearRect() {},
    fillRect() {},
    save() {},
    restore() {},
    strokeRect() {},
    fillText() {},
    beginPath() {},
    moveTo() {},
    lineTo() {},
    stroke() {},
    arc() {},
    fill() {},
    closePath() {},
    setLineDash() {},
    globalAlpha: 1,
    strokeStyle: '#000',
    fillStyle: '#000',
    lineWidth: 1,
    font: '12px sans-serif',
  } as unknown as CanvasRenderingContext2D;
}) as typeof HTMLCanvasElement.prototype.getContext;
