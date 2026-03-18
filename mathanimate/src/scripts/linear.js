import { sceneLibrary } from '../engine/sceneLibrary.js';

export function getLinearScript(m = 1, b = 0) {
  return [
    sceneLibrary.point(),
    sceneLibrary.axes(),
    sceneLibrary.y_intercept(),
    sceneLibrary.slope_walk(),
    sceneLibrary.line_extend(),
  ];
}
