import { state } from "./state.js";
import { sceneBounds, scrollingMaxSpd } from "./constants.js";
import {
  envLayer,
  maskLayer,
  labyrinthLayer,
  tranEyeLayer,
  s1NoisyRect,
  s1WallLineUpLeft,
  s1WallLineUpRight,
  s1WallLineDownLeft,
  s1WallLineDownRight,
  s3Door,
  s3DoorOffsetRatioX,
  s3DoorOffsetRatioY,
  mask,
  labyrinthWalls,
  labyrinthLayerInitialize,
  envLayerInitialize,
  maskLayerInitialize,
  characterMe,
  characterWe,
  characterWe2,
} from "./layers.js";
import { RectangleWithLine } from "./classes/RectangleWithLine.js";
import { Line } from "./classes/Line.js";
import { handlePlayerEnemyCollision } from "./classes/Character.js";

let baseLayersInitialized = false;

// SceneMe state
let sceneMeLayer;
const sceneMeGridSize = 12;
let sceneMePosX = 0;
let sceneMePosY = 0;
let sceneMeVx = 0;
let sceneMeVy = 0;
let sceneMeWAngle = 0;
let sceneMeBounceCount = 0;
const sceneMeTargetBounces = 18;
const sceneMeTriggerBounces = 22;
const sceneMeFriction = 0.99;
const sceneMeWallDamping = -0.98;
let sceneMeTransitionStarted = false;
let sceneMeLastBounceTime = 0;

function stopHeartbeat() {
  if (state.heartbeatSound) {
    state.heartbeatSound.stop();
  }
  state.heartbeatPlaying = false;
  state.heartbeatActive = false;
  state.heartbeatRemaining = 0;
}

function playHeartbeatOnce() {
  if (!state.heartbeatActive || !state.heartbeatSound) return;
  if (state.heartbeatRemaining <= 0) {
    state.heartbeatActive = false;
    return;
  }
  state.heartbeatSound.stop();
  state.heartbeatSound.setLoop(false);
  state.heartbeatPlaying = true;
  state.heartbeatRemaining--;
  state.heartbeatSound.play();
  state.heartbeatSound.onended(() => {
    state.heartbeatPlaying = false;
    playHeartbeatOnce();
  });
}

function startHeartbeat(times = 2) {
  stopHeartbeat();
  if (!state.heartbeatSound) return;
  state.heartbeatRemaining = times;
  state.heartbeatActive = true;
  playHeartbeatOnce();
}

class FactoryCargo {
  constructor(isLeft, img) {
    this.isLeft = isLeft;
    this.img = img;
    this.t = 0;
    this.speed = 0.002;
  }

  update(delta) {
    this.t += delta * this.speed;
    this.t = constrain(this.t, 0, 1.05);
  }

  isDead() {
    return this.t >= 1;
  }

  display(layer) {
    const topY = (height / 10) * 2;
    const topW = (height / 10) * 2;
    const laneWTop = topW / 3;
    const laneWBottom = width / 3;
    const topStartX = width / 2 - topW / 2;

    const currentY = lerp(topY, height, this.t);
    let x1, x2;
    if (this.isLeft) {
      x1 = lerp(topStartX, 0, this.t);
      x2 = lerp(topStartX + laneWTop, laneWBottom, this.t);
    } else {
      x1 = lerp(topStartX + laneWTop * 2, laneWBottom * 2, this.t);
      x2 = lerp(topStartX + laneWTop * 3, width, this.t);
    }

    const laneWidthCurrent = x2 - x1;
    const boxW = laneWidthCurrent * 0.8;
    const boxH = boxW * 1.2;
    const centerX = (x1 + x2) / 2;

    layer.push();
    layer.imageMode(CENTER);
    layer.rectMode(CENTER);
    if (this.img) {
      layer.image(this.img, centerX, currentY, boxW, boxH);
    } else {
      layer.fill(200);
      layer.rect(centerX, currentY, boxW, boxH);
    }
    layer.pop();
  }
}

export class Scene {
  constructor(start, end, render, sceneCode) {
    this.start = start;
    this.end = end;
    this.render = render;
    this.sceneCode = sceneCode;
  }

  contains(position) {
    return position >= this.start && position < this.end;
  }
}

export function scene1() {
  if (state.currentScrollingPosition < 0) {
    state.currentScrollingPosition = 0;
  }
  mask.update(1);
  mask.display(maskLayer);
  image(maskLayer, 0, 0);
}

