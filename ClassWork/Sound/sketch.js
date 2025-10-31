let speedX;
let x;

function preload(){
  mySound = loadSound("beat.mp3")
}
function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
  x = 25;
  speedX = 5;
}

function draw() {
  background(220);
  circle(x, height/2, 50);
  x += speedX;
  if (x < 25 || x > width - 25){
    speedX *= -1;
    mySound.play();
  }
}