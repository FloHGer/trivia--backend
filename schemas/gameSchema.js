const {Schema, model} = require('mongoose');


const gameSchema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'} , // username of user
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

// {
//  {
//    name: categoryName1
//    answers:[true, true, false],
//  }
//   categoryName2:[true, false],
//   categoryName3:[false],
// }



// {
//    answers: {type:[{type:Boolean}]},
//    jokerUsed: {type:Boolean},
//    timeLeft: {type:Number},
// }
