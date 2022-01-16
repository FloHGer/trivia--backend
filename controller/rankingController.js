const Ranking = require('../schemas/rankingSchema.js');

module.exports = rankingController = {
  highscore: async(req, res, nxt) => {
    console.log('GET on /ranks/highscore');
    const highscoreRanking = await Ranking.findOne({name: 'highscore'});
    if(!highscoreRanking) return res.status(204).send({message :'highscore rankings not found'});

    res.send({message: 'success', payload: highscoreRanking.list});
  },
}