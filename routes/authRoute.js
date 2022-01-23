const router = require('express').Router();
const passport = require('passport');


const authController = require('../controller/authController.js');
require('../common/passport.js');


// CHECK AUTH STATE
router.get('/check', authController.check);


// LOGOUT
router.get('/logout', authController.logoutUser);


// Google
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email']}));


// GitHub
router.get('/github', passport.authenticate('github'));


// CALLBACK
router.get('/callback', authController.passportCallback);


// DISCORD?!


// EMail / Token
router.route('/email')
  .post(authController.loginRequest)
  .get((req)=>console.log(req.query), passport.authenticate('token'));


// EXPORT
module.exports = router;
