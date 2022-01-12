const { HttpError } = require("../errors/errorController.js");
const User = require("../schemas/userSchema");

module.exports = userController = {
   getUser: async (req, res, nxt) => {
      console.log("GET on /user/:username/");
      try {
         const user = await User.findOne({ username: req.params.username });

         if (user) return res.send(user);
         return nxt(new HttpError(504, "User does not exist"));
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
            return nxt(
               new HttpError(404, "can't find the user you're looking for")
            );
         if (!user.modifiedCount && user.matchedCount)
            return nxt(new HttpError(504, "Everything is up to date already"));
         return nxt(new HttpError(504, "this user was not found"));
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

         return nxt(
            new HttpError(
               504,
               "user can't be found and deleted. Please check your database!"
            )
         );
      } catch (err) {
         nxt(err);
      }
   },

   getGames: (req, res, nxt) => {
      console.log("GET on /games");
   },
   postGames: (req, res, nxt) => {
      console.log("POST on /games");
   },
   getRanks: (req, res, nxt) => {
      console.log("GET on /ranks");
   },
   getStatistics: (req, res, nxt) => {
      console.log("GET on /stats");
   },
   getAchievements: (req, res, nxt) => {
      console.log("GET on /achivs");
   },
};
