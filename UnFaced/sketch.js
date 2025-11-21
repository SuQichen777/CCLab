// currentPosition
let currentScrollingPosition;
let scrollingMaxSpd = 5;
// Scene

let scene1Start, scene1End; // 0, 1000
let scene2Start, scene2End; // 1000, 2000
let scene3Start, scene3End; // 2000, 2500
let scene4Start, scene4End; // 2500, 3000
let scenes = [];
let scene;

// All Layers
let maskLayer, envLayer, handLayer;
// Env Layer
// scene1
// s1 variables
let s1RoomCenterX,
  s1RoomCenterY,
  s1RoomWidth,
  s1RoomHeight,
  s1RoomFinalWidth,
  s1RoomFinalHeight;
let s1WallUpLeftX,
  s1WallUpRightX,
  s1WallDownLeftX,
  s1WallDownRightX,
  s1WallUpLeftX2,
  s1WallUpRightX2,
  s1WallDownLeftX2,
  s1WallDownRightX2;
// s1 instance
let s1NoisyRect,
  s1WallLineUpLeft,
  s1WallLineUpRight,
  s1WallLineDownLeft,
  s1WallLineDownRight;

// scene3
let s3Door,
  s3DoorWidth,
  s3DoorHeight,
  s3DoorFinalWidth,
  s3DoorFinalHeight,
  s3DoorOffsetX,
  s3DoorOffsetY,
  s3DoorOffsetRatioX,
  s3DoorOffsetRatioY;
// Mask
let mask;
// Hand
let leftHand;

function setup() {
  let canvas = createCanvas(500, 300);
  maskLayer = createGraphics(width, height);
  envLayer = createGraphics(width, height);
  handLayer = createGraphics(width / 2, height / 2);

  // global variables
  currentScrollingPosition = 0;
  // scene
  scene1Start = 0;
  scene1End = 1000;
  scene2Start = 1000;
  scene2End = 2000;
  scene3Start = 2000;
  scene3End = 2500;
  scene4Start = 2500;
  scene4End = 3000;
  scenes = [
    new Scene(Number.NEGATIVE_INFINITY, scene1Start, () => {
      image(maskLayer, 0, 0);
    }),
    new Scene(scene1Start, scene1End, scene1),
    new Scene(scene2Start, scene2End, scene2),
    new Scene(scene3Start, scene3End, scene3),
    new Scene(scene4Start, scene4End, scene4),
  ];

  // env layer
  envLayerInitialize();

  // mask layer
  maskLayerInitialize();

  // hand layer
  handLayerInitialize();
  canvas.id("p5-canvas");
  canvas.parent("p5-canvas-container");
}

function draw() {
  background(0);
  // noStroke();
  console.log(currentScrollingPosition);
  // there is always an environment layer
  // but the content in the environment is changed
  image(envLayer, 0, 0);
  handLayer.clear();
  leftHand.update(0);
  leftHand.display(handLayer);
  // place hand layer at bottom-left of the main canvas
  image(handLayer, 0, height - handLayer.height);
  if (currentScrollingPosition > scenes[scenes.length - 1].end) {
    currentScrollingPosition = scenes[scenes.length - 1].end;
  }
  let activeScene = scenes.find((scene) =>
    scene.contains(currentScrollingPosition)
  );
  if (activeScene) {
    // call the coresponding function
    activeScene.render();
  }
}

function scene1() {
  mask.update(1);
  mask.display(maskLayer);
  image(maskLayer, 0, 0);
}

