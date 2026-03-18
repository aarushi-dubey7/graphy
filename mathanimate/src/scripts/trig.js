import { sceneLibrary } from '../engine/sceneLibrary.js';

export function getSinScript() {
  return [
    sceneLibrary.point(),
    sceneLibrary.axes(),
    sceneLibrary.circle(),
    sceneLibrary.unit_circle(),
    sceneLibrary.angle_sweep(),
    sceneLibrary.right_triangle(),
    sceneLibrary.projection(),
    sceneLibrary.wave_unfurl(),
    sceneLibrary.function_trace(),
  ];
}

export function getCosScript() {
  const scenes = getSinScript();
  // swap insight on projection scene to reflect cos perspective
  scenes[6] = {
    ...scenes[6],
    insight: 'Project the point horizontally — its distance along x is exactly cos(θ).',
  };
  return scenes;
}

export function getTanScript() {
  return [
    sceneLibrary.point(),
    sceneLibrary.axes(),
    sceneLibrary.circle(),
    sceneLibrary.unit_circle(),
    sceneLibrary.angle_sweep(),
    sceneLibrary.right_triangle(),
    sceneLibrary.function_trace(),
  ];
}
