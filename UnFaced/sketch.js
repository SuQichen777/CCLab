let particles = [];
let rainDrops = [];
let NUM_OF_PARTICLES = 400;
let NUM_OF_RAIN = 50;

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
  angleMode(DEGREES);
  noStroke();

  for (let i = 0; i < NUM_OF_PARTICLES; i++) {
    particles.push(new Leaf());
  }
  for (let i = 0; i < NUM_OF_RAIN; i++) {
    rainDrops.push(new RainDrop());
  }
}

function draw() {
  console.log(particles.length);
  background(20, 40, 60);
  noStroke();
  // iterate backwards to safely remove while looping
  for (let i = particles.length - 1; i >= 0; i--) {
    let l = particles[i];
    let d = dist(mouseX, mouseY, l.x, l.y);
    let windRadius = 35;
    // if the distance of the mouse and the leaf
    // is close enough
    // then "blow" the leaf by mouse wind
    if (d < windRadius) {
      let windX = (mouseX - pmouseX) * 0.1;
      let windY = (mouseY - pmouseY) * 0.1;
      l.applyWind(windX, windY);
    }
    for (let j = 0; j < NUM_OF_RAIN; j++) {
      let r = rainDrops[j];
      let rainDist = dist(l.x, l.y, r.x, r.y);
      if (rainDist < l.size) {
        // the leaf is hit by the rain
        l.applyWind(0, r.ySpeed * 0.05);
      }
    }
    l.update();
    l.display();
    l.checkBounds();
    // remove if marked invisible (fallen off bottom)
    if (!l.isVisible) {
      particles.splice(i, 1);
      particles.push(new Leaf());
    }
  }

  strokeWeight(2);
  for (let r of rainDrops) {
    r.update();
    r.display();
  }
}

class Leaf {
  constructor(
    startX = random(width),
    startY = random(-height, 0),
    size = random(10, 20),
    ySpeed = random(1, 3)
  ) {
    this.x = startX;
    this.y = startY;
    this.size = size;

    this.ySpeed = ySpeed;
    this.xSpeed = 0;
    this.yBoost = 0; // wind

    this.flutterSpeed = random(0.3, 0.8);
    this.angle = random(360);
    this.rotationSpeed = random(-2, 2);
    this.color = color(
      random(140, 220),
      random(50, 120),
      random(20, 40),
      random(120, 200)
    );
    this.isVisible = true; // flag for removal
  }

  // take force from x and y
  applyWind(forceX, forceY) {
    this.xSpeed += forceX;
    this.yBoost += forceY;
  }

  update() {
    // this.ySpeed is gravity
    // this.yBoost is wind force
    this.y += this.ySpeed + this.yBoost;

    // this.xSpeed is wind force
    let flutter = sin(this.angle * this.flutterSpeed) * 0.5;
    this.x += this.xSpeed + flutter;

    // spinning
    this.angle += this.rotationSpeed;
    this.xSpeed *= 0.95;
    this.yBoost *= 0.95;
  }

  display() {
    if (!this.isVisible) return;
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    fill(this.color);
    ellipse(0, 0, this.size, this.size * 0.6);
    pop();
  }

  checkBounds() {
    // if fallen off bottom, mark for removal
    if (this.y > height + this.size) {
      this.isVisible = false;
      return;
    }

    // allow continuous falling for left or right overflow
    // and appear from the other side
    if (this.x > width + this.size) {
      this.x = -this.size;
    } else if (this.x < -this.size) {
      this.x = width + this.size;
    }

    // allow continuous falling for top overflow
    if (this.y < -this.size) {
      // keep falling from top
      this.ySpeed = random(1, 3);
      this.yBoost = 0;
    }
  }
}

class RainDrop {
  constructor() {
    this.x = random(width);
    this.y = random(-200, -100);
    this.length = random(10, 20);
    this.ySpeed = random(6, 12);
    this.color = color(180, 200, 255, random(100,200));
  }

  update() {
    this.y += this.ySpeed;
    this.checkBounds();
  }

  display() {
    strokeWeight(2);
    stroke(this.color);
    line(this.x, this.y, this.x, this.y + this.length);
  }

  checkBounds() {
    if (this.y > height) {
      this.y = random(-200, -100); // get back to top
      this.x = random(width);
    }
  }
}
