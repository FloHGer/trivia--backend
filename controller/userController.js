<<<<<<< HEAD
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
=======
const HttpError = require('../errors/errorController.js')

module.exports = userController = {
   getUser: (req, res, nxt) => {
      console.log('POST on /login');
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
>>>>>>> floh
   },
   
};