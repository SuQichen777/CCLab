export class Hand {
  constructor(x1, y1, x2, y2, color, bottomXLeft, bottomXRight) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.color = color;
    this.bottomXLeft = bottomXLeft;
    this.bottomXRight = bottomXRight;
    this.rotation = 0;
    this.currentMode = 0;
  }

  update(mode, mode1TargetX, mode1TargetY, mode1Duration) {
    // mode 0: normal mode
    if (mode == 0) {
      this.rotation = sin(frameCount * 0.03) * 5;
    } else if (mode == 1) {
      // change end (x1, y1) - (x2, y2) to reach Target
    }
  }

  display(layer) {
    layer.push();
    layer.angleMode(DEGREES);
    layer.rotate(this.rotation);
    layer.beginShape();
    layer.vertex(this.bottomXLeft, layer.height * 2);
    layer.vertex(this.x1, this.y1);
    layer.vertex(this.x2, this.y2);
    layer.vertex(this.bottomXRight, layer.height * 2);
    layer.endShape(CLOSE);
    layer.pop();
  }
}
