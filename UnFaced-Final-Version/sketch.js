import { state } from "./state.js";
import { sceneBounds, scrollingMaxSpd } from "./constants.js";
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
import { Scene, scene1, scene2, scene3, scene4 } from "./scenes.js";

function setup() {
  let canvas = createCanvas(500, 300);
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
  ];
  envLayerInitialize();
  maskLayerInitialize();
  handLayerInitialize();
  canvas.id("p5-canvas");
  canvas.parent("p5-canvas-container");
}

function draw() {
  background(0);
  image(envLayer, 0, 0);
  handLayer.clear();
  leftHand.update(0);
  leftHand.display(handLayer);
  image(handLayer, 0, height - handLayer.height);
  if (
    state.currentScrollingPosition >
    state.scenes[state.scenes.length - 1].end
  ) {
    state.currentScrollingPosition =
      state.scenes[state.scenes.length - 1].end;
  }
  let activeScene = state.scenes.find((scene) =>
    scene.contains(state.currentScrollingPosition)
  );
  if (activeScene) {
    activeScene.render();
  }
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

window.setup = setup;
window.draw = draw;
window.mouseWheel = mouseWheel;
