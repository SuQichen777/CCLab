// CCLab Mini Project - 9.R Particle World Template

let NUM_OF_PARTICLES = 30; // Decide the initial number of particles.
let MAX_OF_PARTICLES = 500; // Decide the maximum number of particles.
let fishBodyWidth = 10;
let fishBodyHeight = 20;

let particles = [];

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");
  particles.push(
    new Particle(
      width / 2,
      (3 * height) / 4,
      fishBodyWidth * 2,
      fishBodyHeight * 2,
      true
    )
  );
  // generate particles
  for (let i = 0; i < NUM_OF_PARTICLES - 1; i++) {
    particles.push(
      new Particle(random(width), random(height), fishBodyWidth, fishBodyHeight)
    );
  }
}

function draw() {
  background(50);

  // consider generating particles in draw(), using Dynamic Array

  // update and display
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    p.update();
    p.display();
  }

  // limit the number of particles
  if (particles.length > MAX_OF_PARTICLES) {
    particles.splice(0, 1); // remove the first (oldest) particle
  }
}

class Particle {
  // constructor function
  constructor(
    startX,
    startY,
    particleWidth,
    particleHeight,
    isMainParticle = false
  ) {
    // properties (variables): particle's characteristics
    this.x = startX;
    this.y = startY;
    this.xSpd = 0;
    this.ySpd = random(-1, -2);
    this.width = particleWidth;
    this.height = particleHeight;
    this.eyeColor = color(0);
    this.bodyColor = color("pink");
    this.tailColor = color(255, 100);
    this.isMainParticle = isMainParticle;
  }
  // methods (functions): particle's behaviors
  update() {
    if (!this.isMainParticle) {
      // (add)
      this.y += this.ySpd;
    } else {
      // Gradually shift body color from red to pink based on vertical position
      let lerpAmount = map(sin(frameCount * 0.02), -1, 1, 0, 0.8);
      this.bodyColor = lerpColor(color("red"), color("pink"), lerpAmount);
      if (keyIsPressed && key == "w") {
        particles.push(
          new Particle(
            random(width),
            random(height),
            fishBodyWidth,
            fishBodyHeight
          )
        );
        this.y += this.ySpd;
      }
      if (keyIsPressed && key == "a") {
        this.x -= 1;
      }
      if (keyIsPressed && key == "d") {
        this.x += 1;
      }
    }

    this.x += this.xSpd;
    // simulate a fish swimming left and right
    this.xSpd = sin(frameCount * 0.02 + this.y * 0.01) * 0.4;
  }
  display() {
    // particle's appearance
    push();
    translate(this.x, this.y);
    noStroke();
    // main body
    fill(this.bodyColor);
    ellipse(0, 0, this.width, this.height);
    // eyes
    fill(this.eyeColor);
    circle(0, -this.height / 4, this.width / 4);
    // tail
    // tail – a semi-circle
    fill(this.tailColor);
    arc(0, this.height, this.width, this.height, PI, TWO_PI);

    pop();
  }
}