export function scene2() {
  envLayer.clear();
  envLayer.background(255);
  let finalWidth = (225 / 500) * width;
  let finalHeight = (150 / 300) * height;
  s1NoisyRect.updateSize(finalWidth, finalHeight, 2);
  s1NoisyRect.display(envLayer);
  s1WallLineUpLeft.endX = s1NoisyRect.topLine.startX;
  s1WallLineUpLeft.endY = s1NoisyRect.topLine.startY;
  s1WallLineDownLeft.endX = s1NoisyRect.bottomLine.startX;
  s1WallLineDownLeft.endY = s1NoisyRect.bottomLine.startY;
  s1WallLineUpRight.endX = s1NoisyRect.topLine.endX;
  s1WallLineUpRight.endY = s1NoisyRect.topLine.endY;
  s1WallLineDownRight.endX = s1NoisyRect.bottomLine.endX;
  s1WallLineDownRight.endY = s1NoisyRect.bottomLine.endY;
  let doorFinalWidth = (50 / 500) * width;
  let doorFinalHeight = (100 / 300) * height;
  let s3DoorOffsetX = s1NoisyRect.width * s3DoorOffsetRatioX;
  let s3DoorOffsetY = s1NoisyRect.height * s3DoorOffsetRatioY;
  s3Door.updateSize(doorFinalWidth, doorFinalHeight, 2);
  s3Door.updatePosition(
    s1NoisyRect.centerX + s3DoorOffsetX,
    s1NoisyRect.centerY + s3DoorOffsetY,
    2
  );
  s3Door.display(envLayer);
  s1WallLineUpRight.display(envLayer);
  s1WallLineDownRight.display(envLayer);
  s1WallLineUpLeft.display(envLayer);
  s1WallLineDownLeft.display(envLayer);
}

export function scene3() {
  envLayer.clear();
  envLayer.background(255);
  s1NoisyRect.display(envLayer);
  s1WallLineUpRight.display(envLayer);
  s1WallLineDownRight.display(envLayer);
  s1WallLineUpLeft.display(envLayer);
  s1WallLineDownLeft.display(envLayer);
  s3Door.updateTransparency(3);
  s3Door.display(envLayer);
  envLayer.noStroke();
  if (state.currentScrollingPosition >= state.scenes[3].end - 50) {
    envLayer.stroke(0);
    envLayer.fill(255, 0, 0);
    envLayer.circle(
      s3Door.centerX - s3Door.width / 4,
      s3Door.centerY,
      (10 / 500) * width
    );
  }
}

export function isScene3RedButtonHit(mx, my) {
  if (!state.scenes[3]) return false;
  if (state.currentScrollingPosition < state.scenes[3].end - 50) return false;
  const cx = s3Door.centerX - s3Door.width / 4;
  const cy = s3Door.centerY;
  const radius = ((10 / 500) * width) / 2;
  return dist(mx, my, cx, cy) <= radius;
}

export function scene4() {
  const titleImg = state.chapter2TitleImg;
  const mapImg = state.chapter2MapImg;

  envLayer.clear();
  if (!titleImg || !mapImg) {
    return;
  }

  const progress = constrain(
    (state.currentScrollingPosition - sceneBounds[4].start) /
      (sceneBounds[4].end - sceneBounds[4].start),
    0,
    1
  );

  const startX = 600;
  const startY = 200;
  const startWidth = 250;
  const startHeight = 150;

  const endX = width / 2;
  const endY = height / 2;
  const endWidth = 1000;
  const endHeight = 600;

  const mapX = lerp(startX, endX, progress);
  const mapY = lerp(startY, endY, progress);
  const mapWidth = lerp(startWidth, endWidth, progress);
  const mapHeight = lerp(startHeight, endHeight, progress);

  envLayer.push();
  envLayer.imageMode(CENTER);

  const coverScale = Math.max(
    width / titleImg.width,
    height / titleImg.height
  );
  envLayer.image(
    titleImg,
    width / 2,
    height / 2,
    titleImg.width * coverScale,
    titleImg.height * coverScale
  );

  envLayer.image(mapImg, mapX, mapY, mapWidth, mapHeight);
  envLayer.pop();
}

