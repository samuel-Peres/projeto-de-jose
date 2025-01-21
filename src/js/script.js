const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gameOver = document.getElementById("GameOver");
const startButton = document.getElementById("startButton");
const scoreDisplay = document.getElementById("scoreDisplay");

const boxSize = 20;
const canvasSize = canvas.width;
let snake = [{ x: boxSize * 11, y: boxSize * 6 }];
let food = { x: getRandomPosition(), y: getRandomPosition() };
let direction = "RIGHT";
let pontuação = 0;
let gameInterval;

// Esconder elementos desnecessários antes do jogo começar
canvas.style.display = "none";

// Função para gerar posição aleatória
function getRandomPosition() {
    return Math.floor(Math.random() * (canvasSize / boxSize)) * boxSize;
}

// Controle da cobra
document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    if (event.key === "w" && direction !== "DOWN") direction = "UP";
    if (event.key === "s" && direction !== "UP") direction = "DOWN";
    if (event.key === "a" && direction !== "RIGHT") direction = "LEFT";
    if (event.key === "d" && direction !== "LEFT") direction = "RIGHT";
}

// Função para desenhar a cobra
function drawSnake() {
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "lime" : "green";
        ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
    });
}

// Função para desenhar a comida
function drawFood() {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, boxSize, boxSize);
}

// Atualizar a posição da cobra
function updateSnake() {
    const head = { ...snake[0] };

    if (direction === "UP") head.y -= boxSize;
    if (direction === "DOWN") head.y += boxSize;
    if (direction === "LEFT") head.x -= boxSize;
    if (direction === "RIGHT") head.x += boxSize;

    snake.unshift(head);

    // Verificar se a cobra comeu a comida
    if (head.x === food.x && head.y === food.y) {
        pontuação++;
        food = { x: getRandomPosition(), y: getRandomPosition() };
        scoreDisplay.innerText = `Pontuação: ${pontuação}`;
    } else {
        snake.pop(); // Remover o último segmento
    }
}

// Verificar colisões
function checkCollision() {
    const head = snake[0];

    // Colisão com as bordas
    if (
        head.x < 0 ||
        head.x >= canvasSize ||
        head.y < 0 ||
        head.y >= canvasSize
    ) {
        return true;
    }

    // Colisão com o corpo da cobra
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }

    return false;
}

// Atualizar o jogo
function updateGame() {
    if (checkCollision()) {
        clearInterval(gameInterval); // Parar o loop do jogo
        gameOver.style.display = "block";
        canvas.style.display = "none";
        startButton.style.display = "block";
        return;
        
    }

    ctx.clearRect(0, 0, canvasSize, canvasSize);
    drawFood();
    updateSnake();
    drawSnake();
}

// Iniciar o jogo ao clicar no botão
startButton.addEventListener("click", () => {
    startButton.style.display = "none"; // Esconder o botão de início
    canvas.style.display = "block"; // Mostrar o canvas
    gameOver.style.display = "none"; // Esconder a mensagem de Game Over
    pontuação = 0; // Reiniciar a pontuação
    scoreDisplay.innerText = `Pontuação: ${pontuação}`;
    snake = [{ x: boxSize * 11, y: boxSize * 6 }]; // Reiniciar a cobra
    direction = "RIGHT"; // Reiniciar a direção
    food = { x: getRandomPosition(), y: getRandomPosition() }; // Gerar nova comida
    gameInterval = setInterval(updateGame, 100); // Iniciar o loop do jogo
});
