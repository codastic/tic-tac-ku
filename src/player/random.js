const Base = require('./base');

function getRandomInt(min, max) {
  return Math.floor(Math.random() * ((max - min) + 1)) + min;
}

class Random extends Base {
  update(callback) {
    const outerPos = this.game.firstMove
      ? getRandomInt(0, 8)
      : this.game.nextOuterPos;

    // Get possible moves
    const moves = this.game.state[outerPos]
      .map((player, pos) => ({player, pos}))
      .filter(({player, pos}) => player === null)
      .map(({pos}) => pos);
    const innerPos = moves[getRandomInt(0, moves.length - 1)];

    // Use timeout to not let it run too fast
    setTimeout(() => {
      callback(
        null,
        this.game.update(innerPos, this.game.firstMove ? outerPos : undefined)
      );
    }, 500);
  }
}

module.exports = Random;
