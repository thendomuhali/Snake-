document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('game-board');
    const startButton = document.getElementById('start-button');
    const stopButton = document.getElementById('stop-button');
    const speedInput = document.getElementById('speed-input');
    const speedLabel = document.getElementById('speed-label');
    const scoreDisplay = document.getElementById('score'); // Assuming you have an element with the id 'score' for displaying the score
    let snake = [{ x: 10, y: 10 }];
    let direction = 'right';
    let food = { x: 5, y: 5 };
    let gameRunning = false;
    let intervalId;
    let speed = 200;
    let score = 0;

    function draw() {
        board.innerHTML = '';

        // Draw snake
        snake.forEach(segment => {
            const snakeSegment = document.createElement('div');
            snakeSegment.classList.add('snake');
            snakeSegment.style.left = `${segment.x * 20}px`;
            snakeSegment.style.top = `${segment.y * 20}px`;
            board.appendChild(snakeSegment);
        });

        // Draw food
        const foodElement = document.createElement('div');
        foodElement.classList.add('food');
        foodElement.style.left = `${food.x * 20}px`;
        foodElement.style.top = `${food.y * 20}px`;
        board.appendChild(foodElement);
    }

    function move() {
        const head = { ...snake[0] };

        switch (direction) {
            case 'up':
                head.y -= 1;
                break;
            case 'down':
                head.y += 1;
                break;
            case 'left':
                head.x -= 1;
                break;
            case 'right':
                head.x += 1;
                break;
        }

        // Check for collision with food
        if (head.x === food.x && head.y === food.y) {
            snake.unshift(food);
            generateFood();
            // Increase the score when the snake eats the food
            increaseScore();
        } else {
            // Move the snake
            snake.pop();
            snake.unshift(head);
        }

        // Check for collisions with walls or itself
        if (head.x < 0 || head.x >= 15 || head.y < 0 || head.y >= 15 || checkCollision()) {
            endGame();
        }

        draw();
    }

    function generateFood() {
        food = {
            x: Math.floor(Math.random() * 15),
            y: Math.floor(Math.random() * 15)
        };

        // Ensure the food does not overlap with the snake
        while (checkCollision()) {
            food = {
                x: Math.floor(Math.random() * 15),
                y: Math.floor(Math.random() * 15)
            };
        }
    }

    function checkCollision() {
        return snake.some(segment => segment.x === food.x && segment.y === food.y);
    }

    function startGame() {
        if (!gameRunning) {
            gameRunning = true;
            startButton.disabled = true;
            stopButton.disabled = false;
            speedInput.disabled = true;
            generateFood();
            draw();
            intervalId = setInterval(move, speed);
        }
    }

    function stopGame() {
        if (gameRunning) {
            gameRunning = false;
            startButton.disabled = false;
            stopButton.disabled = true;
            speedInput.disabled = false;
            clearInterval(intervalId);
            speed *= 2; // Increase speed by a factor of 2
            speedLabel.textContent = `Speed: ${speed}`;
        }
    }

    function endGame() {
        gameRunning = false;
        startButton.disabled = false;
        stopButton.disabled = true;
        speedInput.disabled = false;
        clearInterval(intervalId);
        alert('Game Over!');
        resetGame();
    }

    function resetGame() {
        snake = [{ x: 10, y: 10 }];
        direction = 'right';
        generateFood();
        draw();
    }

    // Increase the score and update the display
    function increaseScore() {
        score += 10; // Adjust the score increase as needed
        scoreDisplay.textContent = `Score: ${score}`;
    }

    // Handle keyboard input
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
        }
    });

    // Start button click event
    startButton.addEventListener('click', startGame);

    // Stop button click event
    stopButton.addEventListener('click', stopGame);

    // Adjust speed based on input range
    speedInput.addEventListener('input', () => {
        speed = parseInt(speedInput.value);
        speedLabel.textContent = `Speed: ${speed}`;
    });
});
