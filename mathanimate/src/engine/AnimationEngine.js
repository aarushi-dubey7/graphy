export class AnimationEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.scenes = [];
    this.sceneIndex = 0;
    this.currentTime = 0;
    this.lastTimestamp = null;
    this.isPlaying = false;
    this.rafId = null;
    this._sceneChangeCallbacks = [];
  }

  loadScript(scenes) {
    this.scenes = scenes;
    this.sceneIndex = 0;
    this.currentTime = 0;
    this.lastTimestamp = null;
    this.play();
  }

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.lastTimestamp = null;
    this._loop();
  }

  pause() {
    this.isPlaying = false;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  nextScene() {
    if (this.sceneIndex < this.scenes.length - 1) {
      this.sceneIndex += 1;
      this.currentTime = 0;
      this.lastTimestamp = null;
      this._notifySceneChange();
    }
  }

  prevScene() {
    if (this.sceneIndex > 0) {
      this.sceneIndex -= 1;
      this.currentTime = 0;
      this.lastTimestamp = null;
      this._notifySceneChange();
    }
  }

  seekTo(index) {
    const clamped = Math.max(0, Math.min(this.scenes.length - 1, index));
    this.sceneIndex = clamped;
    this.currentTime = 0;
    this.lastTimestamp = null;
    this._notifySceneChange();
  }

  getCurrentScene() {
    return this.scenes[this.sceneIndex] || null;
  }

  getSceneIndex() {
    return this.sceneIndex;
  }

  getSceneCount() {
    return this.scenes.length;
  }

  getProgress() {
    const scene = this.getCurrentScene();
    if (!scene) return 0;
    return Math.min(1, this.currentTime / scene.duration);
  }

  onSceneChange(callback) {
    this._sceneChangeCallbacks.push(callback);
  }

  destroy() {
    this.pause();
    this._sceneChangeCallbacks = [];
  }

  _notifySceneChange() {
    for (const cb of this._sceneChangeCallbacks) {
      cb(this.sceneIndex);
    }
  }

  _loop(timestamp) {
    if (!this.isPlaying) return;

    this.rafId = requestAnimationFrame((ts) => this._loop(ts));

    if (timestamp === undefined) return;

    const dt = this.lastTimestamp === null ? 0 : timestamp - this.lastTimestamp;
    this.lastTimestamp = timestamp;

    if (this.scenes.length === 0) return;

    const scene = this.getCurrentScene();
    this.currentTime += dt;

    if (this.currentTime >= scene.duration) {
      if (this.sceneIndex < this.scenes.length - 1) {
        this.sceneIndex += 1;
        this.currentTime = 0;
        this._notifySceneChange();
      } else {
        this.currentTime = scene.duration;
      }
    }

    this._render();
  }

  _render() {
    const { canvas, ctx } = this;
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0d0d0d';
    ctx.fillRect(0, 0, W, H);

    const scene = this.getCurrentScene();
    if (!scene) return;

    const t = Math.min(1, this.currentTime / scene.duration);
    ctx.save();
    scene.draw(ctx, t, W, H);
    ctx.restore();
  }
}
