const HttpError = require('../errors/errorController.js')

module.exports = userController = {
   getUser: (req, res, nxt) => {
      console.log('post on /login');
   },
   patchUser: (req, res, nxt) => {
      console.log('post on /logout');
   },
   deleteUser: (req, res, nxt) => {
      console.log('post on /signup');
   },
   getGames: (req, res, nxt) => {
      console.log('get on /games');
   },
   postGames: (req, res, nxt) => {
      console.log('post on /games');
   },
   getRanks: (req, res, nxt) => {
      console.log('get on /ranks');
   },
   getStatistics: (req, res, nxt) => {
      console.log('get on /stats');
   },
   getAchievements: (req, res, nxt) => {
      console.log('get on /achivs');
   },
   
};