function drawFactoryBackgroundAndBelt() {
  envLayer.noFill();
  envLayer.stroke(0);
  envLayer.strokeWeight(5);
  envLayer.strokeCap(ROUND);
  envLayer.strokeJoin(ROUND);
  envLayer.rectMode(CENTER);

  const topY = (height / 10) * 2;
  const topW = (height / 10) * 2;
  const laneWTop = topW / 3;
  const laneWBottom = width / 3;
  const topStartX = width / 2 - topW / 2;

  envLayer.rect(width / 2, height / 10, topW, topW);
  envLayer.line(topStartX, topY, 0, height);
  envLayer.line(topStartX + laneWTop, topY, laneWBottom, height);
  envLayer.line(topStartX + laneWTop * 2, topY, laneWBottom * 2, height);
  envLayer.line(topStartX + laneWTop * 3, topY, width, height);

  let beltOffset = state.factoryBeltOffset + 0.002 * state.factoryScrollDelta;
  beltOffset = ((beltOffset % 1) + 1) % 1;
  state.factoryBeltOffset = beltOffset;
  const numStripes = 6;
  envLayer.strokeWeight(2);
  for (let i = 0; i < numStripes; i++) {
    const t = (beltOffset + i / numStripes) % 1;
    const currentY = lerp(topY, height, t);

    const lx1 = lerp(topStartX, 0, t);
    const lx2 = lerp(topStartX + laneWTop, laneWBottom, t);
    envLayer.line(lx1, currentY, lx2, currentY);

    const rx1 = lerp(topStartX + laneWTop * 2, laneWBottom * 2, t);
    const rx2 = lerp(topStartX + laneWTop * 3, width, t);
    envLayer.line(rx1, currentY, rx2, currentY);
  }
}

function spawnFactoryCargo() {
  if (!state.factoryImages || !state.factoryImages.length) return;
  const isLeft = state.factoryItemsSpawned % 2 === 0;
  const img = state.factoryImages[state.factoryItemsSpawned % state.factoryImages.length];
  state.factoryCargos.push(new FactoryCargo(isLeft, img));
  state.factoryItemsSpawned++;
}

export function resetFactoryScene() {
  state.factoryCargos = [];
  state.factoryItemsSpawned = 0;
  state.factoryFinished = false;
  state.factoryBeltOffset = 0;
  state.factoryLastScrollPos = state.currentScrollingPosition;
}

export function sceneFactory() {
  envLayer.clear();
  envLayer.background(255);
  if (state.factorySound && !state.factorySoundPlaying) {
    state.factorySound.loop();
    state.factorySoundPlaying = true;
  }

  state.factoryScrollDelta =
    state.currentScrollingPosition - (state.factoryLastScrollPos || state.currentScrollingPosition);
  state.factoryLastScrollPos = state.currentScrollingPosition;

  drawFactoryBackgroundAndBelt();

  if (
    state.factoryItemsSpawned === 0 &&
    state.factoryCargos.length === 0 &&
    state.factoryItemsSpawned < state.factoryMaxItems
  ) {
    spawnFactoryCargo();
  }

  if (
    state.factoryScrollDelta > 0 &&
    state.factoryItemsSpawned < state.factoryMaxItems &&
    state.factoryCargos.length > 0
  ) {
    const lastCargo = state.factoryCargos[state.factoryCargos.length - 1];
    if (lastCargo.t > 0.75) {
      spawnFactoryCargo();
    }
  }

  for (let i = state.factoryCargos.length - 1; i >= 0; i--) {
    const cargo = state.factoryCargos[i];
    cargo.update(state.factoryScrollDelta);
    cargo.display(envLayer);
    if (cargo.isDead()) {
      state.factoryCargos.splice(i, 1);
    }
  }

  if (
    !state.factoryFinished &&
    state.factoryItemsSpawned >= state.factoryMaxItems &&
    state.factoryCargos.length === 0
  ) {
    state.factoryFinished = true;
  }
}

