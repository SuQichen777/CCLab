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

  update(scene) {
    if (scene == 1) {
      this.rotation = map(
        currentScrollingPosition,
        scenes[scene].start,
        scenes[scene].end,
        0,
        30
      );
      this.y = map(
        currentScrollingPosition,
        scenes[scene].start,
        scenes[scene].end,
        this.startY,
        2 * height
      );
      this.x = map(
        currentScrollingPosition,
        scenes[scene].start,
        scenes[scene].end,
        this.startX,
        this.startX + 50
      );
    }
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