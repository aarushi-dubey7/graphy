import { sceneLibrary } from '../engine/sceneLibrary.js';

export function getQuadraticScript() {
  return [
    sceneLibrary.point(),
    sceneLibrary.axes(),
    sceneLibrary.vertex(),
    sceneLibrary.parabola_grow(),
    sceneLibrary.function_trace(),
  ];
}
