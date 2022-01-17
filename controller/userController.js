const {HttpError} = require('../errors/errorController.js');
const fs = require('fs');
const User = require('../schemas/userSchema.js');
const Game = require('../schemas/gameSchema.js');

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
      if (user.modifiedCount)
      if (req.body.updates.username)
        fs.rename(`./uploads/profileImages/${req.body.updates.username}.png`, `./uploads/profileImages/${req.params.username}.png`)
      return res.status(201).send({message: 'user successfully updated'});
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
      const deletion = fs.unlink(`./uploads/profileImages/${req.params.username}.png`);
      if(!deletion) return res.status(204).send({message: 'profile picture not deleted'});
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
      if(!stats) return res.status(204).send({message: 'Player Stats not found'});

      return res.send({message: 'success', payload: stats});
    } catch (err) {nxt(err)}
  },

  getRanks: async (req, res, nxt) => {
    console.log('GET on /user/:username/ranks');
    try {
      const ranks = await Ranks.findOne();
      if(!ranks) return res.status(204).send({message: 'Player Ranks not found'});
      return res.send({message: 'success', payload: ranks});
    } catch (err) {nxt(err)}
  },

  getAchievs: async (req, res, nxt) => {
    console.log('GET on /user/:username/achieves');
    try {
      const achievs = await User.findOne({username: req.params.username}, '-_id achievs');
      if(!achievs) return res.status(204).send({message: 'Player Achievements not found'});

      return res.send({message: 'success', payload: achievs});
    }catch(err) {nxt(err)}
  },

  upload: (req, res, nxt) => {
    console.log('POST on /user/:username/achieves');
    // works with 'multipart/form-data'
    if (!req.files) return res.status(204).send({message: 'no file uploaded'});
    if (req.files.userImg.size > 20 * 1024 * 1024) return res.status(204).send({message: 'file too big'});

    const userImg = req.files.userImg;
    userImg.name = `${req.params.username}.png`;
    const path = `./uploads/profileImages/${userImg.name}`;
    userImg.mv(path);

    res.send({message: 'profile image uploaded'});
  },
};
