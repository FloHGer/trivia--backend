<<<<<<< HEAD
const { HttpError } = require("../errors/errorHandler");
const User = require("../schemas/userSchema");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const os = require('os')

module.exports = loginController = {
   loginUser: async (req, res, next) => {
      try {
         console.log("post on /login", os.hostname(), req.headers.host);

         // checking user by email
         const userDoesExist = await User.findOne({ email: req.body.email });
         if (!userDoesExist)
            return next(new HttpError(500, "user does not exist"));

         // creating token if user exists
         const token = jwt.sign(
            { email: userDoesExist.email },
            process.env.JWTKEY
         );
            
         // Token speichern und hashen mit bcrypt
         // gehashtes Token raussenden per email an user
         
         // create reusable transporter object using the default SMTP transport
         let transporter = nodemailer.createTransport({
            host: "smtp.mail.yahoo.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
               user: process.env.EMAILADD, // generated yahoo user
               pass: process.env.EMAILPASS, // generated yahoo password
            },
            tls:{
               rejectUnauthorized:false
            }
         });
         
         // creating an output for the content of the email
         const emailOutput = `
         <h3>Hello ${req.body.username},</h3>
         <p>We've just created your account and use this token to keep you logged in for 30 days</p>
         <a href=${req.headers.host}/login/${token}>Click me to login</a>
         `;

         // send mail with defined transport object
         let info = await transporter.sendMail({
            from: `"TRIVIA" <${process.env.EMAILADD}>`, // sender address
            to: `${req.body.email}`, // list of receivers
            subject: "Hello from TRIVIA", // Subject line
            text: `Hello ${req.body.username}`, // plain text body
            html: emailOutput, // html body
         });

         console.log("Message sent:", info);

         res.send({ message: "user found and token sent", token });
      } catch (error) {
         next(error);
      }
   },

   verifyToken: (req, res, next) => {
      console.log('get on /verifyToken');
      // token aus der Email vergleichen mit unserem ServerToken 
      // wenn erfolgreich "Session" erstellen (create loginState)
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
=======
const jwt = require('jsonwebtoken');
const passport = require('passport');

const {HttpError} = require('../errors/errorController.js');
const User = require('../schemas/userSchema');
const sendMail = require('../common/nodemailer.js');
require('../common/googleAuth.js');


module.exports = loginController = {
  loginRequest: async (req, res, nxt) => {
    console.log('POST on /login');
    try {
      // check user by email
      const foundUser = await User.findOne({email: req.body.email});
      console.log('found', foundUser)
      if (!foundUser) return nxt(new HttpError(500, `${req.body.email} does not exist`));

      // create token if user exists
      const token = jwt.sign({email: foundUser.email}, process.env.JWTKEY, {expiresIn: 5 * 60});
      const update = await User.updateOne({email: req.body.email}, {token});
      if(!update.modifiedCount) return nxt(new HttpError(500, 'couldn\'t update user'));

      // send mail with token for login
      const status = sendMail({
        recipient: foundUser.email,
        subject: 'TRIVIA Game - LogIn requested',
        username: foundUser.username,
        link: `http://${req.headers.host}/login/${token}`, // change to https later
      });
      console.log('final', await User.findOne({token: token}));
      if(status) return res.send(status);
    } catch (err) {nxt(err);}
  },


  verifyToken: async (req, res, nxt) => {
    console.log('GET on /login/:tid');
    try{
    const tokenCheck = jwt.verify(req.params.tid, process.env.JWTKEY);
    const foundUser = await User.findOne({token: req.params.tid});

    if(foundUser && tokenCheck && foundUser.email === tokenCheck.email){
      console.log('success'); // create session here
      return res.send({message: 'login successful', sid: 'PUT SESSION ID HERE!!!'});
    }
    return nxt(new HttpError(404, 'couldn\'t verify'));
    }catch(err){nxt(err)}
  },


  googleAuth: (req, res, nxt) => {
    console.log('GET on /login/google');
    passport.authenticate('google', {scope: ['email', 'profile']})
    res.send('works')
  },


  googleCallback: (req, res, nxt) => {
    console.log('GET on /login/google/oauth');
    passport.authenticate('google', {
      successRedirect: '/',
      failureRedirect: '/login',
    })
  },


  logoutUser: (req, res, nxt) => {
    console.log('POST on /logout');
    req.logout();
    req.session.destroy();
    res.send('logged out');
  },


  signupUser: async (req, res, nxt) => {
    try {
      console.log('POST on /signup');
      await User.create(req.body, (error, userDocument) => {
        if (error) return nxt(new HttpError(500, 'user not created'));

        if(userDocument) console.log('success') // create session here

        res.send({message: 'new user created', sid: 'PUT SESSION ID HERE!!!'});
      });
    } catch (err) {nxt(err);}
  },
};
>>>>>>> floh