export function sceneFactoryEnd() {
  if (state.factorySound && state.factorySoundPlaying) {
    state.factorySound.stop();
    state.factorySoundPlaying = false;
  }
  envLayer.clear();
  const img = state.factoryEndImg;
  if (!img) return;

  const progress = constrain(
    (state.currentScrollingPosition - sceneBounds[7].start) /
      (sceneBounds[7].end - sceneBounds[7].start),
    0,
    1
  );

  const baseScale = Math.max(width / img.width, height / img.height);
  const startScale = baseScale;
  const endScale = Math.max(width / 400, height / 240);
  const startCenterX = width / 2;
  const startCenterY = height / 2;
  const focusCanvasX = width / 2;
  const focusCanvasY = height / 10;
  const targetCenterX = width / 2;
  const targetCenterY = height / 2;

  const focusLocalX = (focusCanvasX - startCenterX) / startScale;
  const focusLocalY = (focusCanvasY - startCenterY) / startScale;
  const endCenterX = targetCenterX - focusLocalX * endScale;
  const endCenterY = targetCenterY - focusLocalY * endScale;

  const drawScale = lerp(startScale, endScale, progress);
  const drawCenterX = lerp(startCenterX, endCenterX, progress);
  const drawCenterY = lerp(startCenterY, endCenterY, progress);
  const drawW = img.width * drawScale;
  const drawH = img.height * drawScale;

  envLayer.push();
  envLayer.imageMode(CENTER);
  envLayer.image(img, drawCenterX, drawCenterY, drawW, drawH);
  envLayer.pop();

  if (
    !state.duringTransition &&
    !state.factoryEndTransitionStarted &&
    progress >= 1 &&
    state.transitions[3]
  ) {
    state.factoryEndTransitionStarted = true;
    state.transitions[3].startTransition();
  }
}
export function sceneEscape() {
  // The process of constraining mouseScrollingExtent
  // and the update of player
  // are all done in the sketch.js: mouseWheel function

  if (!labyrinthWalls.length) {
    labyrinthLayerInitialize();
  }
  characterWe.updateAuto(1, 0, labyrinthWalls);
  characterWe2.updateAuto(1, 0, labyrinthWalls);
  // const cbFunc = labyrinthLayerInitialize;
  const cbFunc = () => {
    labyrinthLayerInitialize();
    state.currentScrollingPosition = sceneBounds[4].end - 100;
  };
  if (
    handlePlayerEnemyCollision(characterMe, characterWe, cbFunc) ||
    handlePlayerEnemyCollision(characterMe, characterWe2, cbFunc)
  ) {
    return;
  }

  labyrinthLayer.background(255);
  for (let i = 0; i < labyrinthWalls.length; i++) {
    labyrinthWalls[i].display(labyrinthLayer);
  }
  const startCol = color(255, 200, 200, 40); // very light red at entrance
  const endCol = color(255, 0, 0); // full red at exit (top)
  const t = constrain(map(characterMe.y, height, 0, 0, 1), 0, 1);
  characterMe.fillColor = lerpColor(startCol, endCol, t);
  characterMe.display(labyrinthLayer);

  characterWe.display(labyrinthLayer);

  characterWe2.display(labyrinthLayer);
  image(labyrinthLayer, 0, 0);
}

// Transition 0 floating phrases
let transitionPhrases = [];
class Phrase {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = random(width);
    this.y = random(height);
    this.size = random(18, 40);
    this.lifetime = int(random(60, 120));
    this.age = 0;
  }
  update() {
    this.age++;
    if (this.age > this.lifetime) {
      this.reset();
    }
  }
  display() {
    const t = this.age / this.lifetime;
    let alpha = t < 0.5 ? map(t, 0, 0.5, 0, 255) : map(t, 0.5, 1, 255, 0);
    fill(255, alpha);
    noStroke();
    textSize(this.size);
    text("Wear Your Mask", this.x, this.y);
  }
}

export class Transition {
  // transition between chapters
  constructor(duration, transitionCode) {
    this.duration = duration;
    // 0 : default - > 1
    // 1 : 1 -> 2
    // ...
    // 4 : 4 - > 5
    this.transitionCode = transitionCode;
    this.currentPosition = 0;
    this.allowEnd = false;
    this.videoContentShown = false;
  }

  startTransition() {
    if (!baseLayersInitialized) {
      envLayerInitialize();
      maskLayerInitialize();
      baseLayersInitialized = true;
    }
    this.currentPosition = 0;
    this.allowEnd = false;
    this.videoContentShown = false;
    state.duringTransition = true;
    state.currentTransitionStartingPage = this.transitionCode;
    transitionRenderInit();
    this.initTransitionContent();
    startHeartbeat(2);
  }

