export const scrollingMaxSpd = 3;
export const transitionDuration = 2000;
export const sceneBounds = [
  { start: -Infinity, end: 0 },
  { start: 0, end: 1000 },
  { start: 1000, end: 2000 },
  { start: 2000, end: 2500 },
  { start: 2500, end: 3000 },
  { start: 3000, end: 4000 }, //escape
  { start: 4500, end: 8100 }, //sceneFactory
  { start: 7900, end: 9000 }, //sceneFactoryEnd
  { start: 9999, end: Infinity}, // sceneMe
];

export const defaultPageOptions =  { maxFaces: 1, refineLandmarks: false, flipped: false };