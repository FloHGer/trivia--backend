const HttpError = require("../errors/errorHandler");

module.exports = loginController = {
   loginUser: (req, res, next) => {
      console.log("post on /login");
   },
   logoutUser: (req, res, next) => {
      console.log("post on /logout");
   },
   signupUser: (req, res, next) => {
      console.log("post on /signup");
   },
};
