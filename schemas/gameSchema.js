const {Schema, model} = require('mongoose');


const game = new Schema({
  user: ObjectId, // username of user
  datePlayed: new Date.now(),
  type: String, // custom / quick
  options: [], // joker / timer
  score: Number,
  categories: {
    categoryName: {
      answers: [Boolean],
      jokerUsed: Boolean,
      timeLeft: Number
    },
  }
})

module.exports = model('Game', game);

// {
//   categoryName1:[true, true, false],
//   categoryName2:[true, false],
//   categoryName3:[false],
//   categoryName4:[false],
//   categoryName5:[false],
//   categoryName6:[false],
// }