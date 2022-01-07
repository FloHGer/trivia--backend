
const {Schema, model} = require('mongoose');


const user = new Schema({
<<<<<<< HEAD
  username: {type: String, unique: true, required: true},
  email: {type: String, unique: true, required: true},
=======
  username: {type: String, unique: true},
  email: {type: String, unique: true},
  token: String,
>>>>>>> floh
  dob: Date,
  nat: String,
  img: String,
  options: {
    // setting1: state
    // setting2: state
  },
<<<<<<< HEAD
  games: {},
=======
>>>>>>> floh
  // achievements: ObjectId, // achievement document
})

module.exports = model('User', user);
