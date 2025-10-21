// Layer
let bgLayer, lineLayer, movingLayer;
let previousFrameLayer;

const trueWidth = 800;
const trueHeight = 500;

// static background
const totalColorNum = 4;
let backSinAmp = 100;
let backgroundBallR = 30;
let sinWaveNum = 3;
let amp1, amp2, amp3;
let breathCCR1, breathCCR2, breathCCR3;
let breathCCNum1, breathCCNum2, breathCCNum3;
let breathCCangleTotalNum;
let breathCC_XCenter1, breathCC_XCenter2, breathCC_XCenter3;
let breathCC_YCenter1, breathCC_YCenter2, breathCC_YCenter3;

// line
let baseLine;
let baseLineEnd;
let preX;
let preY;
let curX;
let curY;
let piColor;
let r;

// decoration
let preClickX, preClickY;

function setup() {
  let canvas = createCanvas(trueWidth * 2, trueHeight);
  canvas.id("p5-canvas");
  canvas.parent("p5-canvas-container");
  noCursor();

  // different layer
  bgLayer = createGraphics(trueWidth, trueHeight);
  lineLayer = createGraphics(trueWidth, trueHeight);
  movingLayer = createGraphics(trueWidth, trueHeight);
  previousFrameLayer = createGraphics(trueWidth, trueHeight);

  // background variables
  // smaller ligher
  let c1 = color(10, 133, 255); // Blue1
  let c2 = color(0, 102, 204); // Blue2
  let c3 = color(0, 30, 152); // Blue3
  let c4 = color(0, 0, 112); // Blue4
  let c5 = color(0, 0, 30); // Blue5
  bgMetadataInit(10, 25, 4, 10);
  createBgColorAndWave(bgLayer, c1, c4, c5, c3);
  create3CCSets(bgLayer);
  previousFrameLayer.image(bgLayer, 0, 0);

  // moving line initialization
  baseLine = trueHeight / 2;
  baseLineEnd = 0;
  preX = 0;
  preY = baseLine;
  curX = 0;
  curY = baseLine;
  piColor = 0;
  r = 25;
  lineLayer.clear();

  // decoration
  preClickX = 0;
  preClickY = baseLine;
}

function draw() {
  background(255);
  // 0-trueWidth: previousFrameLayer
  image(previousFrameLayer, 0, 0);
  // trueWidth-2*trueWidth: bgLayer (and current layer)
  image(previousFrameLayer, 0, 0);
  image(bgLayer, trueWidth, 0);

  // line layer

  // Line color
  let strokeR = map(cos(piColor), -1, 1, 0, 255);
  let strokeG = 255;
  let strokeB = map(sin(piColor), -1, 1, 0, 255);
  // draw the segment onto the persistent lineLayer
  lineLayer.stroke(strokeR, strokeG, strokeB);
  lineLayer.strokeWeight(10);
  // First point: preX, preY; Destination Point: curX, curY
  lineLayer.line(preX, preY, curX, curY);
  image(lineLayer, trueWidth, 0);

  // movingLayer
  movingLayer.clear();
  movingLayer.push();
  movingLayer.noStroke();
  let localMouseX = mouseX - trueWidth;
  let localMouseY = mouseY;

  // sparking cursor
  let controlledX;
  // random sparking small circles
  for (let i = 0; i < 12; i++) {
    let randomAngle = random(TWO_PI);
    let distance = random(0, 14);
    controlledX = constrain(localMouseX, curX, curX + 50);
    let x = controlledX + cos(randomAngle) * distance + random(-1, 1);
    let y = localMouseY + sin(randomAngle) * distance + random(-1, 1);
    let sizeSpark = random(1.5, 6);
    let alpha = random(100, 255); // the transparency
    movingLayer.fill(strokeR, random(180, 255), strokeB, alpha);
    movingLayer.circle(x, y, sizeSpark);
  }
  movingLayer.fill(strokeR, strokeG, strokeB, 255);
  // the main cursor
  movingLayer.circle(controlledX, localMouseY, 6);
  movingLayer.pop();

  image(movingLayer, trueWidth, 0);

  // Data changed each frame

  // Line
  baseLineEnd += 1; // linear movement
  preX = curX;
  preY = curY;
  curX = baseLineEnd;
  // set vertical position for next point

  if (curX > trueWidth) {
    // add what have been drawn to the previousFrameLayer
    previousFrameLayer.clear();
    previousFrameLayer.image(bgLayer, 0, 0);
    previousFrameLayer.image(lineLayer, 0, 0);
    curX = 0;
    preX = 0;
    baseLineEnd = 0;

    // change color phase
    piColor += PI / 12;

    // regenerate background (draw into bgLayer)
    bgLayer.clear();
    let c1 = color(10, 133, 255); // Blue1
    let c2 = color(0, 102, 204); // Blue2
    let c3 = color(0, 30, 152); // Blue3
    let c4 = color(0, 0, 112); // Blue4
    let c5 = color(0, 0, 30); // Blue5
    bgMetadataInit(10, 25, 4, 10);
    createBgColorAndWave(bgLayer, c1, c4, c5, c3);
    create3CCSets(bgLayer);

    // clear the lineLayer if you want to restart trail
    lineLayer.clear();
  }
}

// functions

