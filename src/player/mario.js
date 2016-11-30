const cloneDeep = require('lodash/cloneDeep');

const Base = require('./base');
const Game = require('../game');

const MAX_DEPTH = 7;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * ((max - min) + 1)) + min;
}

function getPossibleMoves(game, outerPos) {
  return game.state[outerPos]
    .map((player, pos) => ({player, pos}))
    .filter(({player, pos}) => player === null)
    .map(({pos}) => pos);
}

function getScore(game, winners, stepsLeft) {
  let score = 0;

  game.blocksWon.forEach((winner, outerPos) => {
    if (winner === null) {
      const block = game.state[outerPos];
      for (const matcher of Game.TIC_TAC_TOE_MATCHERS) {
        let countPlayer = 0;
        let countOpponent = 0;
        let countNone = 0;

        for (const innerPos of matcher) {
          if (block[innerPos] === null) {
            countNone += 1;
          } else if (block[innerPos] === game.currentPlayer) {
            countPlayer += 1;
          } else {
            countOpponent += 1;
          }
        }

        if (countNone === 1 && countPlayer === 2) {
          score += 1;
        } else if (countNone && countOpponent === 2) {
          score -= 1;
        }
      }
    } else if (winner === game.currentPlayer) {
      score += 100;
    } else {
      score -= 100;
    }
  });

  return score;
}

function undoUpdate(game, nextOuterPos, firstMove, innerPos, blockWon) {
  game.currentPlayer = game.currentPlayer === Game.PLAYER1
    ? Game.PLAYER2
    : Game.PLAYER1;
  game.nextOuterPos = nextOuterPos;
  game.firstMove = firstMove;
  game.state[nextOuterPos][innerPos] = null;
  game.blocksWon[nextOuterPos] = blockWon;
}

function miniMax(game, outerPos, depth = MAX_DEPTH,
  alpha = Number.NEGATIVE_INFINITY,
  beta = Number.POSITIVE_INFINITY) {
  const winners = game.getWinners();
  if (depth === 0 || winners.length > 0) {
    return getScore(game, winners, depth);
  }

  let maxScore = alpha;
  let bestMove = null;
  const moves = getPossibleMoves(game, outerPos);
  for (let i = 0; i < moves.length; i += 1) {
    const firstMove = game.firstMove;
    const blockWon = game.blocksWon[outerPos];
    game.update(moves[i], firstMove ? outerPos : undefined);
    const score = -1 * miniMax(
      game,
      game.nextOuterPos,
      depth - 1,
      -1 * beta,
      -1 * maxScore);
    undoUpdate(game, outerPos, firstMove, moves[i], blockWon);

    if (score > maxScore) {
      maxScore = score;
      bestMove = moves[i];

      if (maxScore >= beta) {
        break;
      }
    }
  }

  if (depth === MAX_DEPTH) {
    return bestMove;
  }
  return maxScore;
}

class Mario extends Base {
  update(callback) {
    const outerPos = this.game.firstMove
      ? getRandomInt(0, 8)
      : this.game.nextOuterPos;

    // Clone game to be able to modify it without interrupting the real game
    const game = cloneDeep(this.game);
    const innerPos = miniMax(game, outerPos);

    callback(
      null,
      this.game.update(innerPos, this.game.firstMove ? outerPos : undefined)
    );
  }
}

module.exports = Mario;
