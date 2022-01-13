const {Schema, model} = require('mongoose');


const achievement = new Schema({
  user: ObjectId, // username of user
  gamesPlayed: [Date],
  correctAnswers: [Date],
  highScore: [Date],
  totalScore: [Date],
  completedCategoriesInOneGame: [Date],
  totalCompletedCategories: [Date],
})

module.exports = model('Achievement', achievement);



// Games played 10 50 100 500 1000
// Questions answered correctly 100 500 1000
// Score (game) of 1000 3000 6000 11111
// Score (total) of 50000 100000 500000 10000000
// Categories (game) 1 2 3 4 5 6
// Categories (total) 100 500 1000