
const {Schema, model} = require('mongoose');


const userSchema = new Schema({
  username: {type: String, unique: true, required: true},
  email: {
    type: String,
    required: true,
    index: {
      unique: true,
      collation: {locale: 'en', strength: 2},
    }
  },
  googleId: {type: Number},
  githubId: {type: Number},
  dob: {type: Date, default: null},
  nat: {type: String, default: 'un'},
  img: {type: String, default: 'http://localhost:3003/default.png'},
  rankings: {
    totalScore: {type: Number},
    highScore: {type: Number},
  },
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
      unlocked: [{type: String}],
      next: {type: Number, default: 10},
    },
    correctAnswers: {
      unlocked: [{type: String}],
      next: {type: Number , default: 100},
    },
    score: {
      total: {
        unlocked: [{type: String}],
        next: {type: Number, default: 100000},
      },
      high: {
        unlocked: [{type: String}],
        next: {type: Number, default: 3000},
      },
    },
    completedCategories: {
      total: {
        unlocked: [{type: String}],
        next: {type: Number, default: 100},
      },
      max: {
        unlocked: [{type: String}],
        next: {type: Number},
      },
    },
    all: {
      unlocked: {type: String},
    },
  },
  games: [{type: Schema.Types.ObjectId, ref: 'Game'}],
  token: {type: String},
  options: {
    gameMode: {type: String, default: 'quick'},
    categories: {type: Array, default: [
      'choose',
      'choose',
      'choose',
      'choose',
      'choose',
      'choose',
    ]},
  },
})

module.exports = model('User', userSchema);