  render() {
    if (this.currentPosition < 0) {
      this.currentPosition = 0;
    }
    const blinkEnd = 25 * this.duration / 150;
    const moveEnd = (2 * this.duration) / 3;
    const eyeShrinkEnd = (12 * this.duration) / 15;
    const coverEnd = this.duration;

    // 0 - duration / 3 : Eye Blinking
    if (this.currentPosition >= 0 && this.currentPosition < blinkEnd) {
      image(envLayer, 0, 0);
      // this.updateTranEyeLayer(blinkEnd);
      this.updateTranEyeLayer((this.duration) / 3);
      image(tranEyeLayer, 0, 0);
    } else {
      //simulate scene2 motion
      const moveProgress = (this.currentPosition - blinkEnd) / (moveEnd - blinkEnd);
      this.updateTransitionScene2(moveProgress);
      // to the very end
      const coverProgress = (this.currentPosition - moveEnd) / (coverEnd - moveEnd);
      this.updateTransitionMirror(coverProgress);
      image(envLayer, 0, 0);

      // 1/3 ~ 12/15 : enlarge erase area to fade out black
      if (this.currentPosition < eyeShrinkEnd) {
        this.updateTranEyeLayerShrink(blinkEnd, eyeShrinkEnd);
        image(tranEyeLayer, 0, 0);
      }
    }
    if (this.currentPosition >= blinkEnd) {
      stopHeartbeat();
    }
    if (this.currentPosition >= this.duration) {
      // reaching the end
      this.renderTransitionContent();
      if (this.allowEnd) {
        this.endTransition();
      }
    }
  }

  endTransition() {
    if (!this.allowEnd){return;}
    stopHeartbeat();
    state.duringTransition = false;
    state.currentTransitionStartingPage = -1;
    envLayer.clear();
    // move to the next scene
    if (this.transitionCode == 0) {
      envLayerInitialize();
      state.currentScrollingPosition = sceneBounds[1].start;
      if (state.maskSound) {
        state.maskSound.play();
      }
    } else if (this.transitionCode == 1) {
      // state.currentScrollingPosition = sceneBounds[1].start;
      state.currentScrollingPosition = sceneBounds[4].start;
    } else if (this.transitionCode == 2) {
      state.currentScrollingPosition = sceneBounds[6].start;
    } else if (this.transitionCode == 3) {
      state.currentScrollingPosition = sceneBounds[8].start;
    } else if (this.transitionCode == 4) {
      state.currentScrollingPosition = sceneBounds[0].start;
      window.location.reload();
    }
  }

  updateTranEyeLayer(restriction) {
    tranEyeLayer.background(0);
    const progress = constrain(this.currentPosition / restriction, 0, 1);
    const phase = progress * TWO_PI * 4;
    const openAmount = pow(sin(phase), 2);
    const eyeX = width * 0.5;
    const eyeY = height * 0.5;
    const eyeWidth = width * 0.7;
    const minHeight = 4;
    const maxHeight = height * 0.6;
    const eyeHeight = lerp(minHeight, maxHeight, openAmount);
    tranEyeLayer.erase();
    tranEyeLayer.fill(255);
    tranEyeLayer.noStroke();
    tranEyeLayer.ellipse(eyeX, eyeY, eyeWidth, eyeHeight);
    tranEyeLayer.noErase();
    tranEyeLayer.filter(BLUR, 20);
  }

  updateTranEyeLayerShrink(start, end) {
    tranEyeLayer.background(0);
    const progress = constrain((this.currentPosition - start) / (end - start), 0, 1);
    // Grow the erase region to remove black overlay
    const eyeX = width * 0.5;
    const eyeY = height * 0.5;
    const baseWidth = width * 0.7;
    const baseHeight = height * 0.6;
    const targetWidth = width * 1.8;
    const targetHeight = height * 1.8;
    const eyeWidth = lerp(baseWidth, targetWidth, progress);
    const eyeHeight = lerp(baseHeight, targetHeight, progress);
    tranEyeLayer.erase();
    tranEyeLayer.fill(255);
    tranEyeLayer.noStroke();
    tranEyeLayer.ellipse(eyeX, eyeY, eyeWidth, eyeHeight);
    tranEyeLayer.noErase();
    tranEyeLayer.filter(BLUR, 20);
  }

  updateTransitionScene2(progress) {
    envLayer.clear();
    envLayer.background(255);
    // Map transition progress onto scene2 scroll span so RectangleWithLine uses it
    const sceneStart = sceneBounds[2].start;
    const sceneEnd = sceneBounds[2].end;
    const prevPos = state.currentScrollingPosition;
    const mappedPos = lerp(sceneStart, sceneEnd, constrain(progress, 0, 1));
    state.currentScrollingPosition = mappedPos;

    const startWidth = (300 / 500) * width;
    const startHeight = (200 / 300) * height;
    const finalWidth = (225 / 500) * width;
    const finalHeight = (150 / 300) * height;
    const currWidth = lerp(startWidth, finalWidth, constrain(progress, 0, 1));
    const currHeight = lerp(startHeight, finalHeight, constrain(progress, 0, 1));

    s1NoisyRect.updateSize(currWidth, currHeight, 2);
    s1NoisyRect.display(envLayer);
    s1WallLineUpLeft.endX = s1NoisyRect.topLine.startX;
    s1WallLineUpLeft.endY = s1NoisyRect.topLine.startY;
    s1WallLineDownLeft.endX = s1NoisyRect.bottomLine.startX;
    s1WallLineDownLeft.endY = s1NoisyRect.bottomLine.startY;
    s1WallLineUpRight.endX = s1NoisyRect.topLine.endX;
    s1WallLineUpRight.endY = s1NoisyRect.topLine.endY;
    s1WallLineDownRight.endX = s1NoisyRect.bottomLine.endX;
    s1WallLineDownRight.endY = s1NoisyRect.bottomLine.endY;
    s1WallLineUpRight.display(envLayer);
    s1WallLineDownRight.display(envLayer);
    s1WallLineUpLeft.display(envLayer);
    s1WallLineDownLeft.display(envLayer);

    // restore actual scroll position
    state.currentScrollingPosition = prevPos;
  }

