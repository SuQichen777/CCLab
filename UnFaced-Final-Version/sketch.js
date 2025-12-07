import { state } from "./state.js";
import {
  sceneBounds,
  scrollingMaxSpd,
  defaultPageOptions,
} from "./constants.js";
import {
  createLayers,
  handLayerInitialize,
  envLayerInitialize,
  maskLayerInitialize,
  envLayer,
  maskLayer,
  handLayer,
  leftHand,
} from "./layers.js";
import {
  Scene,
  scene1,
  scene2,
  scene3,
  scene4,
  sceneEscape,
} from "./scenes.js";

// export const state = {
//   storyStarted: false,
//   currentScrollingPosition: 0,
//   scenes: [],
// };

// Default Page Data
let faceMesh,
  video,
  randomnessControl = 0.7,
  faces = [],
  frozenFaces = [],
  isFaceFrozen = false,
  options = defaultPageOptions,
  frozenCircleRadius = 2,
  clickMask = null,
  randomChar = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "&",
    "^",
    "@",
    "!",
  ];

function preload() {
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  let canvas = createCanvas(1000, 600);
  frozenCircleRadius = (2 / 500) * width;
  // detect face
  video = createCapture(VIDEO);
  video.size(height, width);
  video.hide();
  faceMesh.detectStart(video, gotFaces);
  createLayers(width, height);
  state.currentScrollingPosition = 0;
  state.scenes = [
    new Scene(sceneBounds[0].start, sceneBounds[0].end, () => {
      image(maskLayer, 0, 0);
    }),
    new Scene(sceneBounds[1].start, sceneBounds[1].end, scene1),
    new Scene(sceneBounds[2].start, sceneBounds[2].end, scene2),
    new Scene(sceneBounds[3].start, sceneBounds[3].end, scene3),
    new Scene(sceneBounds[4].start, sceneBounds[4].end, scene4),
    new Scene(sceneBounds[5].start, sceneBounds[5].end, sceneEscape),
  ];
  envLayerInitialize();
  maskLayerInitialize();
  handLayerInitialize();
  canvas.id("p5-canvas");
  canvas.parent("p5-canvas-container");
}

function draw() {
  if (state.storyStarted) {
    background(0);
    let activeScene = state.scenes.find((scene) =>
      scene.contains(state.currentScrollingPosition)
    );
    if (activeScene.render != sceneEscape) {
      
      image(envLayer, 0, 0);
      handLayer.clear();
      leftHand.update(0);
      leftHand.display(handLayer);
      image(handLayer, 0, height - handLayer.height);
    }

    if (
      state.currentScrollingPosition > state.scenes[state.scenes.length - 1].end
    ) {
      state.currentScrollingPosition =
        state.scenes[state.scenes.length - 1].end;
    }

    if (activeScene) {
      activeScene.render();
    }
  } else {
    // click to start
    // defaultPage();
  }
}

function defaultPage() {
  push();
  translate(width, 0);
  scale(-1, 1);
  background(255);
  let targetFaces = isFaceFrozen ? frozenFaces : faces;
  // moving the data points
  if (isFaceFrozen) {
    noStroke();
    fill(0);
    for (let i = 0; i < targetFaces.length; i++) {
      const face = targetFaces[i];
      for (let j = 0; j < face.keypoints.length; j++) {
        const keypoint = face.keypoints[j];
        circle(keypoint.x, keypoint.y, frozenCircleRadius * 2);
      }
    }
  } else {
    textSize(15);
    fill(0);
    for (let i = 0; i < targetFaces.length; i++) {
      let face = targetFaces[i];
      for (let j = 0; j < face.keypoints.length; j++) {
        let keypoint = face.keypoints[j];
        noStroke();
        if (keypoint.ch) {
          text(keypoint.ch, keypoint.x, keypoint.y);
        }
      }
    }
  }
  if (clickMask) {
    noStroke();
    fill(0);
    ellipse(clickMask.x, clickMask.y, clickMask.w, clickMask.h);
    erase();
    const eyeSize = min(clickMask.w, clickMask.h) / 3;
    ellipse(
      clickMask.x - clickMask.w / 4,
      clickMask.y - clickMask.h / 8,
      eyeSize
    );
    ellipse(
      clickMask.x + clickMask.w / 4,
      clickMask.y - clickMask.h / 8,
      eyeSize
    );
    noErase();
  }
  pop();
}

function mouseWheel(event) {
  if (leftHand.currentMode != 1) {
    let mouseScrollingExtent = constrain(
      event.delta,
      -scrollingMaxSpd,
      scrollingMaxSpd
    );
    state.currentScrollingPosition += mouseScrollingExtent;
  }
}

function mousePressed() {
  state.storyStarted = true;
  if (!state.storyStarted) {
    if (!faces.length || faces[0].keypoints.length <= 366) return;
    const primaryFace = faces[0];
    const maskSizeWidth = Math.abs(
      primaryFace.keypoints[366].x - primaryFace.keypoints[137].x
    );
    const maskSizeHeight = Math.abs(
      primaryFace.keypoints[152].y - primaryFace.keypoints[10].y
    );
    const maskStartX = primaryFace.keypoints[4].x;
    const maskStartY = primaryFace.keypoints[4].y;
    clickMask = {
      x: maskStartX,
      y: maskStartY,
      w: maskSizeWidth,
      h: maskSizeHeight,
    };
  }
}

function gotFaces(results) {
  // set cache if not detected
  if (!isFaceFrozen && results && results.length > 0) {
    faces = results.map((face) => ({
      ...face,
      keypoints: face.keypoints.map((kp) => ({
        ...kp,
        ch: random(0, 1) < randomnessControl ? random(randomChar) : null,
      })),
    }));
  }
}

window.preload = preload;
window.setup = setup;
window.draw = draw;
window.mouseWheel = mouseWheel;
window.mousePressed = mousePressed;
