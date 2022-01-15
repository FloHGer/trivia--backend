const router = require('express').Router();
const passport = require('passport');


const authController = require('../controller/authController.js');
require('../common/passport.js');



// LOGOUT
router.get('/logout', auth.isLoggedIn, authController.logoutUser);


// Google
router.get('/google', auth.isLoggedOut, passport.authenticate('google', {scope: ['profile', 'email']}));


// GitHub
router.get('/github', auth.isLoggedOut, passport.authenticate('github'));


// CALLBACK
router.get('/callback', authController.passportCallback);


// DISCORD?!


// EMail / Token
router.route('/email')
  .post(auth.isLoggedOut, authController.loginRequest)
  .get(auth.isLoggedOut, (req)=>console.log(req.query), passport.authenticate('token'));


// EXPORT
module.exports = router;