  updateTransitionMirror(progressRaw) {
    const mirrorImg = state.mirrorImg;
    if (!mirrorImg) return;
    const progress = constrain(progressRaw, 0, 1);
    const baseWidth = s1NoisyRect.width / 3;
    const aspect = mirrorImg.height / mirrorImg.width;
    const baseHeight = baseWidth * aspect;
    const coverScale = Math.max(width / mirrorImg.width, height / mirrorImg.height);
    const targetWidth = mirrorImg.width * coverScale * 2; // a bit extra to ensure full cover
    const targetHeight = targetWidth * aspect;
    const drawWidth = lerp(baseWidth, targetWidth, progress);
    const drawHeight = lerp(baseHeight, targetHeight, progress);

    envLayer.push();
    envLayer.imageMode(CENTER);
    envLayer.image(mirrorImg, s1NoisyRect.centerX, s1NoisyRect.centerY, drawWidth, drawHeight);
    envLayer.pop();
  }

  initTransitionContent() {
    if (this.transitionCode === 0) {
      transitionPhrases = [];
      for (let i = 0; i < 20; i++) {
        transitionPhrases.push(new Phrase());
      }
      textAlign(CENTER, CENTER);
    } else if ([1, 2, 3, 4].includes(this.transitionCode)) {
      if (!state.video) {
        state.video = createCapture(VIDEO);
        state.video.size(width, height);
        state.video.hide();
      }
      if (this.transitionCode !== 4 && state.faceMesh && window.gotFaces) {
        state.faceMesh.detectStart(state.video, window.gotFaces);
      }
      rectMode(CENTER);
      noStroke();
    }
  }

  renderTransitionContent() {
    if ([1, 2, 3, 4].includes(this.transitionCode)) {
      this.videoContentShown = true;
    }
    if (this.transitionCode === 0) {
      background(0);
      push();
      textAlign(CENTER, CENTER);
      textFont("Edu NSW ACT Cursive");
      for (let p of transitionPhrases) {
        p.update();
        p.display();
      }
      pop();
    } else if (this.transitionCode === 1) {
      this.renderMosaicTransition({ faceColorMode: "grayscale", faceBlockSize: 40, bgScale: 12 });
    } else if (this.transitionCode === 2) {
      this.renderMosaicTransition({ faceColorMode: "color", faceBlockSize: 40, bgScale: 12 });
    } else if (this.transitionCode === 3) {
      this.renderMosaicTransition({ faceColorMode: "color", faceBlockSize: 12, bgScale: 12 });
    } else if (this.transitionCode === 4) {
      this.renderVideoDirect();
    }
  }

