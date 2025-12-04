import { state } from "../state.js";
import { sceneBounds } from "../constants.js";

export class Mask {
  constructor(startX, startY, maskSize, eyeSize, maskColor = color(0)) {
    this.startX = startX;
    this.startY = startY;
    this.x = startX;
    this.y = startY;
    this.maskSize = maskSize;
    this.eyeSize = eyeSize;
    this.rotation = 0;
    this.maskColor = maskColor;
  }

  update(sceneIndex) {
    let scene = sceneBounds[sceneIndex];
    if (!scene) return;
    this.rotation = map(
      state.currentScrollingPosition,
      scene.start,
      scene.end,
      0,
      30
    );
    this.y = map(
      state.currentScrollingPosition,
      scene.start,
      scene.end,
      this.startY,
      2 * height
    );
    this.x = map(
      state.currentScrollingPosition,
      scene.start,
      scene.end,
      this.startX,
      this.startX + (50 / 500) * width
    );
  }

  display(maskLayer) {
    maskLayer.push();
    maskLayer.clear();
    maskLayer.fill(this.maskColor);
    maskLayer.translate(this.x, this.y);
    maskLayer.rotate(this.rotation);
    maskLayer.circle(0, 0, this.maskSize);
    maskLayer.erase();
    maskLayer.circle(-this.maskSize / 4, -this.maskSize / 8, this.eyeSize);
    maskLayer.circle(this.maskSize / 4, -this.maskSize / 8, this.eyeSize);
    maskLayer.noErase();
    maskLayer.pop();
  }
}
