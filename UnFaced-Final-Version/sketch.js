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
  sceneFactory,
  sceneFactoryEnd,
  sceneMe,
  isScene3RedButtonHit,
  resetFactoryScene,
  resetSceneMe,
  handleSceneMeScroll,
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

const escapeKeyState = {
  left: false,
  right: false,
};

function preload() {
  faceMesh = ml5.faceMesh(options);
  state.faceMesh = faceMesh;
  state.mirrorImg = loadImage("assets/Transition/Mirror.png");
  // Preload Chapter 2 assets for scene4
  state.chapter2TitleImg = loadImage("assets/Ch2-Escape/Chapter2-With-Title.png");
  state.chapter2MapImg = loadImage("assets/Ch2-Escape/Map.png");
  // Default page poster
  state.posterImg = loadImage("assets/Default-Page-Poster.png");
  state.defaultPageImage = loadImage("assets/Default-Page-Image.png");
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
      if (
        !activeScene &&
        state.currentScrollingPosition > state.scenes[state.scenes.length - 1].end
      ) {
        state.currentScrollingPosition = state.scenes[state.scenes.length - 1].end;
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
        handLayer.clear();
        leftHand.update(0);
        leftHand.display(handLayer);
        // image(handLayer, 0, height - handLayer.height);
      }

      if (activeScene && activeScene.render === sceneEscape) {
        handleSceneEscapeKeyboardMovement();
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
    if (state.defaultPageImage) {
      image(state.defaultPageImage, width / 2, height / 2, width, height);
    }
  if (state.posterImg) {
    image(state.posterImg, leftCenterX + shakeX, leftCenterY + shakeY, 300, 375);
  }

  fill(220);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(24);
  textFont("Edu NSW ACT Cursive");

  // const contentStr =
    

  const textX = 550;
  const textY = 100;
  const textWidth = 400;
  const textHeight = 450;

  // text(contentStr, textX, textY, textWidth, textHeight);
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
      if (!activeScene) {
        const betweenFactoryEndAndSceneMe =
          state.currentScrollingPosition >= sceneBounds[7].end &&
          state.currentScrollingPosition < sceneBounds[8].start;
        if (
          betweenFactoryEndAndSceneMe &&
          !state.duringTransition &&
          state.transitions[3]
        ) {
          state.transitions[3].startTransition();
          return false;
        }
        state.currentScrollingPosition += mouseScrollingExtent;
        return false;
      }
      if (activeScene && activeScene.render === sceneMe) {
        handleSceneMeScroll(event);
        return false;
      }
      if (activeScene && activeScene.render != sceneEscape) {
        let nextScroll = state.currentScrollingPosition + mouseScrollingExtent;
        if (activeScene.render === scene3) {
          if (
            nextScroll >= activeScene.end &&
            state.transitions[1] &&
            !state.duringTransition
          ) {
            // state.transitions[1].startTransition();
            return false;
          }
          nextScroll = Math.min(nextScroll, activeScene.end);
        } else if (activeScene.render === scene4) {
          nextScroll = Math.max(nextScroll, activeScene.start);
        }
        state.currentScrollingPosition = nextScroll;
      } else if (activeScene) {
        let dx = constrain(-event.deltaX, -1, 1);
        let dy = constrain(-event.deltaY, -1, 1);
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

function handleSceneEscapeKeyboardMovement() {
  if (!state.storyStarted || state.duringTransition) return;
  let dx = 0;
  let dy = 0;
  if (escapeKeyState.left) {
    dx -= 1;
  }
  if (escapeKeyState.right) {
    dx += 1;
  }
  if (dx === 0 && dy === 0) return;
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

function mousePressed() {
  if (state.duringTransition) {
    const currentTransition =
      state.transitions[state.currentTransitionStartingPage];
    if (
      currentTransition &&
      (currentTransition.transitionCode === 0 || currentTransition.videoContentShown)
    ) {
      currentTransition.allowEnd = true;
    }
  } else if (!state.storyStarted) {
    state.storyStarted = true;
    state.transitions[0].startTransition();
  } else if (isScene3RedButtonHit(mouseX, mouseY)) {
    if (state.doorOpenSound && !state.s3DoorSoundPlayed) {
      state.doorOpenSound.play();
      state.s3DoorSoundPlayed = true;
    }
    const transition = state.transitions[1];
    if (transition) {
      transition.startTransition();
    }
  }
}

function keyPressed() {
  if (!state.storyStarted || state.duringTransition) return;
  if (key === "a" || key === "A" || keyCode === LEFT_ARROW) {
    escapeKeyState.left = true;
    return false;
  }
  if (key === "d" || key === "D" || keyCode === RIGHT_ARROW) {
    escapeKeyState.right = true;
    return false;
  }
}

function keyReleased() {
  if (key === "a" || key === "A" || keyCode === LEFT_ARROW) {
    escapeKeyState.left = false;
    return false;
  }
  if (key === "d" || key === "D" || keyCode === RIGHT_ARROW) {
    escapeKeyState.right = false;
    return false;
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
window.keyPressed = keyPressed;
window.keyReleased = keyReleased;
window.gotFaces = gotFaces;
