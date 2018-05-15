const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const blockSize = 20;
const widthInBlocks = canvasWidth / blockSize;
const heightInBlocks = canvasHeight / blockSize;

let framerate = 130;
let score = 0;

let isGamePaused = true;
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

class Heart extends Block {
  draw() {
    const x = (this.posX * blockSize) + (blockSize / 10);
    const y = (this.posY * blockSize) - (blockSize / 10);
    ctx.fillStyle = this.color;
    ctx.font = `${blockSize * 1.2}px OptimusPrinceps`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('♥', x, y);
  }

  static getRandomPosition() {
    const positionObj = {};

    positionObj.posX = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
    positionObj.posY = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;

    return positionObj;
  }

  move(obj) {
    this.posX = obj.posX;
    this.posY = obj.posY;
  }
}

class Snake {
  constructor(startPosX, startPosY, length, snakeColor, snakeStrokeColor, heartObj) {
    this.segments = [];

    for (let i = length; i > 0; i--) {
      this.segments.push(new Block(startPosX + i, startPosY, snakeColor, snakeStrokeColor));
    }

    this.heart = heartObj;
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

    if (newHead.checkPosition(this.heart)) {
      this.eatHeart();
    } else {
      this.segments.pop();
    }
  }

  // TODO: think about moving this to GameFunctions class
  eatHeart() {
    score += 1;

    framerate = GameFunctions.setFramerate(score, framerate);
    const newHeartPosition = Heart.getRandomPosition();
    if (this.checkSelfCollision(newHeartPosition)) {
      this.eatHeart();
    } else {
      this.heart.move(newHeartPosition);
    }
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

  static drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px OptimusPrinceps';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(`Score: ${score}`, 45, 45);
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
    ctx.font = '60px OptimusPrinceps';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(header, canvasWidth / 2, canvasHeight / 2);
    ctx.fillStyle = msgColor;
    ctx.font = '20px OptimusPrinceps';
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

  static setFramerate(gameScore, gameFramerate) {
    if (gameFramerate < 61) {
      return gameFramerate;
    }
    if (score < 25) {
      return gameFramerate - 2;
    } else if (score > 25) {
      return gameFramerate - 1;
    }

    return gameFramerate;
  }
}

const heart = new Heart(15, 15, 'red');
const snake = new Snake(5, 5, 10, 'darkgreen', 'white', heart);

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
  heart.draw();
  GameFunctions.drawScore();
  GameFunctions.drawBorderWalls('red');
  setTimeout(gameLoop, framerate);
}

// loading font, then starting game
document.fonts.load('10pt "OptimusPrinceps"').then(() => {
  GameFunctions.displayMiddleScreenMsg('Dark Hearts', 'Press Space to start game Edition');
});

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
