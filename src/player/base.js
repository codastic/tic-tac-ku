class Player {
  constructor(game) {
    this.game = game;
  }

  update(callback) { // eslint-disable-line
    // This method is always called on the players turn and should call
    // callback(null, this.game.update(0, 0));
  }
}

module.exports = Player;
