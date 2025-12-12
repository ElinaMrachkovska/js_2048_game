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
  const status = game.getStatus();
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

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  if (status === 'initial') {
    startButton.textContent = 'Start';
    startButton.classList.remove('restart');
    startButton.classList.add('start');
    messageStart.classList.remove('hidden');
  } else if (status === 'playing') {
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  } else if (status === 'won') {
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    messageWin.classList.remove('hidden');
  } else if (status === 'lost') {
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    messageLose.classList.remove('hidden');
  }
}

function handleKeyPress(event) {
  const status = game.getStatus();

  if (status !== 'playing') {
    return;
  }

  let moved = false;

  switch (event.key) {
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
    event.preventDefault();
  }

  renderGame();
}

function handleStartRestart() {
  const status = game.getStatus();

  if (status === 'initial') {
    game.start();
  } else {
    game.restart();
    game.start();
  }

  renderGame();
}

startButton.addEventListener('click', handleStartRestart);
document.addEventListener('keydown', handleKeyPress);

// Початковий рендер
renderGame();
