// For Chapter 2 : Escape
export class Wall {
  // topRightX, topRightY are the upper-right corner of the wall
  constructor(topRightX, topRightY, width, height, wallColor = color(0)) {
    this.topRightX = topRightX;
    this.topRightY = topRightY;
    this.width = width;
    this.height = height;
    this.wallColor = wallColor;
  }

  display(layer) {
    layer.push();
    layer.fill(this.wallColor);
    layer.noStroke();
    // rect is drawn from top-left, so shift x by width to convert from top-right
    layer.rect(this.topRightX - this.width, this.topRightY, this.width, this.height);
    layer.pop();
  }

  getBounds() {
    return {
      left: this.topRightX - this.width,
      right: this.topRightX,
      top: this.topRightY,
      bottom: this.topRightY + this.height,
    };
  }
}
