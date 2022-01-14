
const {Schema, model} = require('mongoose');


const user = new Schema({
  provider: {type: String, required: true},
  id: {type: Number, unique: true, increment: true},
  username: {type: String, unique: true, required: true},
  email: {type: String, unique: true},
  dob: {type: Date},
  nat: {type: String},
  img: {type: String},
  // experimental from here on
  options: {
    // setting1: state
    // setting2: state
  },
  games: [{type: Schema.Types.ObjectId, ref: 'Game'}],
  // achievements: ???,
  // ranking: ???,
})

module.exports = model('User', user);
