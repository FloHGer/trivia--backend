const Ranking = require('../schemas/rankingSchema.js');
const { HttpError } = require("../errors/errorController.js");

module.exports = rankingController = {
  highScore: async(req, res, nxt) => {
    console.log('GET on /ranks/highscore');
    try {
    const highScoreRanking = await Ranking.findOne({name: 'highscore'});
    if(!highScoreRanking) return nxt(new HttpError(404, 'highscore rankings not found'));
    res.send({message: 'success', payload: highScoreRanking.list});
    } catch (err) {nxt(err)}
  },


  totalScore: async(req, res, nxt) => {
    console.log('GET on /ranks/totalscore');
    try {
    const totalScoreRanking = await Ranking.findOne({name: 'totalscore'});
    if(!totalScoreRanking) return nxt(new HttpError(404, 'totalscore rankings not found'));
    res.send({message: 'success', payload: totalScoreRanking.list});
    } catch (err) {nxt(err)}
  },
}