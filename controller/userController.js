const { HttpError } = require("../errors/errorController.js");
const User = require("../schemas/userSchema");

module.exports = userController = {
   getUser: async (req, res, nxt) => {
      console.log("GET on /user/:username/");
      try {
         const user = await User.findOne({ username: req.params.username });
         if (user) 
            return res.send(user);
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
            req.body
         );
         console.log(user, req.params);
         if (user.modifiedCount)
            return res.status(201).send("user successfully updated");
         if (!user.matchedCount)
            return res
               .status(204)
               .send("can't find the user you're looking for");
         if (!user.modifiedCount && user.matchedCount)
            return res.status(304).send("Not modified");
      } catch (err) {
         nxt(err);
      }
   },

   deleteUser: async (req, res, nxt) => {
      console.log("DELETE on /user/:username");
      try {
         const userToDelete = await User.deleteOne({
            username: req.params.username,
         });
         if (userToDelete.deletedCount)
            return res.send("user successfully deleted");

         return res
            .status(204)
            .send(
               "user can't be found and deleted. Please check your database!"
            );
      } catch (err) {
         nxt(err);
      }
   },

   getGames: async (req, res, nxt) => {
      console.log("GET on /games");
      try{  
         const game = await Game.findOne({username: req.params.username })

      } catch (err) {
         nxt(err)
      }
   },
   postGames: async(req, res, nxt) => {
      console.log("POST on /games");
      try{
         const game = await Game.updateOne()
      } catch (err) {
         nxt(err)
      }
   },
   getRanks: async (req, res, nxt) => {
      console.log("GET on /ranks");
      try{
         const ranking = await Ranking.findOne()
      } catch (err) {
         nxt(err)
      }
   },
   getStatistics: async (req, res, nxt) => {
      console.log("GET on /stats");
      try{
         const stats = await Stats.findOne()
      } catch (err) {
         nxt(err)
      }
   },
   getAchievements: async (req, res, nxt) => {
      console.log("GET on /achieves");
      try{
         const achievement = await Achievement.findOne();
      } catch (err) {
         nxt(err)
      }
   },
};
