const User = require('../../schemas/userSchema.js');
const Stat = require('../../schemas/statSchema.js');


module.exports = async(req, res, nxt) => {
  try{
    const game = res.game;
    const totalAnswers = game.categories
      .reduce((sum, category) => sum + category.answers.length, 0);
    const correctAnswers = game.categories
      .reduce((sum, category) => sum + category.answers
        .reduce((sum, answer) => (answer ? ++sum : sum), 0), 0);
    const completedCategories = game.categories
      .reduce((sum, category) => (category.answers[4] ? ++sum : sum), 0);

    const updateUser = await User.updateOne(
      {username: req.params.username},
      {
        $push: {games: game._id},
        $inc: {
          'stats.gamesPlayed': 1,
          'stats.answers.total': totalAnswers,
          'stats.answers.correct': correctAnswers,
          'stats.score.total': game.score,
          'stats.completedCategories.total': completedCategories,
        },
        $max: {
          'stats.score.high': game.score,
          'stats.completedCategories.max': completedCategories,
        },
      }
    );
    if(!updateUser.modifiedCount) return res.status(204).send({message: 'user not updated'});
// GLOBAL STATS
    const updateStats = await Stat.updateOne({name: 'serverStats'},
      {
        $inc: {
          'gamesPlayed': 1,
          'answers.total': totalAnswers,
          'answers.correct': correctAnswers,
          'score.total': game.score,
          'completedCategories': completedCategories,
        },
        $max: {
          'score.high': game.score,
        },
      },
      {upsert: true}
    );
    if(!updateStats.modifiedCount && !updateStats.upsertedCount) return res.status(204).send({message: 'stats not updated'});
    return nxt();
  }catch(err){nxt(err)}
}


// category specific ideas:

// const names = game.categories.map(category => category.name);


// `stats.categories.${names[0]}.count`: 1,
// `stats.categories.${names[1]}.count`: 1,
// `stats.categories.${names[2]}.count`: 1,
// `stats.categories.${names[3]}.count`: 1,
// `stats.categories.${names[4]}.count`: 1,
// `stats.categories.${names[5]}.count`: 1,
// stats.categories.names[0].totalAnswers += game.category.answers.length[0]
// stats.categories.names[1].totalAnswers += game.category.answers.length[1]
// stats.categories.names[2].totalAnswers += game.category.answers.length[2]
// stats.categories.names[3].totalAnswers += game.category.answers.length[3]
// stats.categories.names[4].totalAnswers += game.category.answers.length[4]
// stats.categories.names[5].totalAnswers += game.category.answers.length[5]
// stats.categories.names[0].correctAnswers += correctAnswers[0]
// stats.categories.names[1].correctAnswers += correctAnswers[1]
// stats.categories.names[2].correctAnswers += correctAnswers[2]
// stats.categories.names[3].correctAnswers += correctAnswers[3]
// stats.categories.names[4].correctAnswers += correctAnswers[4]
// stats.categories.names[5].correctAnswers += correctAnswers[5]
// stats.categories.names[0].correctAnswers += correctAnswers[0]
// stats.categories.names[1].correctAnswers += correctAnswers[1]
// stats.categories.names[2].correctAnswers += correctAnswers[2]
// stats.categories.names[3].correctAnswers += correctAnswers[3]
// stats.categories.names[4].correctAnswers += correctAnswers[4]
// stats.categories.names[5].correctAnswers += correctAnswers[5]

// await User.aggregate([
//   {$project: {
//     '$stats.categories': {
//       $map: {
//         input: '$stats.categories',
//         as: '$name',
//         in: {$inc: ['$$names[$index]', 1]},
//       },
//     },
//   },},
// ]);
