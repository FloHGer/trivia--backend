
const {Schema, model} = require('mongoose');


const feedbackSchema = new Schema({
  value: {type: Number},
  message: {type: String},
})

module.exports = model('Feedback', feedbackSchema);
