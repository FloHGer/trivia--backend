const Stat = require('../schemas/statSchema.js');

module.exports = generalController = {
  stats:  async(req, res, nxt) => {
    console.log('GET on /stats');
    try{
      const stats = await Stat.findOne({name: 'serverStats'});
      if(!stats) res.status(204).send({message :'stats not found'});
      res.send({message: 'success', payload: stats});
    }catch(err){nxt(err)}
  },

  ranks:  async(req, res, nxt) => {
    const ranks = await Ranks.findOne();
    if(!ranks) res.status(204).send({message :'ranks not found'});
    res.send({message: 'success', payload: ranks});
  },

  feedback:  async(req, res, nxt) => {
    // await Feedback.create();
  },
}