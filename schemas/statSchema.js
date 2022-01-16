const {Schema, model} = require('mongoose');


const statSchema = new Schema({
  name: {type: String},
  gamesPlayed: {type: Number},
  answers: {
    total: {type: Number},
    correct: {type: Number},
  },
  score: {
    total: {type: Number},
    high: {type: Number},
  },
  completedCategories: {type: Number},
  // categories: [],
})

module.exports = model('Stat', statSchema);
