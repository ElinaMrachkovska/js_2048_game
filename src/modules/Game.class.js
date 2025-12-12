'use strict';

const FIELD_SIZE = 4;
const WIN_VALUE = 2048;
const EMPTY_CELL = 0;
const INITIAL_TILES = 2;

class Game {
  /**
   * @param {number[][]} [initialState]
   */
  constructor(initialState) {
    this.initialState = initialState;
    this.board = [];
    this.score = 0;
    this.status = 'initial';
    this.isMoved = false;
    this.isFirstMove = true;

    if (!initialState) {
      this.initialState = this.getInitialField();
    }
    this.restart();
  }

  getInitialField() {
    return Array(FIELD_SIZE)
      .fill()
      .map(() => Array(FIELD_SIZE).fill(EMPTY_CELL));
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < FIELD_SIZE; row++) {
      for (let col = 0; col < FIELD_SIZE; col++) {
        if (this.board[row][col] === EMPTY_CELL) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { row, col } = emptyCells[randomIndex];
      const newValue = Math.random() < 0.1 ? 4 : 2;

      this.board[row][col] = newValue;
    }
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
    if (this.status === 'initial') {
      this.status = 'playing';
      this.isFirstMove = true;

      for (let i = 0; i < INITIAL_TILES; i++) {
        this.addRandomTile();
      }

      return true;
    }

    return false;
  }

  restart() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'initial';
    this.isMoved = false;
    this.isFirstMove = true;
  }

  /**
   * @param {('left'|'right'|'up'|'down')} direction
   */
  makeMove(direction) {
    if (this.status !== 'playing') {
      return false;
    }

    const boardBefore = JSON.stringify(this.board);
    
    let currentScoreIncrease = 0;

    let processedBoard = this.rotate(this.board, direction);

    processedBoard = processedBoard.map((row) => {
      const result = this.processRow(row);
      currentScoreIncrease += result.scoreIncrease;
      return result.newRow;
    });

    this.board = this.rotateBack(processedBoard, direction);

    const boardAfter = JSON.stringify(this.board);
    const moved = boardBefore !== boardAfter;

    if (moved) {
      this.score += currentScoreIncrease;
      this.isFirstMove = false;
      this.addRandomTile(); 
      this.checkGameStatus();
      return true;
    }

    return false;
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
   * @param {number[]} row
   * @returns {{newRow: number[], scoreIncrease: number}}
   */
  processRow(row) {
    const filtered = row.filter((value) => value !== EMPTY_CELL);
    const newRow = [];
    let scoreIncrease = 0;
    let i = 0;

    while (i < filtered.length) {
      if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
        const mergedValue = filtered[i] * 2;
        newRow.push(mergedValue);
        scoreIncrease += mergedValue;
        i += 2; 
      } else {
        newRow.push(filtered[i]);
        i += 1;
      }
    }
    while (newRow.length < FIELD_SIZE) {
      newRow.push(EMPTY_CELL);
    }

    return { newRow, scoreIncrease };
  }

  /**
   * @param {number[][]} board
   * @param {('left'|'right'|'up'|'down')} direction
   */
  rotate(board, direction) {
    let newBoard = board.map((row) => [...row]);

    switch (direction) {
      case 'up':
        newBoard = newBoard[0].map((_, colIndex) =>
          newBoard.map((row) => row[colIndex])
        );
        break;
      case 'down':
        newBoard = newBoard[0].map((_, colIndex) =>
          newBoard.map((row) => row[colIndex]).reverse()
        );
        break;
      case 'right':
        newBoard = newBoard.map((row) => row.reverse());
        break;
      case 'left':
      default:
        break;
    }

    return newBoard;
  }

  /**
   * @param {number[][]} board
   * @param {('left'|'right'|'up'|'down')} direction
   */
  rotateBack(board, direction) {
    let newBoard = board.map((row) => [...row]);

    switch (direction) {
      case 'up':
        newBoard = newBoard[0].map((_, colIndex) =>
          newBoard.map((row) => row[colIndex])
        );
        break;
      case 'down':
        newBoard = newBoard.map((row) => row.reverse());
        newBoard = newBoard[0].map((_, colIndex) =>
          newBoard.map((row) => row[colIndex])
        );
        break;
      case 'right':
        newBoard = newBoard.map((row) => row.reverse());
        break;
      case 'left':
      default:
        break;
    }

    return newBoard;
  }

  hasAvailableMoves() {
    for (let r = 0; r < FIELD_SIZE; r++) {
      for (let c = 0; c < FIELD_SIZE; c++) {
        if (this.board[r][c] === EMPTY_CELL) {
          return true;
        }
      }
    }

    for (let r = 0; r < FIELD_SIZE; r++) {
      for (let c = 0; c < FIELD_SIZE; c++) {
        const current = this.board[r][c];

        if (c < FIELD_SIZE - 1 && current === this.board[r][c + 1]) {
          return true;
        }

        if (r < FIELD_SIZE - 1 && current === this.board[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }

  checkGameStatus() {
    for (let r = 0; r < FIELD_SIZE; r++) {
      for (let c = 0; c < FIELD_SIZE; c++) {
        if (this.board[r][c] >= WIN_VALUE) {
          this.status = 'won';
          return;
        }
      }
    }

    if (!this.hasAvailableMoves()) {
      this.status = 'lost';
    }
  }
}

module.exports = Game;