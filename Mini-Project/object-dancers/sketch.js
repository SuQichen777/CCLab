/*
  Check our the GOAL and the RULES of this exercise at the bottom of this file.
  
  After that, follow these steps before you start coding:

  1. rename the dancer class to reflect your name (line 35).
  2. adjust line 20 to reflect your dancer's name, too.
  3. run the code and see if a square (your dancer) appears on the canvas.
  4. start coding your dancer inside the class that has been prepared for you.
  5. have fun.
*/

let dancer;

function setup() {
  // no adjustments in the setup function needed...
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");

  // ...except to adjust the dancer's name on the next line:
  dancer = new Lulu(width / 2, height / 2);
}

function draw() {
  // you don't need to make any adjustments inside the draw loop
  background(0);
  drawFloor(); // for reference only

  dancer.update();
  dancer.display();
}

// You only code inside this class.
// Start by giving the dancer your name, e.g. LeonDancer.
class Lulu {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.bodyColor = "yellow";
    this.orangeColor = "orange";
  }
  update() {
    // update properties here to achieve
    // your dancer's desired moves and behaviour
  }

  // Head

  drawOrange(orangePosX, orangePosY, orangeWidth, orangeHeight) {
    push();
    translate(orangePosX, orangePosY);
    fill(this.orangeColor);
    ellipse(0, 0, orangeWidth, orangeHeight);

    push();
    translate(0, -orangeHeight / 2);
    fill("brown");
    arc(0, 0, 2, 5, HALF_PI, 0, CHORD);
    pop();

    pop();
  }

  drawEyes(eyePosX, eyePosY, eyeRotation) {
    push();

    push();
    translate(-eyePosX, eyePosY);
    rotate(eyeRotation);
    fill("white");
    ellipse(0, 0, 15, 10);
    fill("black");
    circle(0.5, 1, 8);
    pop();

    push();
    translate(eyePosX, eyePosY);
    rotate(-eyeRotation);
    fill("white");
    ellipse(0, 0, 15, 10);
    fill("black");
    circle(-0.5, 1, 8);
    pop();

    pop();
  }

  drawEars(earPosX, earPosY, earRotation, earWidth, earHeight) {
    push();

    push();
    translate(-earPosX, earPosY);
    rotate(-earRotation);
    fill(this.bodyColor);
    ellipse(0, 0, earWidth, earHeight);
    pop();

    push();
    translate(earPosX, earPosY);
    rotate(earRotation);
    fill(this.bodyColor);
    ellipse(0, 0, earWidth, earHeight);
    pop();

    pop();
  }

  drawHead(headPosX, headPosY) {
    push();

    translate(headPosX, headPosY);
    fill(this.bodyColor);
    noStroke();
    ellipse(0, 0, 80, 66);

    // lower ellipse (nose and mouth)
    push();
    fill(this.orangeColor);
    translate(0, 13);
    ellipse(0, 0, 60, 40);
    pop();

    // eyes
    this.drawEyes(20, -10, PI / 15);

    // orange
    this.drawOrange(0, -37, 15, 12);

    // ears
    this.drawEars(30, -20, PI / 9, 10, 15);

    pop();
  }

  // Body

  drawArm(armPosX, armPosY, armRotation, armWidth, armHeight) {
    push();

    // left
    push();
    translate(-armPosX, armPosY);
    rotate(-armRotation);
    fill(this.bodyColor);
    ellipse(0, 0, armWidth, armHeight);
    pop();

    // right
    push();
    translate(armPosX, armPosY);
    rotate(armRotation);
    fill(this.bodyColor);
    ellipse(0, 0, armWidth, armHeight);
    pop();

    pop();
  }

  drawBody(bodyCenterX, bodyCenterY) {
    push();

    noStroke();
    rectMode(CENTER);
    translate(bodyCenterX, bodyCenterY);

    // arms
    this.drawArm(30, 0, -PI/12, 16, 36);

    // upper body
    fill(this.bodyColor);
    rect(0, 0, 60, 50);

    // pants and feet
    fill(this.orangeColor);

    // left
    push();
    translate(-20, 30);
    // foot
    fill(this.bodyColor);
    ellipse(0, 2, 20, 20);
    // pant left
    fill(this.orangeColor);
    rect(0, 0, 20, 10);
    pop();

    // right
    push();
    translate(20, 30);
    // foot
    fill(this.bodyColor);
    ellipse(0, 2, 20, 20);
    // pant right
    fill(this.orangeColor);
    rect(0, 0, 20, 10);
    pop();

    // center pant
    fill(this.orangeColor);
    rect(0, 20, 60, 20);

    pop();
  }

  drawDancer() {
    push();
    this.drawBody(0, -10);
    this.drawHead(0, -50);

    pop();
  }
  display() {
    // the push and pop, along with the translate
    // places your whole dancer object at this.x and this.y.
    // you may change its position on line 19 to see the effect.
    push();
    translate(this.x, this.y);

    // ******** //
    // ⬇️ draw your dancer from here ⬇️
    this.drawDancer();

    // ⬆️ draw your dancer above ⬆️
    // ******** //

    // the next function draws a SQUARE and CROSS
    // to indicate the approximate size and the center point
    // of your dancer.
    // it is using "this" because this function, too,
    // is a part if your Dancer object.
    // comment it out or delete it eventually.
    // this.drawReferenceShapes();

    pop();
  }
  drawReferenceShapes() {
    noFill();
    stroke(255, 0, 0);
    line(-5, 0, 5, 0);
    line(0, -5, 0, 5);
    stroke(255);
    rect(-100, -100, 200, 200);
    fill(255);
    stroke(0);
  }
}

/*
GOAL:
The goal is for you to write a class that produces a dancing being/creature/object/thing. In the next class, your dancer along with your peers' dancers will all dance in the same sketch that your instructor will put together. 

RULES:
For this to work you need to follow one rule: 
  - Only put relevant code into your dancer class; your dancer cannot depend on code outside of itself (like global variables or functions defined outside)
  - Your dancer must perform by means of the two essential methods: update and display. Don't add more methods that require to be called from outside (e.g. in the draw loop).
  - Your dancer will always be initialized receiving two arguments: 
    - startX (currently the horizontal center of the canvas)
    - startY (currently the vertical center of the canvas)
  beside these, please don't add more parameters into the constructor function 
  - lastly, to make sure our dancers will harmonize once on the same canvas, please don't make your dancer bigger than 200x200 pixels. 
*/
