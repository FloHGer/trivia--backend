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
