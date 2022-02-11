const {Schema, model} = require('mongoose');


const rankingSchema = new Schema({
  name: {type: String},
  list: [{
    username: {type: String},
    value: {type: Number},
    img: {type: String},
    nat: {type: String},
  }],
})

module.exports = model('Ranking', rankingSchema);
