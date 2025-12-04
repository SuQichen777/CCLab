import { Line } from "./Line.js";
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

  updateSize(finalWidth, finalHeight, scene) {
    let scrollStart, scrollEnd;
    scrollStart = scenes[scene].start;
    scrollEnd = scenes[scene].end;
    let newWidth = map(
      currentScrollingPosition,
      scrollStart,
      scrollEnd,
      this.originalWidth,
      finalWidth
    );
    let newHeight = map(
      currentScrollingPosition,
      scrollStart,
      scrollEnd,
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

  updateTransparency(scene) {
    let scrollStart, scrollEnd;
    scrollStart = scenes[scene].start;
    scrollEnd = scenes[scene].end;
    let newTransparency = map(
      currentScrollingPosition,
      scrollStart,
      scrollEnd,
      20,
      255
    );
    this.topLine.lineColor.setAlpha(newTransparency);
    this.rightLine.lineColor.setAlpha(newTransparency);
    this.bottomLine.lineColor.setAlpha(newTransparency);
    this.leftLine.lineColor.setAlpha(newTransparency);
  }

  updatePosition(newCenterX, newCenterY, scene) {
    let scrollStart, scrollEnd;
    scrollStart = scenes[scene].start;
    scrollEnd = scenes[scene].end;
    let mappedCenterX = map(
      currentScrollingPosition,
      scrollStart,
      scrollEnd,
      this.originalCenterX,
      newCenterX
    );
    let mappedCenterY = map(
      currentScrollingPosition,
      scrollStart,
      scrollEnd,
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
