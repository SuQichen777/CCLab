export class Line {
  constructor(
    startX,
    startY,
    endX,
    endY,
    lineColor = color(0),
    noiseStrength = 30,
    totalCircleNum = 100,
    circleRadius = 1
  ) {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    this.lineColor = lineColor;
    this.totalCircleNum = totalCircleNum;
    this.noiseStrength = noiseStrength;
    this.circleRadius = circleRadius;
  }

  update() {}

  display(layer) {
    layer.noStroke();
    layer.fill(this.lineColor);
    for (let i = 0; i < this.totalCircleNum; i++) {
      let currentFactor = i / this.totalCircleNum;
      let currentX = lerp(this.startX, this.endX, currentFactor);
      let currentY = lerp(this.startY, this.endY, currentFactor);
      let noiseX = map(
        noise(i * 0.01),
        0,
        1,
        -this.noiseStrength,
        this.noiseStrength
      );
      let noiseY = map(
        noise(i * 0.01 + 10000),
        0,
        1,
        -this.noiseStrength,
        this.noiseStrength
      );
      let finalX = currentX + noiseX;
      let finalY = currentY + noiseY;
      layer.circle(finalX, finalY, this.circleRadius);
    }
  }
}
