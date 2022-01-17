const User = require('../../schemas/userSchema.js');
const Ranking = require('../../schemas/rankingSchema.js');


module.exports = async (req, res, nxt) => {
  try{
// highscore
    const highScoreRanking = await User.aggregate([
      {$project: {_id: 0, username: 1, stats: {score: {high: 1}}}},
      {$sort: {'stats.score.high': -1}}
    ]);
    if(!highScoreRanking) return res.status(204).send({message: 'aggregation failed'});
    highScoreRanking.map((user, i) =>
      highScoreRanking[i] = {username: user.username, value: user.stats.score.high});

    const highScoreUpdate = await Ranking.updateOne({name: 'highscore'},
      {list: highScoreRanking},
      {upsert: true},
    );
    if(!highScoreUpdate.modifiedCount && !highScoreUpdate.upsertedCount)
      return res.status(204).send({message: 'highScoreRanking not found'});

// totalscore
    const totalScoreRanking = await User.aggregate([
      {$project: {_id: 0, username: 1, stats: {score: {total: 1}}}},
      {$sort: {'stats.score.total': -1}}
    ]);
    if(!totalScoreRanking) return res.status(204).send({message: 'aggregation failed'});

    totalScoreRanking.map((user, i) =>
      totalScoreRanking[i] = {username: user.username, value: user.stats.score.total});

    const totalScoreUpdate = await Ranking.updateOne({name: 'totalscore'},
      {list: totalScoreRanking},
      {upsert: true},
    );
    if(!totalScoreUpdate.modifiedCount && !totalScoreUpdate.upsertedCount)
      return res.status(204).send({message: 'totalScoreRanking not found'});

    return res.send({message: 'game posted', payload: {game: res.game, achievs: res.newAchievs}});
  }catch(err){nxt(err)}
}