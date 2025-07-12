const boardElement = document.getElementById("board_game");
const statusElement = document.getElementById("status");
const restartButton = document.getElementById("restart");
const cells = Array.from(boardElement.children);
let clickAudio = new Audio("../sound/click-box.wav");
let winnerAudio = new Audio("../sound/winner.wav");
let drawAudio = new Audio("../sound/draw.wav");

const GameState = {
  currentPlayer: "o",
  board: {},
  status: "play",
};

const winningPatterns = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
  [1, 5, 9],
  [3, 5, 7],
];

function updateStatus(message) {
  statusElement.textContent = message;
}

function highlightWinningCells(pattern) {
  pattern.forEach((index) => {
    cells[index - 1].classList.add("success");
  });
}

function checkWinner() {
  for (const pattern of winningPatterns) {
    const [a, b, c] = pattern;
    if (
      GameState.board[a] === GameState.currentPlayer &&
      GameState.board[b] === GameState.currentPlayer &&
      GameState.board[c] === GameState.currentPlayer
    ) {
      highlightWinningCells(pattern);
      GameState.status = "end";
      updateStatus(`Player ${GameState.currentPlayer.toUpperCase()} wins!`);
      winnerAudio.play();
      return true;
    }
  }
  return false;
}

function switchPlayer() {
  GameState.currentPlayer = GameState.currentPlayer === "o" ? "x" : "o";
  updateStatus(`Player ${GameState.currentPlayer.toUpperCase()}'s turn`);
}

function resetGame() {
  GameState.currentPlayer = "o";
  GameState.board = {};
  GameState.status = "play";
  updateStatus(`Player O's turn`);

  cells.forEach((cell) => {
    cell.removeAttribute("data-content");
    cell.textContent = "";
    cell.classList.remove("success");
  });
}

function handleCellClick(e) {
  const cell = e.target;
  if (GameState.status === "end") return;
  if (!cell.classList.contains("cell")) return;
  if (cell.getAttribute("data-content")) return;
  const index = cell.getAttribute("data-index");
  cell.setAttribute("data-content", GameState.currentPlayer);
  cell.textContent = GameState.currentPlayer;
  GameState.board[index] = GameState.currentPlayer;
  clickAudio.play();

  const isWinner = checkWinner();

  if (!isWinner && Object.keys(GameState.board).length === 9) {
    updateStatus("It's a draw!");
    GameState.status = "end";
    drawAudio.play();
  } else {
    switchPlayer();
  }
}

boardElement.addEventListener("click", handleCellClick);
restartButton.addEventListener("click", resetGame);
