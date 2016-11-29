const clear = require('clear');
const path = require('path');
const chalk = require('chalk');

const argv = require('minimist')(process.argv.slice(2));

const Game = require('./src/game');

const Player1 = require(path.resolve('./src/player', argv._[0])); // eslint-disable-line import/no-dynamic-require
const Player2 = require(path.resolve('./src/player', argv._[1])); // eslint-disable-line import/no-dynamic-require

function playerToString(player, active = false, blockWinner) {
  if (player === null) {
    return active ? chalk.yellow('▣') : ' ';
  }

  if (blockWinner === player) {
    if (player === Game.PLAYER1) {
      return chalk.blue(player);
    }
    return chalk.red(player);
  }

  return player;
}

function printState(game) {
  clear();
  console.log('Current player: %s', game.currentPlayer);
  console.log('┏━━━┯━━━┯━━━┳━━━┯━━━┯━━━┳━━━┯━━━┯━━━┓');

  const s = game.state;
  for (let i = 0; i < 9; i += 3) {
    for (let j = 0; j < 9; j += 3) {
      console.log('┃ %s │ %s │ %s ┃ %s │ %s │ %s ┃ %s │ %s │ %s ┃',
        playerToString(s[i + 0][j + 0], i + 0 === game.nextOuterPos, game.blocksWon[i + 0]),
        playerToString(s[i + 0][j + 1], i + 0 === game.nextOuterPos, game.blocksWon[i + 0]),
        playerToString(s[i + 0][j + 2], i + 0 === game.nextOuterPos, game.blocksWon[i + 0]),
        playerToString(s[i + 1][j + 0], i + 1 === game.nextOuterPos, game.blocksWon[i + 1]),
        playerToString(s[i + 1][j + 1], i + 1 === game.nextOuterPos, game.blocksWon[i + 1]),
        playerToString(s[i + 1][j + 2], i + 1 === game.nextOuterPos, game.blocksWon[i + 1]),
        playerToString(s[i + 2][j + 0], i + 2 === game.nextOuterPos, game.blocksWon[i + 2]),
        playerToString(s[i + 2][j + 1], i + 2 === game.nextOuterPos, game.blocksWon[i + 2]),
        playerToString(s[i + 2][j + 2], i + 2 === game.nextOuterPos, game.blocksWon[i + 2]));

      if (j < 6) {
        console.log('┠───┼───┼───╂───┼───┼───╂───┼───┼───┨');
      }
    }

    if (i < 6) {
      console.log('┣━━━┿━━━┿━━━╋━━━┿━━━┿━━━╋━━━┿━━━┿━━━┫');
    }
  }

  console.log('┗━━━┷━━━┷━━━┻━━━┷━━━┷━━━┻━━━┷━━━┷━━━┛');
}

function nextStep(game, players) {
  printState(game);

  const winners = game.getWinners();
  if (winners.length > 0) {
    if (winners.length === 1) {
      console.log('Game ended with winner: %s', winners[0]);
    } else {
      console.log('Game ended with a tie.');
    }
    return;
  }

  const player = players[game.currentPlayer];
  player.update((error) => {
    if (error) {
      process.exit(1);
    }

    nextStep(game, players);
  });
}

const game = new Game();
const players = {
  [Game.PLAYER1]: new Player1(game),
  [Game.PLAYER2]: new Player2(game)
};

nextStep(game, players);
