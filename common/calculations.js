const User = require('../schemas/userSchema.js');
const Stat = require('../schemas/statSchema.js');
const Ranking = require('../schemas/rankingSchema.js');

module.exports = calculate = {
// PERSONAL STATS
  stats: async(req, res, nxt) => {
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
  },


// ACHIEVEMENTS
  achievs: async(req, res, nxt) => {
    try{
      const {stats, achievs} = await User.findOne({username: req.params.username}, '-_id stats achievs');
      const newAchievs = [];
// games
      if(stats.gamesPlayed === 10) {
        achievs.gamesPlayed.push(Date.now());
        newAchievs.push('10 Games played!');
      };
      if(stats.gamesPlayed === 100) {
        achievs.gamesPlayed.push(Date.now());
        newAchievs.push('100 Games played!');
      };
      if(stats.gamesPlayed === 1000) {
        achievs.gamesPlayed.push(Date.now());
        newAchievs.push('1000 Games played!');
      };
// correct answers
      if(stats.answers.correct >= 100 && !achievs.correctAnswers.length) {
        achievs.correctAnswers.push(Date.now());
        newAchievs.push('100 correct answers!');
      };
      if(stats.answers.correct >= 1000 && achievs.correctAnswers.length === 1) {
        achievs.correctAnswers.push(Date.now());
        newAchievs.push('1000 correct answers!');
      };
      if(stats.answers.correct >= 10000 && achievs.correctAnswers.length === 2) {
        achievs.correctAnswers.push(Date.now());
        newAchievs.push('10.000 correct answers!');
      };
// highscore
      if(stats.score.high >= 3000 && !achievs.highScore.length) {
        achievs.highScore.push(Date.now());
        newAchievs.push('HIGHSCORE of 3000!');
      };
      if(stats.score.high >= 6000 && achievs.highScore.length === 1) {
        achievs.highScore.push(Date.now());
        newAchievs.push('HIGHSCORE of 6000!');
      };
      if(stats.score.high === 11111 && achievs.highScore.length === 2) {
        achievs.highScore.push(Date.now());
        newAchievs.push('HIGHSCORE of 11111!');
      };
// totalscore
      if(stats.score.total >= 100000 && !achievs.totalScore.length) {
        achievs.totalScore.push(Date.now());
        newAchievs.push('Total score of 100.000!');
      };
      if(stats.score.total >= 500000 && !achievs.totalScore.length) {
        achievs.totalScore.push(Date.now());
        newAchievs.push('Total score of 500.000!');
      };
      if(stats.score.total >= 1000000 && !achievs.totalScore.length) {
        achievs.totalScore.push(Date.now());
        newAchievs.push('Total score of 1.000.000!');
      };
// completed cats / game    ====================NEED TO CHECK FOR MULTIPLE AT ONCE
      if(stats.completedCategories.max >= 1 && !achievs.completedCategoriesMax.length) {
        achievs.completedCategoriesMax.push(Date.now());
        newAchievs.push('One category completed!');
      };
      if(stats.completedCategories.max >= 2 && achievs.completedCategoriesMax.length === 1) {
        achievs.completedCategoriesMax.push(Date.now());
        newAchievs.push('Two categories completed in one game!');
      };
      if(stats.completedCategories.max >= 3 && achievs.completedCategoriesMax.length === 2) {
        achievs.completedCategoriesMax.push(Date.now());
        newAchievs.push('Three categories completed in one game!');
      };
      if(stats.completedCategories.max >= 4 && achievs.completedCategoriesMax.length === 3) {
        achievs.completedCategoriesMax.push(Date.now());
        newAchievs.push('Four categories completed in one game!');
      };
      if(stats.completedCategories.max >= 5 && achievs.completedCategoriesMax.length === 4) {
        achievs.completedCategoriesMax.push(Date.now());
        newAchievs.push('Five categories completed in one game!');
      };
      if(stats.completedCategories.max === 6 && achievs.completedCategoriesMax.length === 5) {
        achievs.completedCategoriesMax.push(Date.now());
        newAchievs.push('All categories completed in one game!');
      };
// completed cats
      if(stats.completedCategories.total >= 100 && !achievs.completedCategoriesTotal.length) {
        achievs.completedCategoriesTotal.push(Date.now());
        newAchievs.push('100 completed categories!');
      };
      if(stats.completedCategories.total >= 500 && achievs.completedCategoriesTotal.length === 1) {
        achievs.completedCategoriesTotal.push(Date.now());
        newAchievs.push('500 completed categories!');
      };
      if(stats.completedCategories.total >= 1000 && !achievs.completedCategoriesTotal.length === 2) {
        achievs.completedCategoriesTotal.push(Date.now());
        newAchievs.push('1000 completed categories!');
      };
// all
      if(achievs.all === false
        && achievs.gamesPlayed.length === 3
        && achievs.correctAnswers.length === 3
        && achievs.highScore.length === 3
        && achievs.totalScore.length === 3
        && achievs.completedCategoriesMax.length === 6
        && achievs.completedCategoriesTotal.length === 3
      ){
        achievs.all = true;
        newAchievs.push('ALL Achievements!');
      };

      const update = await User.updateOne({username: req.params.username}, {achievs});
      if(!update.matchedCount) return res.status(204).send({message: 'user not found'});

      res.newAchievs = newAchievs;

      nxt();
    }catch(err){nxt(err)}
  },


  ranks: async (req, res, nxt) => {
    try{
      const ranking = await User.aggregate([
        {$project: {_id: 0, username: 1, stats: {score: {high: 1}}}},
        {$sort: {'stats.score.high': -1}}
      ]);
      if(!ranking) return res.status(204).send({message: 'aggregation failed'});

      ranking.map((user, i) => ranking[i] = {username: user.username, value: user.stats.score.high});

      const update = await Ranking.updateOne({name: 'highscore'},
        {list: ranking},
        {upsert: true},
      );
      if(!update.modifiedCount && !update.upsertedCount) return res.status(204).send({message: 'ranking not found'});

      return res.send({message: 'game posted', payload: {game: res.game, achievs: res.newAchievs}});
    }catch(err){nxt(err)}
  },
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