const { HttpError } = require("../errors/errorController.js");
const User = require("../schemas/userSchema");
const Game = require("../schemas/gameSchema");
const Achievement = require("../schemas/achievementSchema");

module.exports = userController = {
   getUser: async (req, res, nxt) => {
      console.log("GET on /user/:username/");
      try {
         const user = await User.findOne({ username: req.params.username });
         if (user) return res.send(user);
         return res.status(204).send("User does not exist");
      } catch (err) {
         nxt(err);
      }
   },

   patchUser: async (req, res, nxt) => {
      console.log("PATCH on /user/:username");
      try {
         const user = await User.updateOne(
            { username: req.params.username },
            req.body.updates
         );
         if(!user.matchedCount)
            return res.status(204).send({message: "can't find the user you're looking for"});
         if(!user.modifiedCount && user.matchedCount)
            return res.status(304).send({message: "Not modified"});
         if(user.modifiedCount){
            return res.status(201).send({message: "user successfully updated"});}
      } catch (err) {
         nxt(err);
      }
   },

   deleteUser: async (req, res, nxt) => {
      console.log("DELETE on /user/:username");
      try {
         const user = await User.deleteOne({username: req.params.username});
         if (user.deletedCount)
            return res
               .status(204)
               .send({message: "user not deleted."});
         return res.send("user successfully deleted");

      } catch (err) {
         nxt(err);
      }
   },

   getGames: async (req, res, nxt) => {
      console.log("GET on /:username/games");
      try {
         const user = await User.findOne(
            { username: req.params.username },
            "-_id games"
         ).populate("games");
         res.send({ message: "success", payload: user.games });
      } catch (err) {
         nxt(err);
      }
   },

   postGame: async (req, res, nxt) => {
      console.log("POST on /user/:username/games");
      try {
         const user = await User.findOne({ username: req.params.username });
         const game = await Game.create({
            user: user._id,
            datePlayed: Date.now(),
            options: req.body.options, // needs to be an array
            score: req.body.score,
            categories: req.body.categories, // needs to be an object of objects
         });
         // USER update
         const update = await User.updateOne(
            { username: req.params.username },
            { $push: { games: game._id } }
         );
         // ACHIEVEMENTS update
         


         // RANKING update

         // STAT update

         res.send(update);
      } catch (err) {
         nxt(err);
      }
   },
   getRanks: async (req, res, nxt) => {
      console.log("GET on /ranks");
      try {
         const ranking = await Ranking.findOne();
      } catch (err) {
         nxt(err);
      }
   },
   getStatistics: async (req, res, nxt) => {
      console.log("GET on /stats");
      try {
         const stats = await Stats.findOne();
      } catch (err) {
         nxt(err);
      }
   },
   getAchievements: async (req, res, nxt) => {
      console.log("GET on /achieves");
      try {
         const achievement = await Achievement.findOne();
      } catch (err) {
         nxt(err);
      }
   },
};
