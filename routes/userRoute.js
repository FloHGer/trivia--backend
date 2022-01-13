const router = require('express').Router();

const userController = require('../controller/userController.js');

router
  .route('/:username')
  .get(userController.getUser)
  .patch(userController.patchUser)
  .delete(userController.deleteUser);

router
  .route('/:username/games')
  .get(userController.getGames)
  .post(userController.postGames);

router.get("/:username/ranks", userController.getRanks);

router.get("/:username/stats", userController.getStatistics);

router.get("/:username/achivs", userController.getAchievements);

module.exports = router;