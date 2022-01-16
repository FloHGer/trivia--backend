const {HttpError} = require('../errors/errorController.js');
const User = require('../schemas/userSchema.js');
const Game = require('../schemas/gameSchema.js');
const calculate = require('../common/calculations.js');

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
      if(!user) res.status(204).send({message: 'user not created'});
      const game = await Game.create({
        user: user._id,
        datePlayed: Date.now(),
        score: req.body.score,
        categories: req.body.categories,
      });
      if(!game) res.status(204).send({message: 'game not created'});

      res.game = game;

      nxt();
    } catch (err) {
      nxt(err);
    }
  },

  getStats: async (req, res, nxt) => {
    console.log('GET on /user/:username/stats');
    try {
      const stats = await User.findOne({username: req.params.username}, '-_id stats');
      if(!stats) return res.status(204).send({message: 'PlayerStats not found'});
      return res.send({message: 'success', payload: stats});
    } catch (err) {
      nxt(err);
    }
  },

  getRanks: async (req, res, nxt) => {
    console.log('GET on /user/:username/ranks');
    try {
      const ranks = await Ranks.findOne();
      if(!ranks) return res.status(204).send({message: 'Playerranks not found'});
      return res.send({message: 'success', payload: ranks});
    } catch (err) {
      nxt(err);
    }
  },

  getAchievs: async (req, res, nxt) => {
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
