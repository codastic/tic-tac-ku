# Tic Tac Ku

Node cli implementation of the board game Tic Tac Ku with bots.
The idea of this project is to let different bots play against each other.

## The game

The game is a variant of the classic Tic Tac Toe but with a twist which makes it much more strategic.
You can find the rules here: http://www.colorku.com/Documents/TicTacKu%20Directions.pdf

## Run the game

Human vs Human: `node run.js human human`
Human vs Random: `node run.js human random`

You can basically choose any player from `/src/player`. You can even let two bots play against each other.

## Test

There are no tests. Sorry for that. But please use the linter with `npm test`.

## Contributing

Please feel free to contribute with any pull requests.
  
If you want to add your own AI, create a player with your name under `/src/player/[name].js` or as a subfolder with an `index.js` like `/src/player/[name]/index.js`.
You have to implement the interface of `/src/player/base.js`.
