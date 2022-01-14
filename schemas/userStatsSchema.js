const {Schema, model} = require('mongoose');


const userStatsSchema = new Schema({
  // user: , // username of user
  gamesPlayed: {type: Number},
  correctAnswers: {type: Number},
  highScore: {type: Number},
  totalScore: {type: Number},
  maxCompletedCategories: {type: Number},
  totalCompletedCategories: {type: Number},
})

module.exports = model('UserStats', userStatsSchema);




// gamesPlayed: [Date],
// correctAnswers: [Date],
// highScore: [Date],
// totalScore: [Date],
// completedCategoriesInOneGame: [Date],
// totalCompletedCategories: [Date],

// Games played 10 50 100 500 1000
// Questions answered correctly 100 500 1000
// Score (game) of 1000 3000 6000 11111
// Score (total) of 50000 100000 500000 10000000
// Categories (game) 1 2 3 4 5 6
// Categories (total) 100 500 1000