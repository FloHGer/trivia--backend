const {Schema, model} = require('mongoose');


const game = new Schema({
   user: {type: Schema.Types.ObjectId, ref: 'User'} , // username of user
   datePlayed: {type: Date},
    // custom / quick
   options: [], // joker / timer
   score: {type: Number},
   categories: {
      categoryName: {
         answers: {type:[{type:Boolean}]},
         jokerUsed: {type:Boolean},
         timeLeft: {type:Number},
      },
   },
});

module.exports = model('Game', game);

// {
//   categoryName1:[true, true, false],
//   categoryName2:[true, false],
//   categoryName3:[false],
//   categoryName4:[false],
//   categoryName5:[false],
//   categoryName6:[false],
// }