// Initialization functions
// BG metadata initialization
function bgMetadataInit(
  breathCCRStart,
  breathCCREnd,
  breathCCNumStart,
  breathCCNumEnd
) {
  // sin wave variables
  amp1 = random(30, 100);
  amp2 = random(30, 90);
  amp3 = random(30, 120);

  // breath Concentric Circle variables
  breathCCR1 = random(breathCCRStart, breathCCREnd);
  breathCCR2 = random(breathCCRStart, breathCCREnd);
  breathCCR3 = random(breathCCRStart, breathCCREnd);

  breathCCNum1 = random(breathCCNumStart, breathCCNumEnd);
  breathCCNum2 = random(breathCCNumStart, breathCCNumEnd);
  breathCCNum3 = random(breathCCNumStart, breathCCNumEnd);

  // make sure at least 4 CCs can appear in the canvas
  breathCC_XCenter1 = random(4 * breathCCR1, trueWidth - 4 * breathCCR1);
  breathCC_YCenter1 = random(4 * breathCCR1, trueHeight - 4 * breathCCR1);

  do {
    breathCC_XCenter2 = random(4 * breathCCR2, trueWidth - 4 * breathCCR2);
    breathCC_YCenter2 = random(4 * breathCCR2, trueHeight - 4 * breathCCR2);
  } while (
    dist(
      breathCC_XCenter1,
      breathCC_YCenter1,
      breathCC_XCenter2,
      breathCC_YCenter2
    ) <=
    breathCCR1 * breathCCNum1 + breathCCR2 * breathCCNum2
  );

  // avoid infinite loop
  let maxTries = 100;
  let tries = 0;

  do {
    breathCC_XCenter3 = random(4 * breathCCR3, trueWidth - 4 * breathCCR3);
    breathCC_YCenter3 = random(4 * breathCCR3, trueHeight - 4 * breathCCR3);
    tries++;
  } while (
    (dist(
      breathCC_XCenter3,
      breathCC_YCenter3,
      breathCC_XCenter1,
      breathCC_YCenter1
    ) <=
      breathCCR3 * breathCCNum3 + breathCCR1 * breathCCNum1 ||
      dist(
        breathCC_XCenter3,
        breathCC_YCenter3,
        breathCC_XCenter2,
        breathCC_YCenter2
      ) <=
        breathCCR3 * breathCCNum3 + breathCCR2 * breathCCNum2) &&
    tries < maxTries
  );

  if (tries >= maxTries) {
    print(
      "Warning: failed to place 3rd CC set without overlap after",
      maxTries,
      "tries"
    );
  }

  breathCCangleTotalNum = 3;
}

// draw one CCSet
function createBreathCCSet(
  breathCC_XCenter,
  breathCC_YCenter,
  breathCCNum,
  breathCCR,
  g = this
) {
  g.push();
  g.translate(breathCC_XCenter, breathCC_YCenter);
  for (let i = 0; i < breathCCNum; i++) {
    const CCangle = TWO_PI;
    const base = (PI / 6) * i;
    let a0 = base + random(0, PI / 6);
    let a1 = base + PI / 6 + random(0, PI / 6);

    a0 = ((a0 % CCangle) + CCangle) % CCangle;
    a1 = ((a1 % CCangle) + CCangle) % CCangle;
    if (a1 <= a0) a1 += CCangle;

    const d = breathCCR * 2 * (i + 1);
    g.arc(0, 0, d, d, a1, a0 + CCangle);
  }
  g.pop();
}

// Draw bg and wave into g (or main canvas if g omitted)
function createBgColorAndWave(g = this, c1, c2, c3, c4) {
  g.push();
  g.strokeWeight(1);

  // width for each segment
  const segW = trueWidth / (totalColorNum - 1);
  for (let x = 0; x < trueWidth + 100; x++) {
    let seg = floor(constrain(x / segW, 0, totalColorNum - 2));
    let cRatio = (x - seg * segW) / segW;
    let tEase = (1 - cos(PI * cRatio)) / 2;

    let curColor;
    if (seg == 0) {
      curColor = lerpColor(c4, c2, tEase);
    } else if (seg == 1) {
      curColor = lerpColor(c2, c3, tEase);
    } else if (seg == 2) {
      curColor = lerpColor(c3, c4, tEase);
    }

    g.stroke(curColor);
    g.line(x, 0, x, trueHeight);

    // Since Waves
    g.fill(0, 30);
    let angle1 = map(x, 0, trueWidth, PI / 3, TWO_PI * 2 + (0 * PI) / 3);
    let y1 = trueHeight / 2 + sin(angle1) * amp1 - 200;
    g.circle(x, y1, backgroundBallR * 2);

    let angle2 = map(x, 0, trueWidth, (2 * PI) / 3, TWO_PI * 2 + (1 * PI) / 3);
    let y2 = trueHeight / 2 + sin(angle2) * amp2;
    g.circle(x, y2, backgroundBallR * 2);

    let angle3 = map(x, 0, trueWidth, (3 * PI) / 3, TWO_PI * 2 + (2 * PI) / 3);
    let y3 = trueHeight / 2 + sin(angle3) * amp3 + 200;
    g.circle(x, y3, backgroundBallR * 2);
  }

  g.pop();
}

// Draw 3 CC-Set into g (or main canvas if g omitted)
function create3CCSets(g = this) {
  g.noFill();
  g.stroke(255, 50);
  g.strokeWeight(1);
  createBreathCCSet(
    breathCC_XCenter1,
    breathCC_YCenter1,
    breathCCNum1,
    breathCCR1,
    g
  );
  createBreathCCSet(
    breathCC_XCenter2,
    breathCC_YCenter2,
    breathCCNum2,
    breathCCR2,
    g
  );
  createBreathCCSet(
    breathCC_XCenter3,
    breathCC_YCenter3,
    breathCCNum3,
    breathCCR3,
    g
  );
}

// Line movement: keep mousePressed behavior
function mousePressed() {
  if (mouseY > 0 && mouseY < trueHeight) {
    curY = mouseY;
  }
}
