function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent("canvasContainer")
}

function draw() {
  background(220);
  textSize(100);
  textAlign(CENTER);
  text("Screen Width:", width / 2, height / 2 - 100);
  text(width, width / 2, height / 2);
}
