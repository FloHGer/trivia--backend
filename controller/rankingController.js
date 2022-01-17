const Ranking = require('../schemas/rankingSchema.js');

module.exports = rankingController = {
  highScore: async(req, res, nxt) => {
    console.log('GET on /ranks/highscore');
    const highScoreRanking = await Ranking.findOne({name: 'highscore'});
    if(!highScoreRanking) return res.status(204).send({message :'highscore rankings not found'});

    res.send({message: 'success', payload: highScoreRanking.list});
  },


  totalScore: async(req, res, nxt) => {
    console.log('GET on /ranks/totalscore');
    const totalScoreRanking = await Ranking.findOne({name: 'totalscore'});
    if(!totalScoreRanking) return res.status(204).send({message :'totalscore rankings not found'});

    res.send({message: 'success', payload: totalScoreRanking.list});
  },
}