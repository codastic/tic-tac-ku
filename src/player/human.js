const prompt = require('prompt');
const compact = require('lodash/compact');

const Base = require('./base');

prompt.start();

class Human extends Base {
  update(callback) {
    const getInput = () => {
      prompt.get(compact([
        this.game.firstMove ? 'outerPosition' : undefined,
        'innerPosition'
      ]), (error, result) => {
        if (error) {
          callback(error);
          return;
        }

        const innerPos = parseInt(result.innerPosition, 0x10);
        const outerPos = this.game.firstMove ?
          parseInt(result.outerPosition, 0x10) :
          this.game.nextOuterPos;

        if (this.game.state[outerPos][innerPos] !== null) {
          console.log('The cell is already filled! Try again.');
          getInput();
          return;
        }

        callback(null, this.game.update(innerPos, this.game.firstMove ? outerPos : undefined));
      });
    };

    getInput();
  }
}

module.exports = Human;
