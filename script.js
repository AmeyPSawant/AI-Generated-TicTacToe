const modeSelection = document.getElementById('mode-selection');
const gameSection = document.getElementById('game');
const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset');
const twoPlayerButton = document.getElementById('two-player');
const vsComputerButton = document.getElementById('vs-computer');

let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;
let vsComputer = false;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Function to start the game based on the selected mode
function startGame(isVsComputer) {
    vsComputer = isVsComputer;
    gameActive = true;
    modeSelection.style.display = 'none';
    gameSection.style.display = 'block';
    statusText.textContent = `It's ${currentPlayer}'s turn`;
}

// Handle cell clicks
function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer);

    if (checkWin()) {
        statusText.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    }

    if (checkDraw()) {
        statusText.textContent = 'Draw!';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `It's ${currentPlayer}'s turn`;

    if (vsComputer && currentPlayer === 'O' && gameActive) {
        computerMove();
    }
}

// Computer's move using Minimax
function computerMove() {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < 9; i++) {
        if (gameState[i] === '') {
            gameState[i] = 'O';
            let score = minimax(gameState, 0, false);
            gameState[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    gameState[move] = 'O';
    cells[move].textContent = 'O';
    cells[move].classList.add('O');

    if (checkWin()) {
        statusText.textContent = 'Computer wins!';
        gameActive = false;
        return;
    }

    if (checkDraw()) {
        statusText.textContent = 'Draw!';
        gameActive = false;
        return;
    }

    currentPlayer = 'X';
    statusText.textContent = `It's ${currentPlayer}'s turn`;
}

// Minimax algorithm
function minimax(board, depth, isMaximizing) {
    if (checkWinForPlayer('O')) {
        return 1;
    }
    if (checkWinForPlayer('X')) {
        return -1;
    }
    if (checkDraw()) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Check if a player has won
function checkWinForPlayer(player) {
    return winningConditions.some(condition => {
        return condition.every(index => {
            return gameState[index] === player;
        });
    });
}

// Check for a win
function checkWin() {
    return checkWinForPlayer(currentPlayer);
}

// Check for a draw
function checkDraw() {
    return gameState.every(cell => cell !== '');
}

// Reset the game
function resetGame() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    statusText.textContent = `It's ${currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('X', 'O');
    });
}

// Event listeners
twoPlayerButton.addEventListener('click', () => startGame(false));
vsComputerButton.addEventListener('click', () => startGame(true));
resetButton.addEventListener('click', resetGame);

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});