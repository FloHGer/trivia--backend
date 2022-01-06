module.exports = router = require('express').Router();

const loginController = require('../controller/loginController.js');


// Google
router.get('/google', loginController.googleAuth);
router.get('/google/oauth', loginController.googleCallback);


// EMail / Token
router.post(loginController.loginRequest);
router.get('/:tid', loginController.verifyToken);
