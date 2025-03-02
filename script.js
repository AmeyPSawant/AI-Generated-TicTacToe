const modeSelection = document.getElementById('mode-selection');
const nameInput = document.getElementById('name-input');
const gameSection = document.getElementById('game');
const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('reset');
const changeModeButton = document.getElementById('change-mode');
const twoPlayerButton = document.getElementById('two-player');
const vsComputerButton = document.getElementById('vs-computer');
const player1NameInput = document.getElementById('player1-name');
const player2NameInput = document.getElementById('player2-name');
const proceedButton = document.getElementById('proceed');
const skipNamesButton = document.getElementById('skip-names');
const currentModeText = document.getElementById('current-mode');

let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = false;
let vsComputer = false;
let player1Name = 'Player 1';
let player2Name = 'Player 2';

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
    modeSelection.style.display = 'none';
    if (isVsComputer) {
        player1Name = 'Human';
        player2Name = 'Computer';
        gameSection.style.display = 'block';
        currentModeText.textContent = 'Mode: Human vs Computer';
        resetGame();
    } else {
        nameInput.style.display = 'block';
    }
}

// Handle name input
proceedButton.addEventListener('click', () => {
    const name1 = player1NameInput.value.trim();
    const name2 = player2NameInput.value.trim();
    if (name1 !== '' && name2 !== '') {
        player1Name = name1;
        player2Name = name2;
    }
    nameInput.style.display = 'none';
    gameSection.style.display = 'block';
    currentModeText.textContent = 'Mode: Two Players';
    resetGame();
});

skipNamesButton.addEventListener('click', () => {
    nameInput.style.display = 'none';
    gameSection.style.display = 'block';
    currentModeText.textContent = 'Mode: Two Players';
    resetGame();
});

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
        const winner = currentPlayer === 'X' ? player1Name : player2Name;
        statusText.textContent = `${winner} wins!`;
        endGame();
        return;
    }

    if (checkDraw()) {
        statusText.textContent = 'Draw!';
        endGame();
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();

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
        endGame();
        return;
    }

    if (checkDraw()) {
        statusText.textContent = 'Draw!';
        endGame();
        return;
    }

    currentPlayer = 'X';
    updateStatus();
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

// Update status text
function updateStatus() {
    const currentPlayerName = currentPlayer === 'X' ? player1Name : player2Name;
    statusText.textContent = `It's ${currentPlayerName}'s turn`;
}

// End the game
function endGame() {
    gameActive = false;
    cells.forEach(cell => {
        cell.classList.add('disabled');
    });
    resetButton.classList.add('blink');
}

// Reset the game
function resetGame() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    updateStatus();
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('X', 'O', 'disabled');
    });
    resetButton.classList.remove('blink');
}

// Change game mode
function changeMode() {
    gameSection.style.display = 'none';
    modeSelection.style.display = 'block';
}

// Event listeners
twoPlayerButton.addEventListener('click', () => startGame(false));
vsComputerButton.addEventListener('click', () => startGame(true));
resetButton.addEventListener('click', resetGame);
changeModeButton.addEventListener('click', changeMode);

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});