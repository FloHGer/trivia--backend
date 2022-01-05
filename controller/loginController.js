const { HttpError } = require("../errors/errorHandler");
const User = require("../schemas/userSchema");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

module.exports = loginController = {
   loginUser: async (req, res, next) => {
      try {
         console.log("post on /login");
         const userDoesExist = await User.findOne({email: req.body.email});
         if (!userDoesExist) 
            return next(new HttpError(500, 'user does not exist'));
         const token = jwt.sign({email: userDoesExist.email}, process.env.JWTKEY);
         res.send({message: 'user found and token sent', token})
      } catch (error) {
         next(error);
      }
   },
   logoutUser: (req, res, next) => {
      console.log("post on /logout");
   },
   signupUser: async (req, res, next) => {
      try {
         console.log("post on /signup");
         await User.create(req.body, (error, userDocument) => {
            if (error) return next(new HttpError(500, "user not created"));
            res.send({ message: "new user created" });
         });
      } catch (error) {
         next(error);
      }
   },
};


//nodemailer