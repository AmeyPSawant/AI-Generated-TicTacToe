const modeSelection = document.getElementById("mode-selection");
const nameInput = document.getElementById("name-input");
const gameSection = document.getElementById("game");
const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const resetButton = document.getElementById("reset");
const changeModeButton = document.getElementById("change-mode");
const twoPlayerButton = document.getElementById("two-player");
const vsComputerButton = document.getElementById("vs-computer");
const player1NameInput = document.getElementById("player1-name");
const player2NameInput = document.getElementById("player2-name");
const proceedButton = document.getElementById("proceed");
const skipNamesButton = document.getElementById("skip-names");
const currentModeText = document.getElementById("current-mode");

let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = false;
let vsComputer = false;
let player1Name = "Player 1";
let player2Name = "Player 2";

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
  modeSelection.style.display = "none";
  if (isVsComputer) {
    player1Name = "Human";
    player2Name = "Computer";
    gameSection.style.display = "block";
    currentModeText.textContent = "Mode: Human vs Computer";
    resetGame();
  } else {
    nameInput.style.display = "block";
  }
}

// Handle name input
proceedButton.addEventListener("click", () => {
  const name1 = player1NameInput.value.trim();
  const name2 = player2NameInput.value.trim();
  if (name1 !== "" && name2 !== "") {
    player1Name = name1;
    player2Name = name2;
  }
  nameInput.style.display = "none";
  gameSection.style.display = "block";
  currentModeText.textContent = "Mode: Human v/s Human";
  resetGame();
});

skipNamesButton.addEventListener("click", () => {
  nameInput.style.display = "none";
  gameSection.style.display = "block";
  currentModeText.textContent = "Mode: Human v/s Human";
  resetGame();
});

// Handle cell clicks
function handleCellClick(event) {
  const clickedCell = event.target;
  const clickedCellIndex = parseInt(clickedCell.getAttribute("data-index"));

  if (gameState[clickedCellIndex] !== "" || !gameActive) {
    return;
  }

  gameState[clickedCellIndex] = currentPlayer;
  clickedCell.textContent = currentPlayer;
  clickedCell.classList.add(currentPlayer);

  if (checkWin()) {
    const winner = currentPlayer === "X" ? player1Name : player2Name;
    statusText.textContent = `${winner} wins!`;
    endGame();
    return;
  }

  if (checkDraw()) {
    statusText.textContent = "Draw!";
    endGame();
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateStatus();

  if (vsComputer && currentPlayer === "O" && gameActive) {
    computerMove();
  }
}

// Computer's move using Minimax
function computerMove() {
  let bestScore = -Infinity;
  let move;

  // Check for immediate winning move
  for (let i = 0; i < 9; i++) {
    if (gameState[i] === "") {
      gameState[i] = "O";
      if (checkWinForPlayer("O")) {
        move = i;
        gameState[i] = ""; // Undo the move
        break;
      }
      gameState[i] = ""; // Undo the move
    }
  }

  // If no immediate winning move, use Minimax to find the best move
  if (move === undefined) {
    for (let i = 0; i < 9; i++) {
      if (gameState[i] === "") {
        gameState[i] = "O";
        let score = minimax(gameState, 0, false);
        gameState[i] = "";
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
  }

  // Make the move
  if (move !== undefined) {
    gameState[move] = "O";
    cells[move].textContent = "O";
    cells[move].classList.add("O");

    if (checkWinForPlayer("O")) {
      statusText.textContent = "Computer wins!";
      endGame();
      return;
    }

    if (checkDraw()) {
      statusText.textContent = "Draw!";
      endGame();
      return;
    }

    currentPlayer = "X";
    updateStatus();
  }
}

// Minimax algorithm
function minimax(board, depth, isMaximizing) {
  if (checkWinForPlayer("O")) {
    return 1;
  }
  if (checkWinForPlayer("X")) {
    return -1;
  }
  if (checkDraw()) {
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "O";
        let score = minimax(board, depth + 1, false);
        board[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === "") {
        board[i] = "X";
        let score = minimax(board, depth + 1, true);
        board[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

// Check if a player has won
function checkWinForPlayer(player) {
  return winningConditions.some((condition) => {
    return condition.every((index) => {
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
  return gameState.every((cell) => cell !== "");
}

// Update status text
function updateStatus() {
  if (vsComputer) {
    statusText.textContent =
      currentPlayer === "X" ? `It's ${player1Name}'s turn` : `Computer's turn`;
  } else {
    statusText.textContent =
      currentPlayer === "X"
        ? `It's ${player1Name}'s turn`
        : `It's ${player2Name}'s turn`;
  }
}

// End the game
function endGame() {
  gameActive = false;
  cells.forEach((cell) => {
    cell.classList.add("disabled");
  });

  // Show the overlay with the result
  const overlay = document.getElementById("overlay");
  const gameOverText = overlay.querySelector(".game-over-text");

  if (checkWin()) {
    const winner = currentPlayer === "X" ? player1Name : player2Name;
    gameOverText.textContent = `${winner} wins!`;
  } else if (checkDraw()) {
    gameOverText.textContent = "Draw!";
  }

  overlay.style.display = "flex";

  // Blink the reset button once
  const resetButton = document.getElementById("reset");
  resetButton.classList.add("blink");

  // Remove the blink animation after it completes
  resetButton.addEventListener(
    "animationend",
    () => {
      resetButton.classList.remove("blink");
    },
    { once: true }
  );
}

// Reset the game
function resetGame() {
  gameState = ["", "", "", "", "", "", "", "", ""];
  gameActive = true;
  currentPlayer = "X";
  updateStatus();
  cells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("X", "O", "disabled");
  });

  // Hide the overlay
  const overlay = document.getElementById("overlay");
  overlay.style.display = "none";

  // Remove the blink animation if it exists
  const resetButton = document.getElementById("reset");
  resetButton.classList.remove("blink");
}

// Change game mode
function changeMode() {
  // Reset player names to default
  player1Name = "Player 1";
  player2Name = "Player 2";

  // Clear the name input fields
  player1NameInput.value = "";
  player2NameInput.value = "";

  // Hide the game section and show the mode selection screen
  gameSection.style.display = "none";
  modeSelection.style.display = "flex";

  // Reset the game state
  resetGame();
}

// Event listeners
twoPlayerButton.addEventListener("click", () => startGame(false));
vsComputerButton.addEventListener("click", () => startGame(true));
resetButton.addEventListener("click", resetGame);
changeModeButton.addEventListener("click", changeMode);

cells.forEach((cell) => {
  cell.addEventListener("click", handleCellClick);
});
