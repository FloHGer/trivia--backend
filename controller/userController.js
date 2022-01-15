const {HttpError} = require('../errors/errorController.js');
const User = require('../schemas/userSchema');
const Game = require('../schemas/gameSchema');
const UserStats = require('../schemas/userStatsSchema');

module.exports = userController = {
  getUser: async (req, res, nxt) => {
    console.log('GET on /user/:username/');
    try {
      const user = await User.findOne({username: req.params.username});
      if (!user) return res.status(204).send('User does not exist');
      return res.send({message: 'success', payload: user});
    } catch (err) {
      nxt(err);
    }
  },

  patchUser: async (req, res, nxt) => {
    console.log('PATCH on /user/:username');
    try {
      const user = await User.updateOne(
        {username: req.params.username},
        req.body.updates
      );
      if (!user.matchedCount)
        return res.status(204).send({message: 'user not found'});
      if (!user.modifiedCount && user.matchedCount)
        return res.status(304).send({message: 'Not modified'});
      if (user.modifiedCount) {
        return res.status(201).send({message: 'user successfully updated'});
      }
    } catch (err) {
      nxt(err);
    }
  },

  deleteUser: async (req, res, nxt) => {
    console.log('DELETE on /user/:username');
    try {
      const user = await User.deleteOne({username: req.params.username});
      if (!user.deletedCount)
        return res.status(204).send({message: 'user not deleted.'});
      return res.send({message: 'user deleted'});
    } catch (err) {
      nxt(err);
    }
  },

  getGames: async (req, res, nxt) => {
    console.log('GET on /user/:username/games');
    try {
      const {games} = await User.findOne(
        {username: req.params.username},
        '-_id games'
      ).populate('games');
      if (!games.length) res.send({message: 'no games found'});
      res.send({message: 'success', payload: games});
    } catch (err) {
      nxt(err);
    }
  },

  postGame: async (req, res, nxt) => {
    console.log('POST on /user/:username/games');
    try {
      const user = await User.findOne({username: req.params.username});
      const game = await Game.create({
        user: user._id,
        datePlayed: Date.now(),
        score: req.body.score,
        categories: req.body.categories,
        // options: req.body.options, // needs to be an array
      });

      // CALCULATIONS
      const totalAnswers = game.categories
        .reduce((sum, category) => sum + category.answers.length, 0);
      const correctAnswers = game.categories
        .reduce((sum, category) => sum + category.answers
          .reduce((sum, answer) => (answer ? ++sum : sum), 0), 0);
      const completedCategories = game.categories
        .reduce((sum, category) => (category.answers[4] ? ++sum : sum), 0);

      const [names] = game.categories.map(category => category.name)
      
      // USER update
      const update = await User.updateOne(
        {username: req.params.username},
        {
          $push: {games: game._id},
          $inc: {
            'stats.gamesPlayed': 1,
            'stats.totalAnswers': totalAnswers,
            'stats.correctAnswers': correctAnswers,
            'stats.totalScore': game.score,
            'stats.totalCompletedCategories': completedCategories,
            // `stats.categories.${names[0]}.count`: 1,
            // `stats.categories.${names[1]}.count`: 1,
            // `stats.categories.${names[2]}.count`: 1,
            // `stats.categories.${names[3]}.count`: 1,
            // `stats.categories.${names[4]}.count`: 1,
            // `stats.categories.${names[5]}.count`: 1,
          },
          $max: {
            'stats.highScore': game.score,
            'stats.maxCompletedCategories': completedCategories,
          },
        }
      );

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

// GLOBAL STATS
        // const globalStats = async() => {

        //   await Stats.update({},
        //     {
        //       'gamesPlayed':
        //       'score.total':
        //       'score.high':
        //       'categories.name.games':
        //       'categories.name.completed':
        //       'categories.name.answersTotal':
        //       'categories.name.answersCorrect':

        //     }
        //   )
        // }


//ACHIEVEMENTS

      if(!update) return res.send('no')
      res.send({message: 'game posted'});
    } catch (err) {
      nxt(err);
    }
  },

  getRanks: async (req, res, nxt) => {
    console.log('GET on /user/:username/ranks');
    try {
      const ranking = await Ranking.findOne();
    } catch (err) {
      nxt(err);
    }
  },

  getStatistics: async (req, res, nxt) => {
    console.log('GET on /user/:username/stats');
    try {
      const stats = await Stats.findOne();
    } catch (err) {
      nxt(err);
    }
  },

  getAchievements: async (req, res, nxt) => {
    console.log('GET on /user/:username/achieves');
    try {
      const achievement = await Achievement.findOne();
    } catch (err) {
      nxt(err);
    }
  },

  upload: async (req, res, nxt) => {
    console.log('POST on /user/:username/achieves');
    // works with 'multipart/form-data'
    // if (!req.files) return res.status(204).send('no file uploaded');
    // const userImg = req.files.userImg;
    // const path = `./uploads/images/${userImg.name}`;
    // userImg.mv(path);
    // const update = await User.updateOne(
    //   {username: req.body.username},
    //   {img: path}
    // );
    // if (!update.modifiedCount) return res.status(304).send('user not updated');
    // res.send({message: 'profile image uploaded'});
  },
};
