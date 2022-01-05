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