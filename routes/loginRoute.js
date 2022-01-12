const router = require('express').Router();
const passport = require('passport');


const loginController = require('../controller/loginController.js');
require('../common/passport.js');




router.get('/logout', auth.isLoggedIn, loginController.logoutUser);
router.post('/signup', auth.isLoggedOut, loginController.signupUser);


// Google
router.get('/google', auth.isLoggedOut, passport.authenticate('google', {scope: ['profile', 'email']}));


// GITHUB
router.get('/github', auth.isLoggedOut, passport.authenticate('github'));


// CALLBACK
router.get('/callback', loginController.passportCallback);


// DISCORD?!

// EMail / Token
// router.post('/', loginController.loginRequest);
// router.get('/:tid', loginController.verifyToken);


// EXPORT
module.exports = router;
