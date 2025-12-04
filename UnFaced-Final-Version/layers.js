import { Mask } from "./classes/Mask.js";
import { Hand } from "./classes/Hand.js";
import { Line } from "./classes/Line.js";
import { RectangleWithLine } from "./classes/RectangleWithLine.js";

export let maskLayer, envLayer, handLayer;
export let s1NoisyRect,
  s1WallLineUpLeft,
  s1WallLineUpRight,
  s1WallLineDownLeft,
  s1WallLineDownRight;
export let s3Door, s3DoorOffsetRatioX, s3DoorOffsetRatioY;
export let mask;
export let leftHand;

export function createLayers(mainWidth, mainHeight) {
  maskLayer = createGraphics(mainWidth, mainHeight);
  envLayer = createGraphics(mainWidth, mainHeight);
  handLayer = createGraphics(mainWidth / 2, mainHeight / 2);
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
  let s1RoomWidth = 100;
  let s1RoomHeight = 67;
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
  let s3DoorWidth = 22;
  let s3DoorHeight = 44;
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

  let s1WallUpLeftX = 50;
  let s1WallUpRightX = 450;
  let s1WallDownLeftX = 50;
  let s1WallDownRightX = 450;
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
  mask = new Mask(maskLayer.width / 2, maskLayer.height / 2, 600, 200);
  mask.display(maskLayer);
}
