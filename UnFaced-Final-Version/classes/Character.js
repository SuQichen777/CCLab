// For Chapter 2 : Escape
// Base character + Player/Enemy subclasses (Enemy uses image).

import { Wall } from "./Wall.js";

class BaseCharacter {
  constructor(x, y, radius = 10, speed = 2) {
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;
    this.radius = radius;
    this.speed = speed;
  }

  reset() {
    this.x = this.startX;
    this.y = this.startY;
  }

  collidesWith(other) {
    // calculate if the character collide with another character
    let dx = this.x - other.x;
    let dy = this.y - other.y;
    let rSum = this.radius + other.radius;
    return dx * dx + dy * dy <= rSum * rSum;
  }

  update(dx, dy, walls = []) {
    let stepX = dx * this.speed;
    let stepY = dy * this.speed;

    this.x += stepX;
    if (this.hitsAnyWall(walls)) {
      this.x -= stepX;
    }

    this.y += stepY;
    if (this.hitsAnyWall(walls)) {
      this.y -= stepY;
    }
  }

  hitsAnyWall(walls) {
    for (let wall of walls) {
      if (this.circleIntersectsWall(wall)) return true;
    }
    return false;
  }

  circleIntersectsWall(wall) {
    let { left, right, top, bottom } = wall.getBounds();
    let closestX = constrain(this.x, left, right);
    let closestY = constrain(this.y, top, bottom);
    let dx = this.x - closestX;
    let dy = this.y - closestY;
    return dx * dx + dy * dy <= this.radius * this.radius;
  }
}

export class Player extends BaseCharacter {
  constructor(x, y, radius = 10, speed = 2, fillColor = color(255,0,0)) {
    super(x, y, radius, speed);
    this.fillColor = fillColor;
  }

  display(layer) {
    layer.push();
    layer.noStroke();
    layer.fill(this.fillColor);
    layer.circle(this.x, this.y, this.radius * 2);
    layer.pop();
  }
}

export class Enemy extends BaseCharacter {
  constructor(
    x,
    y,
    radius = 20,
    speed = 2,
    imgOrPath = "./assets/Ch2-Escape/We.png"
  ) {
    super(x, y, radius, speed);
    this.img = null;
    if (typeof imgOrPath === "string") {
      this.img = loadImage(imgOrPath);
    } else {
      this.img = imgOrPath;
    }
  }

  display(layer) {
    if (!this.img) {
      layer.push();
      layer.noStroke();
      layer.fill(255, 0, 0);
      layer.square(this.x - this.radius, this.y - this.radius, this.radius * 2);
      layer.pop();
      return;
    }
    layer.imageMode(CENTER);
    layer.image(this.img, this.x, this.y, this.radius * 2, this.radius * 2);
  }
}

export function handlePlayerEnemyCollision(player, enemy, onResetChapter2) {
  if (player.collidesWith(enemy)) {
    player.reset();
    enemy.reset();
    if (typeof onResetChapter2 === "function") {
      onResetChapter2();
    }
  }
}
