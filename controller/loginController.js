const {HttpError }= require("../errors/errorHandler");
const User = require('../schemas/userSchema')

module.exports = loginController = {
   loginUser: (req, res, next) => {
      console.log("post on /login");
   },
   logoutUser: (req, res, next) => {
      console.log("post on /logout");
   },
   signupUser: async (req, res, next) => {
      console.log("post on /signup");
      await User.create(req.body, (error, userDocument)=>{
         if (error) 
         return next(new HttpError(500, 'user not created'))
         res.send({message: 'new user created'})
      })
   },
};
