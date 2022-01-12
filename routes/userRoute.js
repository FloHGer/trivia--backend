const router = require('express').Router();

const userController = require('../controller/userController.js');

router
  .route('/:username')
  .get(userController.getUser)
  .patch(userController.patchUser)
  .delete(userController.deleteUser);

router
  .route('/:uid/games')
  .get(userController.getGames)
  .post(userController.postGames);

router.get("/:uid/ranks", userController.getRanks);

router.get("/:uid/stats", userController.getStatistics);

router.get("/:uid/achivs", userController.getAchievements);

module.exports = router;