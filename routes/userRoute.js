const router = require('express').Router();

const userController = require('../controller/userController.js');
const calculate = require('../common/calculations.js');

router.route('/:username')
  .get(userController.getUser)
  .patch(userController.patchUser)
  .delete(userController.deleteUser);

router.route('/:username/games')
  .get(userController.getGames)
  .post(
    userController.postGame,
    calculate.stats,
    calculate.achievs,
  );

router.get('/:username/stats', userController.getStats);

router.get('/:username/ranks', userController.getRanks);

router.get('/:username/achiev', userController.getAchievs);

router.post('/:username/upload', userController.upload);

module.exports = router;
