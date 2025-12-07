import { state } from "./state.js";
import {
  envLayer,
  maskLayer,
  labyrinthLayer,
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
  characterMe,
  characterWe,
  characterWe2,
} from "./layers.js";

export class Scene {
  constructor(start, end, render) {
    this.start = start;
    this.end = end;
    this.render = render;
  }

  contains(position) {
    return position >= this.start && position < this.end;
  }
}

export function scene1() {
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

export function scene4() {}
export function sceneEscape() {
  // The process of constraining mouseScrollingExtent
  // and the update of player
  // are all done in the sketch.js: mouseWheel function
  labyrinthLayer.background(255);
  if (!labyrinthWalls.length) {
    labyrinthLayerInitialize();
  }
  for (let i = 0; i < labyrinthWalls.length; i++) {
    labyrinthWalls[i].display(labyrinthLayer);
  }
  characterMe.display(labyrinthLayer);
  characterWe.updateAuto(1, 0, labyrinthWalls);
  characterWe.display(labyrinthLayer);
  characterWe2.updateAuto(1, 0, labyrinthWalls);
  characterWe2.display(labyrinthLayer);
  image(labyrinthLayer, 0, 0);
}
