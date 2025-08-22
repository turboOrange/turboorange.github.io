const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Game settings
const paddleWidth = 12;
const paddleHeight = 80;
const ballSize = 14;

let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
let rightPaddleY = canvas.height / 2 - paddleHeight / 2;

const leftPaddleX = 16;
const rightPaddleX = canvas.width - paddleWidth - 16;

let ballX = canvas.width / 2 - ballSize / 2;
let ballY = canvas.height / 2 - ballSize / 2;
let ballVX = Math.random() < 0.5 ? 4 : -4;
let ballVY = (Math.random() - 0.5) * 6;

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawBall(x, y, size, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();
}

function resetBall() {
  ballX = canvas.width / 2 - ballSize / 2;
  ballY = canvas.height / 2 - ballSize / 2;
  ballVX = Math.random() < 0.5 ? 4 : -4;
  ballVY = (Math.random() - 0.5) * 6;
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

// Mouse controls for left paddle
canvas.addEventListener('mousemove', function(e) {
  const rect = canvas.getBoundingClientRect();
  let mouseY = e.clientY - rect.top;
  leftPaddleY = clamp(mouseY - paddleHeight / 2, 0, canvas.height - paddleHeight);
});

// AI for right paddle
function moveAIPaddle() {
  // Follow the ball with some smoothing
  const centerY = rightPaddleY + paddleHeight / 2;
  if (centerY < ballY) {
    rightPaddleY += 4;
  } else if (centerY > ballY) {
    rightPaddleY -= 4;
  }
  rightPaddleY = clamp(rightPaddleY, 0, canvas.height - paddleHeight);
}

function checkCollision() {
  // Top & bottom wall
  if (ballY <= 0 || ballY + ballSize >= canvas.height) {
    ballVY *= -1;
  }

  // Left paddle collision
  if (
    ballX <= leftPaddleX + paddleWidth &&
    ballY + ballSize >= leftPaddleY &&
    ballY <= leftPaddleY + paddleHeight &&
    ballX >= leftPaddleX
  ) {
    ballVX = Math.abs(ballVX);
    // Add spin based on where ball hit the paddle
    ballVY += (ballY + ballSize / 2 - (leftPaddleY + paddleHeight / 2)) * 0.12;
  }

  // Right paddle collision
  if (
    ballX + ballSize >= rightPaddleX &&
    ballY + ballSize >= rightPaddleY &&
    ballY <= rightPaddleY + paddleHeight &&
    ballX + ballSize <= rightPaddleX + paddleWidth + ballSize
  ) {
    ballVX = -Math.abs(ballVX);
    ballVY += (ballY + ballSize / 2 - (rightPaddleY + paddleHeight / 2)) * 0.12;
  }

  // Score left or right
  if (ballX < 0 || ballX + ballSize > canvas.width) {
    resetBall();
  }
}

function draw() {
  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Net
  for (let i = 0; i < canvas.height; i += 32) {
    drawRect(canvas.width / 2 - 2, i, 4, 18, "#888");
  }

  // Paddles
  drawRect(leftPaddleX, leftPaddleY, paddleWidth, paddleHeight, "#fafafa");
  drawRect(rightPaddleX, rightPaddleY, paddleWidth, paddleHeight, "#fafafa");

  // Ball
  drawBall(ballX, ballY, ballSize, "#f8d90f");
}

function update() {
  ballX += ballVX;
  ballY += ballVY;

  moveAIPaddle();
  checkCollision();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();