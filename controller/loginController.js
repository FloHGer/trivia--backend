const {HttpError} = require('../errors/errorHandler');
const User = require('../schemas/userSchema');
const jwt = require('jsonwebtoken');

const sendMail = require('../common/nodemailer.js');

module.exports = loginController = {
  loginRequest: async (req, res, nxt) => {
    console.log('post on /login');
    try {
      // check user by email
      const foundUser = await User.findOne({email: req.body.email});
      if (!foundUser) return nxt(new HttpError(500, `${req.body.email} does not exist`));

      // create token if user exists
      const token = jwt.sign({email: foundUser.email}, process.env.JWTKEY, {expiresIn: 5 * 60});
      await User.updateOne({email: req.body.email}, {token});

      // send mail with token for login
      const status = sendMail({
        sender: process.env.EMAIL_ADD,
        recipient: foundUser.email,
        subject: 'TRIVIA Game - LogIn requested',
        username: foundUser.username,
        link: `${req.hostname}${token}`,
      });

      if(status) return res.send(status);
    } catch (err) {nxt(err);}
  },


  verifyToken: async (req, res, nxt) => {
    console.log('get on /verifyToken');
    const foundUser = await User.findOne({token: req.params.tid});
    if(foundUser) console.log('success'); // create session here

    res.send({message: 'login successful', sid: 'PUT SESSION ID HERE!!!'})
  },


  logoutUser: (req, res, nxt) => {
    console.log('post on /logout');
    // delete session here
  },


  signupUser: async (req, res, nxt) => {
    try {
      console.log('post on /signup');
      await User.create(req.body, (error, userDocument) => {
        if (error) return nxt(new HttpError(500, 'user not created'));

        if(userDocument) console.log('success') // create session here

        res.send({message: 'new user created', sid: 'PUT SESSION ID HERE!!!'});
      });
    } catch (err) {nxt(err);}
  },
};
