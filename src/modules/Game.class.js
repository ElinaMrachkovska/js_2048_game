'use strict';

const FIELD_SIZE = 4;
const WIN_VALUE = 2048;
const EMPTY_CELL = 0;
const INITIAL_TILES = 2;
const STATUS_IDLE = 'idle';
const STATUS_PLAYING = 'playing';
const STATUS_WIN = 'win';
const STATUS_LOSE = 'lose';

export class Game {
  /**
   * @param {number[][]} [initialState]
   */
  constructor(initialState) {
    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : this.getInitialField();

    this.board = null;
    this.score = 0;
    this.status = STATUS_IDLE;
    this.isMoved = false;

    this.restart();
  }

  getInitialField() {
    return Array(FIELD_SIZE)
      .fill(0)
      .map(() => Array(FIELD_SIZE).fill(EMPTY_CELL));
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < FIELD_SIZE; r++) {
      for (let c = 0; c < FIELD_SIZE; c++) {
        if (this.board[r][c] === EMPTY_CELL) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { r, c } = emptyCells[randomIndex];

      const newValue = Math.random() < 0.1 ? 4 : 2;

      this.board[r][c] = newValue;

      return true;
    }

    return false;
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status !== STATUS_PLAYING) {
      this.status = STATUS_PLAYING;

      for (let i = 0; i < INITIAL_TILES; i++) {
        this.addRandomTile();
      }
      this.checkGameStatus();

      return true;
    }

    return false;
  }

  restart() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = STATUS_IDLE;
    this.isMoved = false;
  }

  makeMove(direction) {
    if (this.status !== STATUS_PLAYING) {
      return false;
    }

    this.isMoved = false;

    let currentScoreIncrease = 0;

    const originalBoard = this.board;
    let processedBoard = this.rotate(originalBoard, direction);
    let boardChanged = false;

    // ВИПРАВЛЕНО: Видалено невикористаний аргумент rowIndex
    processedBoard = processedBoard.map((row) => {
      const originalRow = [...row];
      const result = this.mergeRow(row);

      currentScoreIncrease += result.score;

      if (originalRow.join(',') !== result.newRow.join(',')) {
        boardChanged = true;
      }

      return result.newRow;
    });

    if (boardChanged) {
      this.isMoved = true;
      this.board = this.rotateBack(processedBoard, direction);
      this.score += currentScoreIncrease;
      this.addRandomTile();
    }
    
    this.checkGameStatus();

    return this.isMoved;
  }

  moveLeft() {
    return this.makeMove('left');
  }
  moveRight() {
    return this.makeMove('right');
  }
  moveUp() {
    return this.makeMove('up');
  }
  moveDown() {
    return this.makeMove('down');
  }

  /**
   *
   * @param {number[]} row
   */
  mergeRow(row) {
    const newRow = row.filter((cell) => cell !== EMPTY_CELL);
    let score = 0;

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        score += newRow[i];
        newRow.splice(i + 1, 1);
      }
    }

    while (newRow.length < FIELD_SIZE) {
      newRow.push(EMPTY_CELL);
    }

    return { newRow, score };
  }

  rotate(board, direction) {
    switch (direction) {
      case 'up':
        return board[0].map((_, colIndex) => board.map((row) => row[colIndex]));
      case 'down':
        const reversedRows = board.map((row) => [...row].reverse());

        return reversedRows[0].map((_, colIndex) =>
          reversedRows.map((row) => row[colIndex]));

      case 'right':
        return board.map((row) => [...row].reverse());

      case 'left':
      default:
        return board;
    }
  }
  rotateBack(board, direction) {
    switch (direction) {
      case 'up':
        return board[0].map((_, colIndex) => board.map((row) => row[colIndex]));
      case 'down':
        const transposed = board[0].map((_, colIndex) =>
          board.map((row) => row[colIndex]));

        return transposed.map((row) => row.reverse());
      case 'right':
        return board.map((row) => [...row].reverse());
      case 'left':
      default:
        return board;
    }
  }

  hasAvailableMoves() {
    // 1. Є порожні клітинки?
    for (let r = 0; r < FIELD_SIZE; r++) {
      for (let c = 0; c < FIELD_SIZE; c++) {
        if (this.board[r][c] === EMPTY_CELL) {
          return true;
        }
      }
    }

    // 2. Чи можна об'єднати сусідні клітинки?
    for (let r = 0; r < FIELD_SIZE; r++) {
      for (let c = 0; c < FIELD_SIZE; c++) {
        const current = this.board[r][c];

        // Перевірка праворуч
        if (c < FIELD_SIZE - 1 && current === this.board[r][c + 1]) {
          return true;
        }

        // Перевірка знизу
        if (r < FIELD_SIZE - 1 && current === this.board[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }

  checkGameStatus() {
    if (this.status === STATUS_WIN) {
      return;
    }

    // Перевірка на WIN
    for (let r = 0; r < FIELD_SIZE; r++) {
      for (let c = 0; c < FIELD_SIZE; c++) {
        if (this.board[r][c] >= WIN_VALUE) {
          this.status = STATUS_WIN;

          return;
        }
      }
    }

    // Перевірка на LOSE
    if (!this.hasAvailableMoves()) {
      this.status = STATUS_LOSE;
    }
  }
}

module.exports = Game;