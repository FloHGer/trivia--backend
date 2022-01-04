
const {Schema, model} = require('mongoose');


const user = new Schema({
  username: {type: String, unique: true},
  email: {type: String, unique: true},
  dob: Date,
  nat: String,
  img: String,
  options: {
    // setting1: state
    // setting2: state
  },
  games: {},
  achievements: ObjectId, // achievement document
})

module.exports = model('User', user);