  renderMosaicTransition({
    faceColorMode = "grayscale",
    faceBlockSize = 40,
    bgScale = 12,
    faceScale = 0.6,
  } = {}) {
    background(0);
    if (!state.video) return;
    state.video.loadPixels();
    if (state.video.pixels.length === 0) return;
    push();
    translate(width, 0);
    scale(-1, 1);
    rectMode(CORNER);
    for (let y = 0; y < height; y += bgScale) {
      for (let x = 0; x < width; x += bgScale) {
        let index = (x + y * width) * 4;
        let r = state.video.pixels[index + 0];
        let g = state.video.pixels[index + 1];
        let b = state.video.pixels[index + 2];
        fill(r, g, b);
        rect(x, y, bgScale, bgScale);
      }
    }
    if (this.transitionCode !== 4 && state.faces && state.faces.length > 0) {
      let face = state.faces[0];
      if (face.box) {
        let x = face.box.x || face.box.xMin;
        let y = face.box.y || face.box.yMin;
        let w = face.box.width;
        let h = face.box.height;
        if (!isNaN(x) && !isNaN(y)) {
          let centerX = x + w / 2;
          let centerY = y + h / 2;
          let maskRadius = ((w + h) / 2) * faceScale;
          let scanSize = maskRadius * 1.5;
          rectMode(CENTER);
          for (let fy = centerY - scanSize; fy < centerY + scanSize; fy += faceBlockSize) {
            for (let fx = centerX - scanSize; fx < centerX + scanSize; fx += faceBlockSize) {
              let d = dist(fx, fy, centerX, centerY);
              if (d < maskRadius) {
                let px = constrain(floor(fx), 0, width - 1);
                let py = constrain(floor(fy), 0, height - 1);
                let index = (px + py * width) * 4;
                let r = state.video.pixels[index + 0];
                let g = state.video.pixels[index + 1];
                let b = state.video.pixels[index + 2];
                if (faceColorMode === "grayscale") {
                  let bright = (r + g + b) / 3;
                  let glitch = random(-50, 50);
                  let finalGray = bright + glitch;
                  if (finalGray > 140) finalGray = 240;
                  else if (finalGray > 80) finalGray = 100;
                  else finalGray = 20;
                  fill(finalGray);
                } else {
                  fill(r, g, b);
                }
                rect(fx, fy, faceBlockSize, faceBlockSize);
              }
            }
          }
        }
      }
    }
    pop();
  }

  renderVideoDirect() {
    background(0);
    if (!state.video) return;
    push();
    translate(width, 0);
    scale(-1, 1);
    image(state.video, 0, 0, width, height);
    pop();
  }
}

function initSceneMe() {
  sceneMeLayer = createGraphics(width, height);
  sceneMeLayer.angleMode(DEGREES);
  sceneMeLayer.textSize(height * (150 / 450));
  sceneMeLayer.textAlign(CENTER, CENTER);
  sceneMeLayer.textStyle(BOLD);
  sceneMeLayer.noStroke();
  sceneMePosX = width / 2;
  sceneMePosY = height / 2;
  sceneMeVx = 0;
  sceneMeVy = 0;
  sceneMeWAngle = 0;
  sceneMeBounceCount = 0;
  sceneMeTransitionStarted = false;
  sceneMeLastBounceTime = 0;
}

function updateSceneMePhysics() {
  sceneMePosX += sceneMeVx;
  sceneMePosY += sceneMeVy;
  sceneMeVx *= sceneMeFriction;
  sceneMeVy *= sceneMeFriction;

  const boundW = width * (180 / 800);
  const boundH = height * (100 / 450);
  let hit = false;

  if (sceneMePosX < boundW || sceneMePosX > width - boundW) {
    sceneMeVx *= sceneMeWallDamping;
    sceneMePosX = constrain(sceneMePosX, boundW, width - boundW);
    hit = true;
  }

  if (sceneMePosY < boundH || sceneMePosY > height - boundH) {
    sceneMeVy *= sceneMeWallDamping;
    sceneMePosY = constrain(sceneMePosY, boundH, height - boundH);
    hit = true;
  }

  if (hit && (abs(sceneMeVx) > 1 || abs(sceneMeVy) > 1)) {
    const now = millis();
    if (now - sceneMeLastBounceTime >= 500) {
      sceneMeLastBounceTime = now;
      if (sceneMeBounceCount < sceneMeTriggerBounces) {
        sceneMeBounceCount++;
        if (sceneMeBounceCount <= sceneMeTargetBounces) {
          sceneMeWAngle += 10;
        } else {
          sceneMeWAngle = 180;
        }
      } else if (sceneMeBounceCount === sceneMeTriggerBounces) {
        sceneMeWAngle = 180;
      }
    }
  }
}

function drawSceneMeLetters() {
  sceneMeLayer.background(0);
  sceneMeLayer.fill(255);

  const offset = width * 0.1;

  sceneMeLayer.push();
  sceneMeLayer.translate(sceneMePosX - offset, sceneMePosY);
  sceneMeLayer.rotate(sceneMeWAngle);
  const visualFix = map(sceneMeWAngle, 0, 180, 0, height * (20 / 450));
  sceneMeLayer.text("W", 0, visualFix);
  sceneMeLayer.pop();

  sceneMeLayer.push();
  sceneMeLayer.translate(sceneMePosX + offset, sceneMePosY);
  sceneMeLayer.text("E", 0, 0);
  sceneMeLayer.pop();
}

export function resetSceneMe() {
  initSceneMe();
}

