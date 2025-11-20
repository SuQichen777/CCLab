
// currentPosition
let currentScrollingPosition;

let maskLayer;
let mask;

function setup() {
  let canvas = createCanvas(500, 300);
  maskLayer = createGraphics(width, height);

  // global variables
  currentScrollingPosition = 0;

  // mask layer
  maskLayerInitialize();
  canvas.id("p5-canvas");
  canvas.parent("p5-canvas-container");
}

function draw() {
  background(0);
  // noStroke();
  console.log(currentScrollingPosition);
  if (currentScrollingPosition < 0){
    image(maskLayer, 0, 0);
  } else if (currentScrollingPosition < 1000){
    mask.update();
    mask.display(maskLayer);
    image(maskLayer, 0, 0);

  }

}

function mouseWheel(event) {
  let mouseScrollingExtent = constrain(event.delta, -2, 2);
  currentScrollingPosition += mouseScrollingExtent;
}

function maskLayerInitialize(){
  maskLayer.angleMode(DEGREES);
  mask = new Mask(maskLayer.width/2, maskLayer.height/2, 600, 200);
  mask.display(maskLayer);
}

class Mask{
  constructor(startX, startY, maskSize, eyeSize){
    this.startX = startX;
    this.startY = startY;
    this.x = startX;
    this.y = startY;
    this.maskSize = maskSize;
    this.eyeSize = eyeSize;
    this.rotation = 0;
  }

  update(){
    // currentScrollingPosition [0, 1000]
    this.rotation = map(currentScrollingPosition, 0, 1000, 0, 30);
    this.y = map(currentScrollingPosition, 0, 1000, this.startY, 2 * height);
    this.x = map(currentScrollingPosition, 0, 1000, this.startX, this.startX + 50);
  }

  display(maskLayer){
    maskLayer.push();
    maskLayer.clear();
    maskLayer.translate(this.x, this.y);
    maskLayer.rotate(this.rotation);
    maskLayer.circle(0, 0, this.maskSize);
    maskLayer.erase();
    maskLayer.circle(-this.maskSize/4, -this.maskSize/8, this.eyeSize);
    maskLayer.circle(this.maskSize/4, -this.maskSize/8, this.eyeSize);
    maskLayer.noErase();
    maskLayer.pop();
  }

}
