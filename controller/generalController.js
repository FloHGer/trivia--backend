const Stat = require('../schemas/statSchema.js');
const Feedback = require('../schemas/feedbackSchema.js');

module.exports = generalController = {
  stats:  async(req, res, nxt) => {
    console.log('GET on /stats');
    try{
      const stats = await Stat.findOne({name: 'serverStats'});
      if(!stats) res.status(204).send({message :'stats not found'});
      res.send({message: 'success', payload: stats});
    }catch(err){nxt(err)}
  },


  feedback: async(req, res, nxt) => {
    const feedback = await Feedback.create({
      value: req.body.feedback.value,
      message: req.body.feedback.message,
    });
    if(!feedback) return res.status(204).send({message: 'feedback not created'});
    res.send({message: 'success', payload: feedback});
  },
}