const {Schema, model} = require('mongoose');


const gameSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  datePlayed: {type: Date},
	// mode: custom / quick
  // options: [], joker / timer
  score: {type: Number},
  categories: {type: [
      {
        name: {type: String},
        answers: [{type: Boolean}],
      }
  ]}
});

module.exports = model('Game', gameSchema);
