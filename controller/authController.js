const jwt = require('jsonwebtoken');
const passport = require('passport');

const {HttpError} = require('../errors/errorController.js');
const User = require('../schemas/userSchema');
const sendMail = require('../common/nodemailer.js');



module.exports = authController = {
  check: async(req, res, nxt) => {
    if(req.user) return res.send({message: 'success', payload: req.user.username});
    return res.send({message: 'not logged in'});
  },


  loginRequest: async (req, res, nxt) => {
    console.log('POST on /auth/mail');
    try {
      // check for user
      let DBUser = await User.findOne({email: req.body.email});
      // create user if unregistered
      if (!DBUser) {
        DBUser = await User.create({
          username: req.body.email.slice(0, req.body.email.indexOf('@')),
          email: req.body.email,
          img: `${process.env.CALLBACK}/default.png`,
        });
        if(!DBUser) return nxt(new HttpError(500, 'user not created'));
      }

      // create token and add it to the user
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
          link: `https://${req.headers.host}/auth/email/?token=${token}`,
        },
      });
      if(status) return res.send({message: status});
    } catch (err) {nxt(err);}
  },


  emailCallback: passport.authenticate('token', {
    successRedirect: `${process.env.FRONTEND}`,
    successMessage: `SUCCESS: date: ${(new Date()).toLocaleDateString('de-de')} -- time: ${(new Date()).toLocaleTimeString('de-de')}`,
    failureRedirect: `${process.env.FRONTEND}`,
    failureMessage: `FAIL: date: ${(new Date()).toLocaleDateString('de-de')} -- time: ${(new Date()).toLocaleTimeString('de-de')}`,
  }),

  googleCallback: passport.authenticate('google', {
    successRedirect: `${process.env.FRONTEND}`,
    successMessage: `SUCCESS: date: ${(new Date()).toLocaleDateString('de-de')} -- time: ${(new Date()).toLocaleTimeString('de-de')}`,
    failureRedirect: `${process.env.FRONTEND}`,
    failureMessage: `FAIL: date: ${(new Date()).toLocaleDateString('de-de')} -- time: ${(new Date()).toLocaleTimeString('de-de')}`,
  }),

  githubCallback: passport.authenticate('github', {
    successRedirect: `${process.env.FRONTEND}`,
    successMessage: `SUCCESS: date: ${(new Date()).toLocaleDateString('de-de')} -- time: ${(new Date()).toLocaleTimeString('de-de')}`,
    failureRedirect: `${process.env.FRONTEND}`,
    failureMessage: `FAIL: date: ${(new Date()).toLocaleDateString('de-de')} -- time: ${(new Date()).toLocaleTimeString('de-de')}`,
  }),


  logoutUser: (req, res, nxt) => {
    console.log('GET on /auth/logout');
    req.session.destroy();
    res.send({message: 'logged out'});
  },

};
