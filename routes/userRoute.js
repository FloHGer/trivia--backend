const router = require('express').Router();

const userController = require('../controller/userController.js');
const statCalc = require('../common/calculations/statCalc.js');
const achievCalc = require('../common/calculations/achievCalc.js');
const rankCalc = require('../common/calculations/rankCalc.js');

router.route('/:username')
  .get(userController.getUser)
  .patch(userController.patchUser)
  .delete(userController.deleteUser);

router.route('/:username/games')
  .get(userController.getGames)
  .post(
    userController.postGame,
    statCalc,
    achievCalc,
    rankCalc,
  );

router.get('/:username/stats', userController.getStats);

router.get('/:username/ranks', userController.getRanks);

router.get('/:username/achievs', userController.getAchievs);

router.get('/:username/image', userController.getImage);

router.route('/:username/upload')
  .get(userController.deleteUpload)
  .post(userController.uploadImage);


module.exports = router;
