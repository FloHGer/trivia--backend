const HttpError = require("../errors/errorHandler")

module.exports = userController = {
   getUser: (req, res, next) => {
      console.log("post on /login");
   },
   patchUser: (req, res, next) => {
      console.log("post on /logout");
   },
   deleteUser: (req, res, next) => {
      console.log("post on /signup");
   },
   getGames: (req, res, next) => {
      console.log("get on /games");
   },
   postGames: (req, res, next) => {
      console.log("post on /games");
   },
   getRanks: (req, res, next) => {
      console.log("get on /ranks");
   },
   getStatistics: (req, res, next) => {
      console.log("get on /stats");
   },
   getAchievements: (req, res, next) => {
      console.log("get on /achivs");
   },
   
};