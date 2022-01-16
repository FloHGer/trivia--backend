const {Schema, model} = require('mongoose');


const rankingSchema = new Schema({
  name: {type: String},
  list: [{
    username: {type: String},
    value: {type: Number},
  }],
  // add further later
})

module.exports = model('Ranking', rankingSchema);