function scene2() {
  envLayer.clear();
  envLayer.background(255);
  s1RoomFinalWidth = 225;
  s1RoomFinalHeight = 150;
  s1NoisyRect.updateSize(s1RoomFinalWidth, s1RoomFinalHeight, 2);
  s1NoisyRect.display(envLayer);
  s1WallLineUpLeft.endX = s1NoisyRect.topLine.startX;
  s1WallLineUpLeft.endY = s1NoisyRect.topLine.startY;
  s1WallLineDownLeft.endX = s1NoisyRect.bottomLine.startX;
  s1WallLineDownLeft.endY = s1NoisyRect.bottomLine.startY;
  s1WallLineUpRight.endX = s1NoisyRect.topLine.endX;
  s1WallLineUpRight.endY = s1NoisyRect.topLine.endY;
  s1WallLineDownRight.endX = s1NoisyRect.bottomLine.endX;
  s1WallLineDownRight.endY = s1NoisyRect.bottomLine.endY;
  s3DoorFinalWidth = 50;
  s3DoorFinalHeight = 100;
  s3DoorOffsetX = s1NoisyRect.width * s3DoorOffsetRatioX;
  s3DoorOffsetY = s1NoisyRect.height * s3DoorOffsetRatioY;
  s3Door.updateSize(s3DoorFinalWidth, s3DoorFinalHeight, 2);
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

function scene3() {
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
  // red door presser
  if (currentScrollingPosition >= scenes[3].end - 50) {
    envLayer.stroke(0);
    envLayer.fill(255, 0, 0);
    envLayer.circle(s3Door.centerX - s3Door.width / 4, s3Door.centerY, 10);
  }
}

function scene4() {}

function mouseWheel(event) {
  if (leftHand.currentMode != 1) {
    let mouseScrollingExtent = constrain(
      event.delta,
      -scrollingMaxSpd,
      scrollingMaxSpd
    );
    currentScrollingPosition += mouseScrollingExtent;
  }
}

// Environment

class Scene {
  constructor(start, end, render) {
    this.start = start;
    this.end = end;
    this.render = render;
  }

  contains(position) {
    return position >= this.start && position < this.end;
  }
}

function handLayerInitialize() {
  // handLayer.noStroke()
  // x1, y1, x2, y2, color, bottomXLeft, bottomXRight
  leftHand = new Hand(
    (2 * handLayer.width) / 5,
    handLayer.height / 5,
    (4 * handLayer.width) / 5,
    (2 * handLayer.height) / 5,
    color(255),
    handLayer.width / 5,
    (3 * handLayer.width) / 5
  );
  leftHand.display(handLayer);
}

function envLayerInitialize() {
  envLayer.background(255);
  // let s1RoomCenterX, s1RoomCenterY, s1RoomWidth, s1RoomHeight;
  s1RoomCenterX = width / 2;
  s1RoomCenterY = height / 3;
  // s1RoomWidth = 225;
  // s1RoomHeight = 150;
  s1RoomWidth = 100;
  s1RoomHeight = 67;
  s1NoisyRect = new RectangleWithLine(
    s1RoomCenterX, // x
    s1RoomCenterY, // y
    s1RoomWidth, // width
    s1RoomHeight, // height
    color(0),
    10
  );
  // s3DoorWidth = 50;
  // s3DoorHeight = 100;
  s3DoorOffsetRatioX = 20 / 225;
  s3DoorOffsetRatioY = 20 / 150;
  s3DoorOffsetX = s1RoomWidth * s3DoorOffsetRatioX;
  s3DoorOffsetY = s1RoomHeight * s3DoorOffsetRatioY;
  s3DoorWidth = 22;
  s3DoorHeight = 44;
  s3Door = new RectangleWithLine(
    s1RoomCenterX + s3DoorOffsetX, // x
    s1RoomCenterY + s3DoorOffsetY, // y
    s3DoorWidth, // width
    s3DoorHeight, // height
    color(0, 0, 0, 20),
    10
  );
  s3Door.display(envLayer);
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
    this.originalCenterX = centerX;
    this.originalCenterY = centerY;
    this.originalWidth = width;
    this.originalHeight = height;
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

  updateSize(finalWidth, finalHeight, scene) {
    let scrollStart, scrollEnd;
    scrollStart = scenes[scene].start;
    scrollEnd = scenes[scene].end;
    let newWidth = map(
      currentScrollingPosition,
      scrollStart,
      scrollEnd,
      this.originalWidth,
      finalWidth
    );
    let newHeight = map(
      currentScrollingPosition,
      scrollStart,
      scrollEnd,
      this.originalHeight,
      finalHeight
    );
    this.width = newWidth;
    this.height = newHeight;
    this.topLine.startX = this.centerX - newWidth / 2;
    this.topLine.endX = this.centerX + newWidth / 2;
    this.topLine.startY = this.centerY - newHeight / 2;
    this.topLine.endY = this.centerY - newHeight / 2;

    this.rightLine.startX = this.centerX + newWidth / 2;
    this.rightLine.endX = this.centerX + newWidth / 2;
    this.rightLine.startY = this.centerY - newHeight / 2;
    this.rightLine.endY = this.centerY + newHeight / 2;

    this.leftLine.startX = this.centerX - newWidth / 2;
    this.leftLine.endX = this.centerX - newWidth / 2;
    this.leftLine.startY = this.centerY - newHeight / 2;
    this.leftLine.endY = this.centerY + newHeight / 2;

    this.bottomLine.startX = this.centerX - newWidth / 2;
    this.bottomLine.endX = this.centerX + newWidth / 2;
    this.bottomLine.startY = this.centerY + newHeight / 2;
    this.bottomLine.endY = this.centerY + newHeight / 2;
  }

  updateTransparency(scene) {
    let scrollStart, scrollEnd;
    scrollStart = scenes[scene].start;
    scrollEnd = scenes[scene].end;
    let newTransparency = map(
      currentScrollingPosition,
      scrollStart,
      scrollEnd,
      20,
      255
    );
    this.topLine.lineColor.setAlpha(newTransparency);
    this.rightLine.lineColor.setAlpha(newTransparency);
    this.bottomLine.lineColor.setAlpha(newTransparency);
    this.leftLine.lineColor.setAlpha(newTransparency);
  }

  updatePosition(newCenterX, newCenterY, scene) {
    let scrollStart, scrollEnd;
    scrollStart = scenes[scene].start;
    scrollEnd = scenes[scene].end;
    let mappedCenterX = map(
      currentScrollingPosition,
      scrollStart,
      scrollEnd,
      this.originalCenterX,
      newCenterX
    );
    let mappedCenterY = map(
      currentScrollingPosition,
      scrollStart,
      scrollEnd,
      this.originalCenterY,
      newCenterY
    );

    this.centerX = mappedCenterX;
    this.centerY = mappedCenterY;

    let halfW = this.width / 2;
    let halfH = this.height / 2;

    this.topLine.startX = mappedCenterX - halfW;
    this.topLine.endX = mappedCenterX + halfW;
    this.topLine.startY = mappedCenterY - halfH;
    this.topLine.endY = mappedCenterY - halfH;

    this.rightLine.startX = mappedCenterX + halfW;
    this.rightLine.endX = mappedCenterX + halfW;
    this.rightLine.startY = mappedCenterY - halfH;
    this.rightLine.endY = mappedCenterY + halfH;

    this.leftLine.startX = mappedCenterX - halfW;
    this.leftLine.endX = mappedCenterX - halfW;
    this.leftLine.startY = mappedCenterY - halfH;
    this.leftLine.endY = mappedCenterY + halfH;

    this.bottomLine.startX = mappedCenterX - halfW;
    this.bottomLine.endX = mappedCenterX + halfW;
    this.bottomLine.startY = mappedCenterY + halfH;
    this.bottomLine.endY = mappedCenterY + halfH;
  }

  display(layer) {
    this.topLine.display(layer);
    this.rightLine.display(layer);
    this.bottomLine.display(layer);
    this.leftLine.display(layer);
  }
}

class Hand {
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
