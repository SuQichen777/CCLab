import { Line } from "./Line.js";
import { state } from "../state.js";
import { sceneBounds } from "../constants.js";

export class RectangleWithLine {
  constructor(centerX, centerY, width, height, color, noiseStrength = 30) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.width = width;
    this.height = height;
    this.originalCenterX = centerX;
    this.originalCenterY = centerY;
    this.originalWidth = width;
    this.originalHeight = height;
    this.color = color;
    this.noiseStrength = noiseStrength;
    this.topLine = new Line(
      centerX - width / 2,
      centerY - height / 2,
      centerX + width / 2,
      centerY - height / 2,
      color,
      noiseStrength
    );
    this.rightLine = new Line(
      centerX + width / 2,
      centerY - height / 2,
      centerX + width / 2,
      centerY + height / 2,
      color,
      noiseStrength
    );
    this.bottomLine = new Line(
      centerX - width / 2,
      centerY + height / 2,
      centerX + width / 2,
      centerY + height / 2,
      color,
      noiseStrength
    );
    this.leftLine = new Line(
      centerX - width / 2,
      centerY - height / 2,
      centerX - width / 2,
      centerY + height / 2,
      color,
      noiseStrength
    );
  }

  updateSize(finalWidth, finalHeight, sceneIndex) {
    let scene = sceneBounds[sceneIndex];
    if (!scene) return;
    let newWidth = map(
      state.currentScrollingPosition,
      scene.start,
      scene.end,
      this.originalWidth,
      finalWidth
    );
    let newHeight = map(
      state.currentScrollingPosition,
      scene.start,
      scene.end,
      this.originalHeight,
      finalHeight
    );
    this.width = newWidth;
    this.height = newHeight;
    this.topLine.startX = this.centerX - newWidth / 2;
    this.topLine.endX = this.centerX + newWidth / 2;
    this.topLine.startY = this.centerY - newHeight / 2;
    this.topLine.endY = this.centerY - newHeight / 2;

    this.rightLine.startX = this.centerX + newWidth / 2;
    this.rightLine.endX = this.centerX + newWidth / 2;
    this.rightLine.startY = this.centerY - newHeight / 2;
    this.rightLine.endY = this.centerY + newHeight / 2;

    this.leftLine.startX = this.centerX - newWidth / 2;
    this.leftLine.endX = this.centerX - newWidth / 2;
    this.leftLine.startY = this.centerY - newHeight / 2;
    this.leftLine.endY = this.centerY + newHeight / 2;

    this.bottomLine.startX = this.centerX - newWidth / 2;
    this.bottomLine.endX = this.centerX + newWidth / 2;
    this.bottomLine.startY = this.centerY + newHeight / 2;
    this.bottomLine.endY = this.centerY + newHeight / 2;
  }

  updateTransparency(sceneIndex) {
    let scene = sceneBounds[sceneIndex];
    if (!scene) return;
    let newTransparency = map(
      state.currentScrollingPosition,
      scene.start,
      scene.end,
      20,
      255
    );
    this.topLine.lineColor.setAlpha(newTransparency);
    this.rightLine.lineColor.setAlpha(newTransparency);
    this.bottomLine.lineColor.setAlpha(newTransparency);
    this.leftLine.lineColor.setAlpha(newTransparency);
  }

  updatePosition(newCenterX, newCenterY, sceneIndex) {
    let scene = sceneBounds[sceneIndex];
    if (!scene) return;
    let mappedCenterX = map(
      state.currentScrollingPosition,
      scene.start,
      scene.end,
      this.originalCenterX,
      newCenterX
    );
    let mappedCenterY = map(
      state.currentScrollingPosition,
      scene.start,
      scene.end,
      this.originalCenterY,
      newCenterY
    );

    this.centerX = mappedCenterX;
    this.centerY = mappedCenterY;

    let halfW = this.width / 2;
    let halfH = this.height / 2;

    this.topLine.startX = mappedCenterX - halfW;
    this.topLine.endX = mappedCenterX + halfW;
    this.topLine.startY = mappedCenterY - halfH;
    this.topLine.endY = mappedCenterY - halfH;

    this.rightLine.startX = mappedCenterX + halfW;
    this.rightLine.endX = mappedCenterX + halfW;
    this.rightLine.startY = mappedCenterY - halfH;
    this.rightLine.endY = mappedCenterY + halfH;

    this.leftLine.startX = mappedCenterX - halfW;
    this.leftLine.endX = mappedCenterX - halfW;
    this.leftLine.startY = mappedCenterY - halfH;
    this.leftLine.endY = mappedCenterY + halfH;

    this.bottomLine.startX = mappedCenterX - halfW;
    this.bottomLine.endX = mappedCenterX + halfW;
    this.bottomLine.startY = mappedCenterY + halfH;
    this.bottomLine.endY = mappedCenterY + halfH;
  }

  display(layer) {
    this.topLine.display(layer);
    this.rightLine.display(layer);
    this.bottomLine.display(layer);
    this.leftLine.display(layer);
  }
}
