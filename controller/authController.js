const jwt = require('jsonwebtoken');
const passport = require('passport');

const {HttpError} = require('../errors/errorController.js');
const User = require('../schemas/userSchema');
const sendMail = require('../common/nodemailer.js');



module.exports = authController = {
  loginRequest: async (req, res, nxt) => {
    console.log('POST on /auth/mail');
    try {
      // check for user
      let DBUser = await User.findOne({email: req.body.email});
      if (!DBUser) {
        // create user if unregistered
        DBUser = await User.create({
          provider: 'email',
          username: req.body.email,
          email: req.body.email,
          id: null,
          dob: null,
          nat: null,
          img: null,
        });
        if(!DBUser) return nxt(new HttpError(500, 'user not created'));
      }

      // create and add token to user
      const token = jwt.sign({email: DBUser.email}, process.env.JWTKEY, {expiresIn: 5 * 60});
      const update = await User.updateOne({email: req.body.email}, {token});
      if(!update.modifiedCount) return nxt(new HttpError(500, 'user not updated'));

      // send mail with token for login
      const status = await sendMail({
        purpose: 'login',
        recipient: DBUser.email,
        subject: 'TRIVIA Game - LogIn requested',
        body: {
          username: DBUser.username !== DBUser.email ? DBUser.username : 'new user',
          link: `http://${req.headers.host}/auth/email/?token=${token}`, // change to https later
        },
      });
      if(status) return res.send(status);
    } catch (err) {nxt(err);}
  },


  // verifyToken: async (req, res, nxt) => {
  //   console.log('GET on /auth/:tid');
  //   try{
  //   const tokenCheck = jwt.verify(req.params.tid, process.env.JWTKEY);
  //   const foundUser = await User.findOne({token: req.params.tid});

  //   if(foundUser && tokenCheck && foundUser.email === tokenCheck.email){
  //     console.log('success'); // create session here
  //     return res.send({message: 'login successful', sid: 'PUT SESSION ID HERE!!!'});
  //   }
  //   return nxt(new HttpError(404, 'couldn\'t verify'));
  //   }catch(err){nxt(err)}
  // },

  test: async(req, res, nxt) => {
    console.log('message')
  },

  passportCallback: passport.authenticate(['google', 'github'], {
    successRedirect: '/dashboard',
    successMessage: 'login successful',
    failureRedirect: '/auth',
    failureMessage: 'login failed',
  }),


  logoutUser: (req, res, nxt) => {
    console.log('POST on /auth/logout');
    req.logout();
    req.session.destroy();
    res.redirect('/');
  },

};
