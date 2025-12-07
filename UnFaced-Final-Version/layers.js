import { Mask } from "./classes/Mask.js";
import { Hand } from "./classes/Hand.js";
import { Line } from "./classes/Line.js";
import { RectangleWithLine } from "./classes/RectangleWithLine.js";
import { Wall } from "./classes/Wall.js";
import { Player, Enemy } from "./classes/Character.js";

export let maskLayer, envLayer, handLayer, labyrinthLayer;
export let s1NoisyRect,
  s1WallLineUpLeft,
  s1WallLineUpRight,
  s1WallLineDownLeft,
  s1WallLineDownRight;
export let s3Door, s3DoorOffsetRatioX, s3DoorOffsetRatioY;
export let mask;
export let leftHand;
export let characterMe, characterWe, characterWe2, labyrinthWalls = [];

export function createLayers(mainWidth, mainHeight) {
  maskLayer = createGraphics(mainWidth, mainHeight);
  envLayer = createGraphics(mainWidth, mainHeight);
  handLayer = createGraphics(mainWidth / 2, mainHeight / 2);
  labyrinthLayer = createGraphics(mainWidth, mainHeight);
}

export function handLayerInitialize() {
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

export function envLayerInitialize() {
  envLayer.background(255);
  let s1RoomCenterX = width / 2;
  let s1RoomCenterY = height / 3;
  let s1RoomWidth = (100 / 500) * width;
  let s1RoomHeight = (67 / 300) * height;
  s1NoisyRect = new RectangleWithLine(
    s1RoomCenterX,
    s1RoomCenterY,
    s1RoomWidth,
    s1RoomHeight,
    color(0),
    10
  );
  s3DoorOffsetRatioX = 20 / 225;
  s3DoorOffsetRatioY = 20 / 150;
  let s3DoorOffsetX = s1RoomWidth * s3DoorOffsetRatioX;
  let s3DoorOffsetY = s1RoomHeight * s3DoorOffsetRatioY;
  let s3DoorWidth = (22 / 500) * width;
  let s3DoorHeight = (44 / 300) * height;
  s3Door = new RectangleWithLine(
    s1RoomCenterX + s3DoorOffsetX,
    s1RoomCenterY + s3DoorOffsetY,
    s3DoorWidth,
    s3DoorHeight,
    color(0, 0, 0, 20),
    10
  );
  s3Door.display(envLayer);
  s1NoisyRect.display(envLayer);

  let s1WallUpLeftX = (50 / 500) * width;
  let s1WallUpRightX = (450 / 500) * width;
  let s1WallDownLeftX = (50 / 500) * width;
  let s1WallDownRightX = (450 / 500) * width;
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

export function maskLayerInitialize() {
  maskLayer.noStroke();
  maskLayer.angleMode(DEGREES);
  mask = new Mask(
    maskLayer.width / 2,
    maskLayer.height / 2,
    (600 / 500) * width,
    (200 / 300) * height
  );
  mask.display(maskLayer);
}

export function labyrinthLayerInitialize() {
  labyrinthLayer.background(255);
  labyrinthWalls = [];
  let rowHeight = 50;
  let rows = [
    // row 0
    [
      [0, 900],
      [950, 50],
    ],
    // row 1
    [
      [0, 50],
      [950, 50],
    ],
    // row 2
    [
      [0, 50],
      [100, 900],
    ],
    // row 3
    [
      [0, 50],
      [950, 50],
    ],
    // row 4
    [
      [0, 580],
      [630, 270],
      [950, 50],
    ],
    // row 5
    [
      [0, 50],
      [950, 50],
    ],
    // row 6
    [
      [0, 50],
      [100, 900],
    ],
    // row 7
    [
      [0, 50],
      [950, 50],
    ],
    // row 8
    [
      [0, 750],
      [800, 100],
      [950, 50],
    ],
    // row 9
    [
      [0, 50],
      [950, 50],
    ],
    // row 10
    [
      [0, 50],
      [100, 1000],
    ],
  ];
  for (let r = 0; r < rows.length; r++) {
    let y = r * rowHeight;
    for (let segment of rows[r]) {
      const left = segment[0];
      const w = segment[1];

      const topRightX = left + w;
      const topRightY = y;
      const h = rowHeight;

      labyrinthWalls.push(new Wall(topRightX, topRightY, w, h, color(0)));
    }
  }
  characterMe = new Player(75, 525);
  for (let i = 0; i < labyrinthWalls.length; i++) {
    labyrinthWalls[i].display(labyrinthLayer);
  }
  characterWe = new Enemy(75, 175);
  characterWe2 = new Enemy(775, 375);
  characterMe.display(labyrinthLayer);
  characterWe.display(labyrinthLayer);
  characterWe2.display(labyrinthLayer);
};