export function handleSceneMeScroll(event) {
  if (!sceneMeLayer) {
    initSceneMe();
  }
  const deltaY = constrain(event.delta, -scrollingMaxSpd, scrollingMaxSpd);
  const deltaX = constrain(event.deltaX || 0, -scrollingMaxSpd, scrollingMaxSpd);
  const forceY = deltaY * 0.2;
  const forceX = deltaX * 0.2;
  sceneMeVx += random(-0.5, 0.5) * forceY;
  sceneMeVy += forceY;
  sceneMeVx += forceX;
  sceneMeVx = constrain(sceneMeVx, -12, 12);
  sceneMeVy = constrain(sceneMeVy, -12, 12);
}

export function sceneMe() {
  if (!sceneMeLayer || sceneMeLayer.width !== width || sceneMeLayer.height !== height) {
    initSceneMe();
  }

  envLayer.clear();
  envLayer.background(20);

  updateSceneMePhysics();
  drawSceneMeLetters();

  for (let x = 0; x < width; x += sceneMeGridSize) {
    for (let y = 0; y < height; y += sceneMeGridSize) {
      const c = sceneMeLayer.get(x, y);
      if (brightness(c) > 50) {
        const mappedCount = min(sceneMeBounceCount, sceneMeTargetBounces);
        const r = map(mappedCount, 0, sceneMeTargetBounces, 100, 255);
        const g = map(mappedCount, 0, sceneMeTargetBounces, 255, 50);
        const b = 200;
        envLayer.fill(r, g, b);
        envLayer.noStroke();
        envLayer.rect(x, y, sceneMeGridSize * 0.8, sceneMeGridSize * 0.8);
      }
    }
  }

  image(envLayer, 0, 0);

  if (
    !sceneMeTransitionStarted &&
    sceneMeBounceCount >= sceneMeTriggerBounces &&
    !state.duringTransition &&
    state.transitions[4]
  ) {
    sceneMeTransitionStarted = true;
    state.transitions[4].startTransition();
  }
}

function transitionRenderInit() {
  // init envLayer with room and mirror (no door / red button)
  envLayer.background(255);
  const tranRoomCenterX = width / 2;
  const tranRoomCenterY = height / 3;
  const tranRoomWidth = (100 / 500) * width;
  const tranRoomHeight = (67 / 300) * height;
  const tranNoisyRect = new RectangleWithLine(
    tranRoomCenterX,
    tranRoomCenterY,
    tranRoomWidth,
    tranRoomHeight,
    color(0),
    10
  );
  tranNoisyRect.display(envLayer);

  const tranWallUpLeftX = (50 / 500) * width;
  const tranWallUpRightX = (450 / 500) * width;
  const tranWallDownLeftX = (50 / 500) * width;
  const tranWallDownRightX = (450 / 500) * width;
  const tranWallLineUpLeft = new Line(
    tranWallUpLeftX,
    0,
    tranRoomCenterX - tranRoomWidth / 2,
    tranRoomCenterY - tranRoomHeight / 2,
    color(0),
    10
  );
  const tranWallLineUpRight = new Line(
    tranWallUpRightX,
    0,
    tranRoomCenterX + tranRoomWidth / 2,
    tranRoomCenterY - tranRoomHeight / 2,
    color(0),
    10
  );
  const tranWallLineDownLeft = new Line(
    tranWallDownLeftX,
    height,
    tranRoomCenterX - tranRoomWidth / 2,
    tranRoomCenterY + tranRoomHeight / 2,
    color(0),
    10
  );
  const tranWallLineDownRight = new Line(
    tranWallDownRightX,
    height,
    tranRoomCenterX + tranRoomWidth / 2,
    tranRoomCenterY + tranRoomHeight / 2,
    color(0),
    10
  );
  tranWallLineUpLeft.display(envLayer);
  tranWallLineUpRight.display(envLayer);
  tranWallLineDownLeft.display(envLayer);
  tranWallLineDownRight.display(envLayer);

  if (state.mirrorImg) {
    const mirrorAspect = state.mirrorImg.height / state.mirrorImg.width;
    const mirrorWidth = tranRoomWidth / 3;
    const mirrorHeight = mirrorWidth * mirrorAspect;
    envLayer.push();
    envLayer.imageMode(CENTER);
    envLayer.image(state.mirrorImg, tranRoomCenterX, tranRoomCenterY, mirrorWidth, mirrorHeight);
    envLayer.pop();
  }

  // int tranEyeLayer with closed eye
  tranEyeLayer.background(0);
}
