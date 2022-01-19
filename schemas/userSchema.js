
const {Schema, model} = require('mongoose');


const userSchema = new Schema({
  provider: {type: String, required: true},
  username: {type: String, unique: true, required: true},
  email: {type: String, unique: true},
  id: {type: Number, unique: true},
  dob: {type: Date},
  nat: {type: String},
  img: {type: String},
  stats: {
    gamesPlayed: {type: Number, default: 0},
    answers: {
      total: {type: Number, default: 0},
      correct: {type: Number, default: 0},
    },
    score: {
      total: {type: Number, default: 0},
      high: {type: Number, default: 0},
    },
    completedCategories: {
      total: {type: Number, default: 0},
      max: {type: Number, default: 0},
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
    gamesPlayed: {
      unlocked: [{type: Date}],
      next: {type: Number},
    },
    correctAnswers: {
      unlocked: [{type: Date}],
      next: {type: Number},
    },
    score: {
      total: {
        unlocked: [{type: Date}],
        next: {type: Number},
      },
      high: {
        unlocked: [{type: Date}],
        next: {type: Number},
      },
    },
    completedCategories: {
      total: {
        unlocked: [{type: Date}],
        next: {type: Number},
      },
      max: {
        unlocked: [{type: Date}],
        next: {type: Number},
      },
    },
    all: {
      unlocked: {type: Date},
    },
  },
  games: [{type: Schema.Types.ObjectId, ref: 'Game'}],
  token: {type: String},
  options: {
    // setting1: state
    // setting2: state
  },
})

module.exports = model('User', userSchema);
