// currentPosition
let currentScrollingPosition;
// Scene
let scene1Start, scene1End; // 0, 1000
let scene2Start, scene2End; // 1000, 2000

// All Layers
let maskLayer, envLayer;
// Env Layer
// scene1
let s1RoomCenterX, s1RoomCenterY, s1RoomWidth, s1RoomHeight;
let s1WallUpLeftX, s1WallUpRightX, s1WallDownLeftX, s1WallDownRightX, s1WallUpLeftX2, s1WallUpRightX2, s1WallDownLeftX2, s1WallDownRightX2;
let s1NoisyRect, s1WallLineUpLeft, s1WallLineUpRight, s1WallLineDownLeft, s1WallLineDownRight;

// Mask
let mask;

function setup() {
  let canvas = createCanvas(500, 300);
  maskLayer = createGraphics(width, height);
  envLayer = createGraphics(width, height);

  // global variables
  currentScrollingPosition = 0;
  // scene
  scene1Start = 0;
  scene1End = 1000;

  // env layer
  envLayerInitialize();

  // mask layer
  maskLayerInitialize();
  canvas.id("p5-canvas");
  canvas.parent("p5-canvas-container");
}

function draw() {
  background(0);
  // noStroke();
  console.log(currentScrollingPosition);
  image(envLayer, 0, 0);
  if (currentScrollingPosition < scene1Start) {
    image(maskLayer, 0, 0);
  } else if (currentScrollingPosition < scene1End) {
    mask.update();
    mask.display(maskLayer);
    image(maskLayer, 0, 0);
  }
}

function mouseWheel(event) {
  let mouseScrollingExtent = constrain(event.delta, -2, 2);
  currentScrollingPosition += mouseScrollingExtent;
}

// Environment

function envLayerInitialize() {
  envLayer.background(255);
  // let s1RoomCenterX, s1RoomCenterY, s1RoomWidth, s1RoomHeight;
  s1RoomCenterX = width / 2;
  s1RoomCenterY = height / 3;
  s1RoomWidth = 150;
  s1RoomHeight = 100;
  s1NoisyRect = new RectangleWithLine(
    s1RoomCenterX, // x
    s1RoomCenterY, // y
    s1RoomWidth, // width
    s1RoomHeight, // height
    color(0),
    10
  );
  s1NoisyRect.display(envLayer);
  s1WallUpLeftX = 50;
  s1WallUpRightX = 450;
  s1WallDownLeftX = 50;
  s1WallDownRightX = 450;
  s1WallLineUpLeft = new Line(
    s1WallUpLeftX,
    0,
    s1RoomCenterX - s1RoomWidth / 2,
    s1RoomCenterY - s1RoomHeight / 2,
    color(0),
    10
  );
  s1WallLineUpRight = new Line(
    s1WallUpRightX,
    0,
    s1RoomCenterX + s1RoomWidth / 2,
    s1RoomCenterY - s1RoomHeight / 2,
    color(0),
    10
  );
  s1WallLineDownLeft = new Line(
    s1WallDownLeftX,
    height,
    s1RoomCenterX - s1RoomWidth / 2,
    s1RoomCenterY + s1RoomHeight / 2,
    color(0),
    10
  );
  s1WallLineDownRight = new Line(
    s1WallDownRightX,
    height,
    s1RoomCenterX + s1RoomWidth / 2,
    s1RoomCenterY + s1RoomHeight / 2,
    color(0),
    10
  );
  s1WallLineUpLeft.display(envLayer);
  s1WallLineUpRight.display(envLayer);
  s1WallLineDownLeft.display(envLayer);
  s1WallLineDownRight.display(envLayer);


}

// Mask
function maskLayerInitialize() {
  maskLayer.noStroke();
  maskLayer.angleMode(DEGREES);
  mask = new Mask(maskLayer.width / 2, maskLayer.height / 2, 600, 200);
  mask.display(maskLayer);
}

class Mask {
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

  update() {
    // currentScrollingPosition [0, 1000]
    this.rotation = map(
      currentScrollingPosition,
      scene1Start,
      scene1End,
      0,
      30
    );
    this.y = map(
      currentScrollingPosition,
      scene1Start,
      scene1End,
      this.startY,
      2 * height
    );
    this.x = map(
      currentScrollingPosition,
      scene1Start,
      scene1End,
      this.startX,
      this.startX + 50
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

class Line {
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

class RectangleWithLine {
  constructor(centerX, centerY, width, height, color, noiseStrength = 30) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.width = width;
    this.height = height;
    this.color = color;
    this.noiseStrength = noiseStrength;
    this.topLine = new Line(
      centerX - width / 2,
      centerY - height / 2,
      centerX + width / 2,
      centerY - height / 2,
      color,
      noiseStrength
    );
    this.rightLine = new Line(
      centerX + width / 2,
      centerY - height / 2,
      centerX + width / 2,
      centerY + height / 2,
      color,
      noiseStrength
    );
    this.bottomLine = new Line(
      centerX - width / 2,
      centerY + height / 2,
      centerX + width / 2,
      centerY + height / 2,
      color,
      noiseStrength
    );
    this.leftLine = new Line(
      centerX - width / 2,
      centerY - height / 2,
      centerX - width / 2,
      centerY + height / 2,
      color,
      noiseStrength
    );
  }

  update() {}

  display(layer) {
    this.topLine.display(layer);
    this.rightLine.display(layer);
    this.bottomLine.display(layer);
    this.leftLine.display(layer);
  }
}
