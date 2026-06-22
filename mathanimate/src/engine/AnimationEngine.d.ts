export interface AnimationScene {
  duration: number;
  insight?: string;
  draw: (ctx: CanvasRenderingContext2D, t: number, width: number, height: number) => void;
}

export class AnimationEngine {
  constructor(canvas: HTMLCanvasElement);
  loadScript(scenes: AnimationScene[]): void;
  play(): void;
  pause(): void;
  nextScene(): void;
  prevScene(): void;
  seekTo(index: number): void;
  getCurrentScene(): AnimationScene | null;
  getSceneIndex(): number;
  getSceneCount(): number;
  getProgress(): number;
  onSceneChange(callback: (index: number) => void): void;
  destroy(): void;
}
