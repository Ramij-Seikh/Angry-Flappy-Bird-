const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const jumpButton = document.getElementById("jumpButton");
const restartButton = document.getElementById("restartButton");

canvas.width = 320;
canvas.height = 480;

// Load Images
const birdImg = new Image();
birdImg.src = "bird.png"; // Replace with the real bird image

const pipeTopImg = new Image();
pipeTopImg.src = "pipe_top.png"; // Replace with the real pipe top image

const pipeBottomImg = new Image();
pipeBottomImg.src = "pipe_bottom.png"; // Replace with the real pipe bottom image

// Game Variables
let birdX = 50;
let birdY = canvas.height / 2;
let birdSize = 34; // Adjusted to fit image size
let gravity = 0.48;
let lift = -9.2;
let velocity = 0;
let pipes = [];
let pipeWidth = 50;
let pipeGap = 150;
let pipeSpeed = 3.5;
let score = 0;
let gameOver = false;

// Event Listeners
document.addEventListener("keydown", () => {
    if (!gameOver) {
        jump();
    }
});

jumpButton.addEventListener("click", () => {
    if (!gameOver) {
        jump();
    }
});

restartButton.addEventListener("click", resetGame);

// Game Loop
function gameLoop() {
    if (!gameOver) {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    } else {
        showGameOver();
    }
}

// Update Game State
function update() {
    velocity += gravity;
    birdY += velocity;

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        addPipe();
    }

    for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= pipeSpeed;

        if (
            birdX + birdSize > pipes[i].x &&
            birdX < pipes[i].x + pipeWidth &&
            (birdY < pipes[i].top || birdY + birdSize > canvas.height - pipes[i].bottom)
        ) {
            gameOver = true;
        }

        if (pipes[i].x + pipeWidth < 0) {
            pipes.shift();
            score++;
        }
    }

    if (birdY + birdSize > canvas.height || birdY < 0) {
        gameOver = true;
    }
}

// Draw Game Elements
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Bird
    ctx.drawImage(birdImg, birdX, birdY, birdSize, birdSize);

    // Draw Pipes
    for (let i = 0; i < pipes.length; i++) {
        ctx.drawImage(pipeTopImg, pipes[i].x, 0, pipeWidth, pipes[i].top);
        ctx.drawImage(pipeBottomImg, pipes[i].x, canvas.height - pipes[i].bottom, pipeWidth, pipes[i].bottom);
    }

    // Draw Score
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 25);
}

// Show Game Over Screen
function showGameOver() {
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 70, canvas.height / 2 - 20);
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, canvas.width / 2 - 30, canvas.height / 2 + 20);
    jumpButton.style.display = "none";
    restartButton.style.display = "block";
}

// Add Pipes
function addPipe() {
    const topHeight = Math.floor(Math.random() * (canvas.height - pipeGap - 20)) + 10;
    const bottomHeight = canvas.height - pipeGap - topHeight;
    pipes.push({ x: canvas.width, top: topHeight, bottom: bottomHeight });
}

// Jump Function
function jump() {
    velocity = lift;
}

// Reset Game
function resetGame() {
    birdY = canvas.height / 2;
    velocity = 0;
    pipes = [];
    score = 0;
    gameOver = false;
    jumpButton.style.display = "block";
    restartButton.style.display = "none";
    gameLoop();
}

// Start the game
gameLoop();
