
const {Schema, model} = require('mongoose');


const user = new Schema({
  provider: {type: String, required: true},
  username: {type: String, unique: true, required: true},
  email: {type: String, unique: true},
  id: {type: Number, unique: true},
  dob: {type: Date},
  nat: {type: String},
  img: {type: String},
  stats: {
    gamesPlayed: {type: Number},
    totalAnswers: {type: Number},
    correctAnswers: {type: Number},
    totalScore: {type: Number},
    highScore: {type: Number},
    totalCompletedCategories: {type: Number},
    maxCompletedCategories: {type: Number},
    categories: [{
      name: {type: String},
      count: {type: Number},
      totalAnswers: {type: Number},
      correctAnswers: {type: Number},
    }],
  },
  achievements: {
    gamesPlayed: [{type: Date}],
    correctAnswers: [{type: Date}],
    highScore: [{type: Date}],
    totalScore: [{type: Date}],
    completedCategoriesInOneGame: [{type: Date}],
    totalCompletedCategories: [{type: Date}],
  },
  games: [{type: Schema.Types.ObjectId, ref: 'Game'}],
  token: {type: String},
  options: {
    // setting1: state
    // setting2: state
  },
  // ranking: ???,
})

module.exports = model('User', user);
