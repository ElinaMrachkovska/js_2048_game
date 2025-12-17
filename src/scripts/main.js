import Game from '../modules/Game.class.js';

const fieldCells = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.game-score');
const startButton = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

const game = new Game();

function renderGame() {
  const board = game.getState();
  const gamesStatus = game.getStatus(); // 'idle', 'playing', 'win', 'lose'
  const score = game.getScore();

  fieldCells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = board[row][col];

    cell.textContent = value > 0 ? value : '';

    cell.className = 'field-cell';

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreElement.textContent = score;

  // Спочатку приховуємо всі повідомлення
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  // Очищаємо класи кнопки перед встановленням нового
  startButton.classList.remove('start', 'restart');

  // Логіка відображення
  if (gamesStatus === 'idle') {
    startButton.textContent = 'Start';
    startButton.classList.add('start');
    messageStart.classList.remove('hidden');
  } else if (gamesStatus === 'playing') {
    startButton.textContent = 'Restart';
    startButton.classList.add('restart');
  } else if (gamesStatus === 'win') { // Виправлено: 'won' -> 'win'
    startButton.textContent = 'Restart';
    startButton.classList.add('restart');
    messageWin.classList.remove('hidden');
  } else if (gamesStatus === 'lose') { // Виправлено: 'lost' -> 'lose'
    startButton.textContent = 'Restart';
    startButton.classList.add('restart');
    messageLose.classList.remove('hidden');
  }
}

function handleKeyPress(e) {
  const gamesStatus = game.getStatus();

  if (gamesStatus !== 'playing') {
    return;
  }

  let moved = false;

  switch (e.key) {
    case 'ArrowLeft':
      moved = game.moveLeft();
      break;
    case 'ArrowRight':
      moved = game.moveRight();
      break;
    case 'ArrowUp':
      moved = game.moveUp();
      break;
    case 'ArrowDown':
      moved = game.moveDown();
      break;
    default:
      return;
  }

  if (moved) {
    e.preventDefault();
  }

  renderGame();
}

function handleStartRestart() {
  const gamesStatus = game.getStatus();

  if (gamesStatus === 'idle') {
    // В стані idle кнопка є 'Start' -> викликаємо start
    game.start();
  } else {
    // В стані playing/win/lose кнопка є 'Restart' -> викликаємо restart
    // Restart скидає гру до 'idle'.
    game.restart();
  }

  renderGame();
}

startButton.addEventListener('click', handleStartRestart);
document.addEventListener('keydown', handleKeyPress);

// Початковий рендер
renderGame();