import { state } from "./state.js";
import {
  sceneBounds,
  scrollingMaxSpd,
  defaultPageOptions,
  transitionDuration,
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
  characterMe,
  labyrinthWalls,
  labyrinthLayerInitialize,
} from "./layers.js";
import {
  Scene,
  Transition,
  scene1,
  scene2,
  scene3,
  scene4,
  sceneEscape,
  isScene3RedButtonHit,
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
  state.faceMesh = faceMesh;
  state.mirrorImg = loadImage("assets/Transition/Mirror.png");
  // Preload Chapter 2 assets for scene4
  state.chapter2TitleImg = loadImage("assets/Ch2-Escape/Chapter2-With-Title.png");
  state.chapter2MapImg = loadImage("assets/Ch2-Escape/Map.png");
  // Default page poster
  state.posterImg = loadImage("assets/Default-Page-Poster.png");
}

function setup() {
  let canvas = createCanvas(1000, 600);
  createLayers(width, height);
  state.currentScrollingPosition = 0;
  state.scenes = [
    new Scene(sceneBounds[0].start, sceneBounds[0].end, () => {
      image(maskLayer, 0, 0), 0;
    }),
    new Scene(sceneBounds[1].start, sceneBounds[1].end, scene1, 1),
    new Scene(sceneBounds[2].start, sceneBounds[2].end, scene2, 2),
    new Scene(sceneBounds[3].start, sceneBounds[3].end, scene3, 3),
    new Scene(sceneBounds[4].start, sceneBounds[4].end, scene4, 4),
    new Scene(sceneBounds[5].start, sceneBounds[5].end, sceneEscape, 5),
  ];
  state.transitions = [
    new Transition(transitionDuration, 0),
    new Transition(transitionDuration, 1),
    new Transition(transitionDuration, 2),
    new Transition(transitionDuration, 3),
    new Transition(transitionDuration, 4),
  ];
  envLayerInitialize();
  maskLayerInitialize();
  handLayerInitialize();
  canvas.id("p5-canvas");
  canvas.parent("p5-canvas-container");
}

function draw() {
  imageMode(CORNER);
  if (state.storyStarted) {
    if (state.duringTransition) {
      if (state.currentTransitionStartingPage == -1) return;
      let currentTransition =
        state.transitions[state.currentTransitionStartingPage];
      currentTransition.render();
      console.log("Transition at Position:", currentTransition.currentPosition);
    } else {
      background(0);
      let activeScene = state.scenes.find((scene) =>
        scene.contains(state.currentScrollingPosition)
      );
      console.log("Scene at Position:", state.currentScrollingPosition);
      if (activeScene && state.currentSceneCode !== activeScene.sceneCode) {
        if (activeScene.render === sceneEscape) {
          labyrinthLayerInitialize();
        }
        state.currentSceneCode = activeScene.sceneCode;
      }
      if (activeScene.render != sceneEscape) {
        image(envLayer, 0, 0);
        handLayer.clear();
        leftHand.update(0);
        leftHand.display(handLayer);
        // image(handLayer, 0, height - handLayer.height);
      }

      if (
        state.currentScrollingPosition >
        state.scenes[state.scenes.length - 1].end
      ) {
        state.currentScrollingPosition =
          state.scenes[state.scenes.length - 1].end;
      }

      if (activeScene) {
        activeScene.render();
      }
    }
  } else {
    defaultPage();
  }
}

function defaultPage() {
  push();
  background(0);

  const shakeMagnitude = 2.5;
  const leftCenterX = 250;
  const leftCenterY = 300;
  const shakeX = map(noise(frameCount * 0.1), 0, 1, -shakeMagnitude, shakeMagnitude);
  const shakeY = map(noise(frameCount * 0.1 + 1000), 0, 1, -shakeMagnitude, shakeMagnitude);

  imageMode(CENTER);
  if (state.posterImg) {
    image(state.posterImg, leftCenterX + shakeX, leftCenterY + shakeY, 300, 375);
  }

  fill(220);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(24);
  textFont("Edu NSW ACT Cursive");

  const contentStr =
    'This is a poster of "We", and you are a member of "Us". You are the same, non-deviant, and safe with your mask on. Press your mouse to start your journey.Hint: Scroll to Proceed. Click if you are stuck.';

  const textX = 550;
  const textY = 100;
  const textWidth = 400;
  const textHeight = 450;

  text(contentStr, textX, textY, textWidth, textHeight);
  pop();
}

function mouseWheel(event) {
  if (event && event.preventDefault) {
    event.preventDefault();
  }
  if (leftHand.currentMode != 1 && state.storyStarted) {
    let mouseScrollingExtent = constrain(
      event.delta,
      -scrollingMaxSpd,
      scrollingMaxSpd
    );
    if (state.duringTransition) {
      // In Transition
      if (state.currentTransitionStartingPage == -1) return;
      let currentTransition =
        state.transitions[state.currentTransitionStartingPage];
      currentTransition.currentPosition += mouseScrollingExtent;
    } else {
      let activeScene = state.scenes.find((scene) =>
        scene.contains(state.currentScrollingPosition)
      );
      if (activeScene && activeScene.render != sceneEscape) {
        let nextScroll = state.currentScrollingPosition + mouseScrollingExtent;
        if (activeScene.render === scene3) {
          nextScroll = Math.min(nextScroll, activeScene.end);
        } else if (activeScene.render === scene4) {
          nextScroll = Math.max(nextScroll, activeScene.start);
        }
        state.currentScrollingPosition = nextScroll;
      } else if (activeScene) {
        let dx = constrain(-event.deltaX, -0.6, 0.6);
        let dy = constrain(-event.deltaY, -0.6, 0.6);
        characterMe.update(dx, dy, labyrinthWalls);
        if (characterMe.y < 0) {
          const transition = state.transitions[2];
          if (transition && !state.duringTransition) {
            transition.startTransition();
          }
        } else if (characterMe.y > 575) {
          state.currentScrollingPosition = sceneBounds[4].end - 100;
        }
      }
    }
  }
  return false;
}

function mousePressed() {
  if (state.duringTransition) {
    const currentTransition =
      state.transitions[state.currentTransitionStartingPage];
    if (currentTransition) {
      currentTransition.allowEnd = true;
    }
  } else if (!state.storyStarted) {
    state.storyStarted = true;
    state.transitions[0].startTransition();
  } else if (isScene3RedButtonHit(mouseX, mouseY)) {
    const transition = state.transitions[1];
    if (transition) {
      transition.startTransition();
    }
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
    state.faces = faces;
  } else {
    state.faces = [];
  }
}

window.preload = preload;
window.setup = setup;
window.draw = draw;
window.mouseWheel = mouseWheel;
window.mousePressed = mousePressed;
window.gotFaces = gotFaces;
