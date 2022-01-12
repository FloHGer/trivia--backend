const {HttpError} = require('../errors/errorController.js')

module.exports = userController = {
   getUser: (req, res, nxt) => {
      console.log('GET on /user/:uid/');
      console.log(req)
      res.send(`profile of ${req.params}`)
   },
   patchUser: (req, res, nxt) => {
      console.log('POST on /logout');
   },
   deleteUser: (req, res, nxt) => {
      console.log('POST on /signup');
   },
   getGames: (req, res, nxt) => {
      console.log('GET on /games');
   },
   postGames: (req, res, nxt) => {
      console.log('POST on /games');
   },
   getRanks: (req, res, nxt) => {
      console.log('GET on /ranks');
   },
   getStatistics: (req, res, nxt) => {
      console.log('GET on /stats');
   },
   getAchievements: (req, res, nxt) => {
      console.log('GET on /achivs');
   },
};