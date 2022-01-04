const {Schema, model} = require('mongoose');


const stats = new Schema({
  user: ObjectId,
  gamesPlayed: Number,
  // date??
  score: {
    total: Number,
    high: Number,
  }
  categories: game.categories,

})

module.exports = model('Stats', stats);


// SCORE
// total score
// high score
// average score


// ANSWERS:
// per category:
//   correct answers per category (total / totalPercent / gamePercent)
//   category completed (total / percent)
//   part of games (total / percent)

// total:
//   questions answered (total / totalPercent / gamePercent)
//   categories completed (total / percent)
//   games played (total)




