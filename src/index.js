const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const blockSize = 20;
const widthInBlocks = canvasWidth / blockSize;
const heightInBlocks = canvasHeight / blockSize;

let framerate = 100;

let isGamePaused = false;
let isGameOver = false;

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

  checkPosition(otherBlock) {
    return this.posX === otherBlock.posX && this.posY === otherBlock.posY;
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

    // collision check
    if (this.checkSelfCollision(newHead) || Snake.checkWallCollision(newHead)) {
      isGameOver = true;
    }

    this.segments.unshift(newHead);

    // here will be apple eating code
    this.segments.pop();
  }

  checkSelfCollision(obj) {
    const selfCollision = this.segments.some(elem => elem.checkPosition(obj));

    return selfCollision;
  }

  static checkWallCollision(obj) {
    const wallCollision = obj.posX === 0 || obj.posY === 0 ||
      obj.posX === widthInBlocks - 1 || obj.posY === heightInBlocks - 1;

    return wallCollision;
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

  static displayMiddleScreenMsg(header, msg, headerColor = 'red', msgColor = 'white') {
    ctx.fillStyle = headerColor;
    ctx.font = '60px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(header, canvasWidth / 2, canvasHeight / 2);
    ctx.fillStyle = msgColor;
    ctx.font = '20px Arial';
    ctx.fillText(msg, canvasWidth / 2, (canvasHeight / 2) + 50);
  }

  static pauseOrRestart(gameFn) {
    if (isGameOver) {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      window.location.reload();
    } else if (!isGamePaused) {
      isGamePaused = true;
      GameFunctions.displayMiddleScreenMsg('Game Paused', 'Press Space to resume');
    } else {
      isGamePaused = false;
      gameFn();
    }
  }
}

const snake = new Snake(5, 5, 10, 'darkgreen');

function gameLoop() {
  if (isGamePaused) return;
  if (isGameOver) {
    GameFunctions.displayMiddleScreenMsg('You Died', 'Press Space to restart');
    return;
  }
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

  if (e.keyCode === 32) {
    GameFunctions.pauseOrRestart(gameLoop);
  }
}

window.addEventListener('keydown', handleKeys, true);
