const fill = require('lodash/fill');
const invariant = require('invariant');

const PLAYER1 = 'x';
const PLAYER2 = 'o';

const TIC_TAC_TOES_FOR_WIN = 5;
const TIC_TAC_TOE_MATCHERS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

class Game {
  constructor() {
    this.currentPlayer = PLAYER1;
    this.nextOuterPos = null;
    this.firstMove = true;
    this.state = fill(Array(9), 0).map(() => fill(Array(9), null));
    this.blocksWon = fill(Array(9), null);
  }

  update(innerPos, outerPos = this.nextOuterPos) {
    invariant(outerPos !== null, 'outerPos may not be null');
    invariant(this.nextOuterPos === null || this.nextOuterPos === outerPos, 'outerPos may not be set');
    invariant(innerPos >= 0 && innerPos < 9, 'innerPos has to be in range 0 to 8');
    invariant(outerPos >= 0 && outerPos < 9, 'outerPos has to be in range 0 to 8');
    invariant(this.state[outerPos][innerPos] === null, 'position already set');

    // Update state
    this.firstMove = false;
    this.state[outerPos][innerPos] = this.currentPlayer;
    this.currentPlayer = this.currentPlayer === PLAYER1 ? PLAYER2 : PLAYER1;
    this.nextOuterPos = innerPos;

    // Check if updated block has a winner
    if (this.blocksWon[outerPos] === null) {
      const block = this.state[outerPos];
      for (const matcher of TIC_TAC_TOE_MATCHERS) {
        const player = block[matcher[0]];
        if (player !== null &&
          player === block[matcher[1]] &&
          player === block[matcher[2]]) {
          this.blocksWon[outerPos] = player;
          break;
        }
      }
    }

    return {
      innerPos,
      outerPos
    };
  }

  getWinners() {
    if (!this.firstMove) {
      const numWins = {
        [PLAYER1]: 0,
        [PLAYER2]: 0
      };

      this.blocksWon.forEach((player) => {
        if (numWins !== null) {
          numWins[player] += 1;
        }
      });

      const noMoreMoves = this.state[this.nextOuterPos].every(cell => cell !== null);

      if (numWins[PLAYER1] === 5 || (noMoreMoves && numWins[PLAYER1] > numWins[PLAYER2])) {
        return [PLAYER1];
      }
      if (numWins[PLAYER2] === 5 || (noMoreMoves && numWins[PLAYER2] > numWins[PLAYER1])) {
        return [PLAYER2];
      }
      if (noMoreMoves) {
        return [PLAYER1, PLAYER2]; // It's a tie
      }
    }

    return [];
  }
}

Game.PLAYER1 = PLAYER1;
Game.PLAYER2 = PLAYER2;
Game.TIC_TAC_TOE_MATCHERS = TIC_TAC_TOE_MATCHERS;
Game.TIC_TAC_TOES_FOR_WIN = TIC_TAC_TOES_FOR_WIN;

module.exports = Game;
