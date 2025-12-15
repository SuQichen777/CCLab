export const scrollingMaxSpd = 3;
export const transitionDuration = 2000;
export const sceneBounds = [
  { start: -Infinity, end: -1 }, // default page
  { start: 0, end: 1000 }, // scene 1
  { start: 1000, end: 2000 }, // scene 2
  { start: 2000, end: 2500 }, // scene 3
  { start: 2500, end: 3000 }, // scene 4
  { start: 3000, end: 4000 }, //escape
  { start: 4500, end: 8100 }, //sceneFactory
  { start: 7900, end: 9000 }, //sceneFactoryEnd
  { start: 9999, end: Infinity}, // sceneMe
];
export const defaultPageOptions =  { maxFaces: 1, refineLandmarks: false, flipped: false };