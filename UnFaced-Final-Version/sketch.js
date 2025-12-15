import { state } from "./state.js";
import {
  sceneBounds,
  defaultPageOptions,
  transitionDuration,
} from "./constants.js";
import {
  createLayers,
  envLayer,
  maskLayer,
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
  sceneFactory,
  sceneFactoryEnd,
  sceneMe,
  resetFactoryScene,
  resetSceneMe,
} from "./scenes.js";
import {
  mouseWheel,
  mousePressed,
  keyPressed,
  keyReleased,
} from "./app/input.js";
import { handleSceneEscapeKeyboardMovement } from "./app/controls.js";

// Default Page Data
let faceMesh,
  options = defaultPageOptions,
  faces = [];

export function preload() {
  // faceMesh for all transitions
  faceMesh = ml5.faceMesh(options);
  state.faceMesh = faceMesh;
  state.mirrorImg = loadImage("assets/Transition/Mirror.png");
  // Preload Chapter 2 assets for scene4
  state.chapter2TitleImg = loadImage(
    "assets/Ch2-Escape/Chapter2-With-Title.png"
  );
  state.chapter2MapImg = loadImage("assets/Ch2-Escape/Map.png");
  // Default page poster
  state.posterImg = loadImage("assets/Default-Page-Poster.png");
  // Default page Background
  state.defaultPageImage = loadImage("assets/Default-Page-Image-ENG.png");
  // Scene Factory Background
  state.factoryEndImg = loadImage("assets/Factory-2.png");
  state.doorOpenSound = loadSound("assets/Door-Open.mp3");
  state.heartbeatSound = loadSound("assets/Transition/HeartBeat.mp3");
  state.maskSound = loadSound("assets/Transition/Wearing-Mask-Sound.mp3");
  state.factorySound = loadSound("assets/Ch3-Factory/Factory-Sound.mp3");
  const factoryFiles = [
    "Adult-We-With-AngryFace.png",
    "Adult-We-With-HappyFace.png",
    "Adult-We-With-PuzzleFace.png",
    "Adult-We-With-SadFace.png",
    "Adult-We-Without-Mask-Or-Face.png",
    "Adult-We-Y.png",
    "Adult-We-Z.png",
    "Doctor.png",
    "Puppet.png",
    "suit.png",
  ];
  state.factoryImages = factoryFiles
    .map((f) => loadImage(`assets/Ch3-Factory/${f}`))
    .filter(Boolean);
}

export function setup() {
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
    new Scene(sceneBounds[6].start, sceneBounds[6].end, sceneFactory, 6),
    new Scene(sceneBounds[7].start, sceneBounds[7].end, sceneFactoryEnd, 7),
    new Scene(sceneBounds[8].start, sceneBounds[8].end, sceneMe, 8),
  ];
  state.transitions = [
    new Transition(transitionDuration, 0),
    new Transition(transitionDuration, 1),
    new Transition(transitionDuration, 2),
    new Transition(transitionDuration, 3),
    new Transition(transitionDuration, 4),
  ];
  canvas.id("p5-canvas");
  canvas.parent("p5-canvas-container");
}

export function draw() {
  imageMode(CORNER);
  // Transition or Scene
  if (state.storyStarted) {
    // Transition
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
      // Prevent Scrolling Overflow
      // If out of the end, get back
      if (
        !activeScene &&
        state.currentScrollingPosition >
          state.scenes[state.scenes.length - 1].end
      ) {
        state.currentScrollingPosition =
          state.scenes[state.scenes.length - 1].end;
        activeScene = state.scenes[state.scenes.length - 1];
      }
      console.log("Scene at Position:", state.currentScrollingPosition);
      if (activeScene && state.currentSceneCode !== activeScene.sceneCode) {
        if (activeScene.render === sceneEscape) {
          labyrinthLayerInitialize();
        } else if (activeScene.render === sceneFactory) {
          resetFactoryScene();
        } else if (activeScene.render === sceneFactoryEnd) {
          state.factoryEndTransitionStarted = false;
        } else if (activeScene.render === sceneMe) {
          resetSceneMe();
        }
        state.currentSceneCode = activeScene.sceneCode;
      }
      if (!activeScene) {
        return;
      }
      if (activeScene.render != sceneEscape) {
        image(envLayer, 0, 0);
      }

      if (activeScene && activeScene.render === sceneEscape) {
        handleSceneEscapeKeyboardMovement();
      }
      // By default: render the current active scene
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
  const shakeX = map(
    noise(frameCount * 0.1),
    0,
    1,
    -shakeMagnitude,
    shakeMagnitude
  );
  const shakeY = map(
    noise(frameCount * 0.1 + 1000),
    0,
    1,
    -shakeMagnitude,
    shakeMagnitude
  );

  imageMode(CENTER);
  if (state.defaultPageImage) {
    image(state.defaultPageImage, width / 2, height / 2, width, height);
  }
  if (state.posterImg) {
    image(
      state.posterImg,
      leftCenterX + shakeX,
      leftCenterY + shakeY,
      300,
      375
    );
  }
  pop();
}

export function gotFaces(results) {
  if (results && results.length > 0) {
    faces = results
  } else {
    faces = [];
  }
  state.faces = faces;
}

// Expose p5 entry points
window.preload = preload;
window.setup = setup;
window.draw = draw;
window.mouseWheel = mouseWheel;
window.mousePressed = mousePressed;
window.keyPressed = keyPressed;
window.keyReleased = keyReleased;
window.gotFaces = gotFaces;
