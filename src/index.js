const canvas = document.getElementById('main-canvas');
const ctx = canvas.getContext('2d');

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

let framerate = 100;

class GameFunctions {
  static drawBG() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  GameFunctions.drawBG();

  setTimeout(gameLoop, framerate);
}

gameLoop();
