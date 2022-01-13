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
router.post('/mail', auth.isLoggedOut, authController.loginRequest);
router.get('/mail/:tid', auth.isLoggedOut, passport.authenticate('token'));
// router.get('/mail/:tid', auth.isLoggedOut, authController.verifyToken);


// EXPORT
module.exports = router;
