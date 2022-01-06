module.exports = router = require('express').Router();

const userController = require('../controller/userController.js');

router
  .route('/')
  .get(userController.getUser)
  .patch(userController.patchUser)
  .delete(userController.deleteUser);

router
  .route('/games')
  .get(userController.getGames)
  .post(userController.postGames);

router.get('/ranks', userController.getRanks);

router.get('/stats', userController.getStatistics);

router.get('/achivs', userController.getAchievements);
