let radius = 200;

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  cnv.parent("canvasContainer")
  background(0);
}

function draw() {

  //****** PART ONE ******//
  //Let's create different visuals with sin()/random()/noise()!
  let x = frameCount % width;
  let amp = 20;

  //1. sin() wave
  let y1 = sin(frameCount * 0.05) * amp;

  //2. random()
  let y2 = random(20); //0-20: 1,18

  //3. sin() + random()
  let y3 = y1 + y2;

  //4. noise(): 0.0 - 1.0
  let y4 = noise(frameCount * 0.05) * amp;
  // console.log(y4)

  //5. sin() + noise()
  let y5 = y1 + y4;

  noStroke();
  fill(255);
  ellipse(x, y1 + 50, 3);
  ellipse(x, y2 + 150, 3);
  ellipse(x, y3 + 250, 3);
  ellipse(x, y4 + 350, 3);
  ellipse(x, y5 + 450, 3);



  //****** PART TWO ******//
  //Let's draw a colorful flower!
  // let radius = 200;
  let angle = radians(frameCount);

  // let posX = radius * cos(angle) + noise(angle)*50;
  // let posY = radius * sin(angle) + noise(angle)*50;

  let posX = radius * cos(angle) * noise(angle);
  let posY = radius * sin(angle) * noise(angle);

  let r = map(cos(angle), -1, 1, 0, 255);
  let g = map(sin(angle), -1, 1, 0, 255);
  let b = map(noise(angle), 0, 1, 0, 255);

  push();
  translate(width / 2, height / 2);
  stroke(r, g, b, 200);
  line(0, 0, posX, posY);
  fill(r, g, b);
  noStroke();
  ellipse(posX, posY, 5);
  pop();

  radius = radius + 0.01;
}
