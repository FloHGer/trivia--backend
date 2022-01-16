const router = require('express').Router();

const rankingController = require('../controller/rankingController.js');


router.get('/highscore', rankingController.highscore);

module.exports = router;
