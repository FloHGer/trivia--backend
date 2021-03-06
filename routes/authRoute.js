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
router.get('/google/callback', authController.googleCallback);


// GitHub
router.get('/github', passport.authenticate('github'));
router.get('/github/callback', authController.githubCallback);


// DISCORD?!


// EMail / Token
router.route('/email')
  .post(authController.loginRequest)
  .get(passport.authenticate('token'), authController.emailCallback);


// EXPORT
module.exports = router;
