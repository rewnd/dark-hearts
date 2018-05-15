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

class Snake {
  constructor(startPosX, startPosY, length, snakeColor, snakeStrokeColor) {
    this.segments = [];

    for (let i = length; i > 0; i--) {
      this.segments.push(new Block(startPosX + i, startPosY, snakeColor, snakeStrokeColor));
    }

    this.color = snakeColor;
    this.direction = 'right';
    this.nextDirection = 'right';
  }

  draw() {
    this.segments.forEach(elem => elem.draw());
  }

  setDirection(newDirection) {
    if (newDirection === 'left' && this.direction === 'right') {
      return;
    } else if (newDirection === 'right' && this.direction === 'left') {
      return;
    } else if (newDirection === 'up' && this.direction === 'down') {
      return;
    } else if (newDirection === 'down' && this.direction === 'up') {
      return;
    }

    this.nextDirection = newDirection;
  }

  move() {
    const snakeHead = this.segments[0];
    let newHead;

    this.direction = this.nextDirection;

    switch (this.direction) {
      case 'left':
        newHead = new Block(snakeHead.posX - 1, snakeHead.posY, this.color);
        break;
      case 'right':
        newHead = new Block(snakeHead.posX + 1, snakeHead.posY, this.color);
        break;
      case 'up':
        newHead = new Block(snakeHead.posX, snakeHead.posY - 1, this.color);
        break;
      case 'down':
        newHead = new Block(snakeHead.posX, snakeHead.posY + 1, this.color);
        break;
      default:
        break;
    }

    this.segments.unshift(newHead);

    // here will be apple eating code
    this.segments.pop();
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

const snake = new Snake(5, 5, 3, 'darkgreen');

function gameLoop() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  GameFunctions.drawBG();
  snake.move();
  snake.draw();
  GameFunctions.drawBorderWalls('red');
  setTimeout(gameLoop, framerate);
}

gameLoop();

// controls
const directionCodes = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
};

function handleKeys(e) {
  const newDirection = directionCodes[e.keyCode];

  if (newDirection !== undefined) {
    snake.setDirection(newDirection);
  }
}

window.addEventListener('keydown', handleKeys, true);
