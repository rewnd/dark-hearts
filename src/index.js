const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const blockSize = 20;
const widthInBlocks = canvasWidth / blockSize;
const heightInBlocks = canvasHeight / blockSize;

let framerate = 100;

class Block {
  constructor(posX, posY, color, strokeColor = 'lightgray') {
    this.posX = posX;
    this.posY = posY;
    this.color = color;
    this.strokeColor = strokeColor;
  }

  draw() {
    const x = this.posX * blockSize;
    const y = this.posY * blockSize;
    ctx.fillStyle = this.color;
    ctx.fillRect(x, y, blockSize, blockSize);
    ctx.strokeStyle = this.strokeColor;
    ctx.strokeRect(x, y, blockSize, blockSize);
  }
}

class Wall {
  constructor() {
    this.wallArray = [];
  }

  draw(position, offset, start, end, color) {
    let i = start;

    if (position === 'vertical') {
      while (i <= end) {
        this.wallArray.push(new Block(i, offset, color));
        i += 1;
      }
    } else if (position === 'horizontal') {
      while (i <= end) {
        this.wallArray.push(new Block(offset, i, color));
        i += 1;
      }
    }

    this.wallArray.forEach(elem => elem.draw());
  }
}

class GameFunctions {
  static drawBG() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  static drawBorderWalls(color, strokeColor) {
    const wall = new Wall();
    wall.draw('horizontal', 0, 1, widthInBlocks, color, strokeColor);
    wall.draw('vertical', widthInBlocks - 1, 1, heightInBlocks, color, strokeColor);
    wall.draw('horizontal', heightInBlocks - 1, 0, widthInBlocks - 1, color, strokeColor);
    wall.draw('vertical', 0, 0, heightInBlocks - 1, color, strokeColor);
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  GameFunctions.drawBG();
  GameFunctions.drawBorderWalls('red');

  setTimeout(gameLoop, framerate);
}

gameLoop();
