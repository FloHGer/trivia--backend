
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
    answers: {
      total: {type: Number},
      correct: {type: Number},
    },
    score: {
      total: {type: Number},
      high: {type: Number},
    },
    completedCategories: {
      total: {type: Number},
      max: {type: Number},
    },
    categories: [{
      name: {type: String},
      countTotal: {type: Number},
      countCompleted: {type: Number},
      totalAnswers: {type: Number},
      correctAnswers: {type: Number},
    }],
  },
  achievs: {
    gamesPlayed: [{type: Date}],
    correctAnswers: [{type: Date}],
    highScore: [{type: Date}],
    totalScore: [{type: Date}],
    completedCategoriesMax: [{type: Date}],
    completedCategoriesTotal: [{type: Date}],
    all: {type: Boolean},
  },
  games: [{type: Schema.Types.ObjectId, ref: 'Game'}],
  token: {type: String},
  options: {
    // setting1: state
    // setting2: state
  },
})

module.exports = model('User', user);
