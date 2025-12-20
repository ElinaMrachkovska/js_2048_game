'use strict';

class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[1024, 0, 0, 1024],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   * initial state.
   */
  constructor(initialState) {
    this.state = initialState;
    this.status = 'idle';
    this.score = 0;

    if (this.state === undefined) {
      this.state = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }
  }

  moveLeft() {
    const size = this.state.length;
    let isMoved = false;
    let isAdded = false;

    for (let rowIndex = 0; rowIndex < size; rowIndex++) {
      const row = this.state[rowIndex];

      for (let cellIndex = 1; cellIndex < size; cellIndex++) {
        const cell = row[cellIndex];

        if (cell > 0) {
          let cellPosition = cellIndex;

          for (let availCell = 0; availCell < size; availCell++) {
            if (row[availCell] === 0 && availCell < cellIndex) {
              row[availCell] = cell;
              row[cellIndex] = 0;
              cellPosition = availCell;
              isMoved = true;
              break;
            }
          }

          if (row[cellPosition] === row[cellPosition - 1]) {
            row[cellPosition - 1] += row[cellPosition];
            this.score += row[cellPosition - 1];
            row[cellPosition] = 0;
            isAdded = true;
          }
        }
      }
    }

    if (isMoved || isAdded) {
      this.setRandomCell();
      this.status = 'playing';
    }
    this.checkForWinn();
    this.checForLose();
  }

  moveRight() {
    const size = this.state.length;
    let isMoved = false;
    let isAdded = false;

    for (let rowIndex = 0; rowIndex < size; rowIndex++) {
      const row = this.state[rowIndex];

      for (let cellIndex = 2; cellIndex >= 0; cellIndex--) {
        const cell = row[cellIndex];

        if (cell > 0) {
          let cellPosition = cellIndex;

          for (let availCell = 3; availCell > 0; availCell--) {
            if (row[availCell] === 0 && availCell > cellIndex) {
              row[availCell] = cell;
              row[cellIndex] = 0;
              cellPosition = availCell;
              isMoved = true;
              break;
            }
          }

          if (row[cellPosition] === row[cellPosition + 1]) {
            row[cellPosition + 1] += row[cellPosition];
            row[cellPosition] = 0;
            this.score += row[cellPosition + 1];
            isAdded = true;
          }
        }
      }
    }

    if (isMoved || isAdded) {
      this.setRandomCell();
      this.status = 'playing';
    }
    this.checkForWinn();
    this.checForLose();
  }

  moveUp() {
    const size = this.state.length;
    let isMoved = false;
    let isAdded = false;

    for (let columnIndex = 0; columnIndex < size; columnIndex++) {
      for (let rowIndex = 1; rowIndex < size; rowIndex++) {
        const cell = this.state[rowIndex][columnIndex];

        if (cell > 0) {
          let cellPosition = rowIndex;

          for (let availCell = 0; availCell < size; availCell++) {
            const availPlace = this.state[availCell][columnIndex];

            if (availPlace === 0 && availCell < rowIndex) {
              this.state[availCell][columnIndex] = cell;
              this.state[rowIndex][columnIndex] = 0;
              cellPosition = availCell;
              isMoved = true;
              break;
            }
          }

          const current = this.state[cellPosition][columnIndex];
          const next = this.state[cellPosition - 1];

          if (next !== undefined && current === next[columnIndex]) {
            next[columnIndex] += current;
            this.state[cellPosition][columnIndex] = 0;
            this.score += next[columnIndex];
            isAdded = true;
          }
        }
      }
    }

    if (isMoved || isAdded) {
      this.setRandomCell();
      this.status = 'playing';
    }
    this.checkForWinn();
    this.checForLose();
  }
  moveDown() {
    const size = this.state.length;
    let isMoved = false;
    let isAdded = false;

    for (let columnIndex = 0; columnIndex < size; columnIndex++) {
      for (let rowIndex = 2; rowIndex >= 0; rowIndex--) {
        const cell = this.state[rowIndex][columnIndex];

        if (cell > 0) {
          let cellPosition = rowIndex;

          for (let availCell = 3; availCell > 0; availCell--) {
            const availPlace = this.state[availCell][columnIndex];

            if (availPlace === 0 && availCell > rowIndex) {
              this.state[availCell][columnIndex] = cell;
              this.state[rowIndex][columnIndex] = 0;
              cellPosition = availCell;
              isMoved = true;
              break;
            }
          }

          const current = this.state[cellPosition][columnIndex];
          const next = this.state[cellPosition + 1];

          if (next !== undefined && current === next[columnIndex]) {
            next[columnIndex] += current;
            this.state[cellPosition][columnIndex] = 0;
            this.score += next[columnIndex];
            isAdded = true;
          }
        }
      }
    }

    if (isMoved || isAdded) {
      this.setRandomCell();
      this.status = 'playing';
    }
    this.checkForWinn();
    this.checForLose();
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.state;
  }

  /**
   * Returns the current game status.
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.setRandomCell();
    this.setRandomCell();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
  }

  setRandomCell() {
    const randomNum = Math.random();

    const maped = [];

    this.state.forEach((el, i) => {
      el.forEach((e, j) => {
        if (e === 0) {
          maped.push([i, j]);
        }
      });
    });

    const randomCellIndx = Math.floor(Math.random() * maped.length);
    const [x, y] = maped[randomCellIndx];

    if (randomNum <= 0.1) {
      this.state[x][y] = 4;
    } else {
      this.state[x][y] = 2;
    }
  }

  checkForWinn() {
    const size = this.state.length;

    for (let rowIndex = 0; rowIndex < size; rowIndex++) {
      const row = this.state[rowIndex];

      for (let cellIndex = 1; cellIndex < size; cellIndex++) {
        const cell = row[cellIndex];

        if (cell === 2048) {
          this.status = 'win';
        }
      }
    }
  }

  checForLose() {
    const size = this.state.length;

    for (let rowIndex = 0; rowIndex < size; rowIndex++) {
      const row = this.state[rowIndex];

      for (let cellIndex = 1; cellIndex < size; cellIndex++) {
        const cell = row[cellIndex];

        if (cell === 0) {
          return;
        }

        if (cell === row[cellIndex + 1]) {
          return;
        }

        if (cell === row[cellIndex - 1]) {
          return;
        }

        const nextRow = this.state[rowIndex + 1];

        if (nextRow !== undefined && cell === nextRow[cellIndex]) {
          return;
        }

        const prevRow = this.state[rowIndex - 1];

        if (prevRow !== undefined && cell === prevRow[cellIndex]) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
  // Add your own methods here
}
module.exports = Game;