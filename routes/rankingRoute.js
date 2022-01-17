const router = require('express').Router();

const rankingController = require('../controller/rankingController.js');


router.get('/highscore', rankingController.highScore);

router.get('/totalscore', rankingController.totalScore);

module.exports = router;
