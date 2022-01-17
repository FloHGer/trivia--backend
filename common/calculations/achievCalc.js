const User = require('../../schemas/userSchema.js');


module.exports = async(req, res, nxt) => {
  try{
    const {stats, achievs} = await User.findOne({username: req.params.username}, '-_id stats achievs');
    const newAchievs = [];

    const achievValues = {
      gamesPlayed: [10, 100, 1000],
      correctAnswers: [100, 1000, 10000],
      highScore: [3000, 6000, 11111],
      totalScore: [100000, 500000, 1000000],
      completedCategoriesTotal: [100, 500, 1000],
      completedCategoriesMax: ['One', 'Two', 'Three', 'Four', 'Five', 'All'],
    }


    for(let i = 0; i < 3; i++) {
      if(stats.gamesPlayed === achievValues.gamesPlayed[i]) {
        achievs.gamesPlayed.push(Date.now());
        newAchievs.push(`${achievValues.gamesPlayed[i]} Games played!`);
      };

      if(stats.answers.correct >= achievValues.correctAnswers[i] && achievs.correctAnswers.length === i) {
        achievs.correctAnswers.push(Date.now());
        newAchievs.push(`${achievValues.correctAnswers[i]} correct answers!`);
      };

      if(stats.score.high >= achievValues.highScore[i] && achievs.highScore.length === i) {
        achievs.highScore.push(Date.now());
        newAchievs.push(`HIGHSCORE of ${achievValues.highScore[i]}!`);
      };

      if(stats.score.total >= achievValues.totalScore[i] && achievs.totalScore.length === i) {
        achievs.totalScore.push(Date.now());
        newAchievs.push(`Total score of ${achievValues.totalScore[i]}!`);
      };

      if(stats.completedCategories.total >= achievValues.completedCategoriesTotal[i] && achievs.completedCategoriesTotal.length === i) {
        achievs.completedCategoriesTotal.push(Date.now());
        newAchievs.push(`${achievValues.completedCategoriesTotal[i]} completed categories!`);
      };
    };

    for(let i = 0; i < 6; i++){
      if(stats.completedCategories.max >= i + 1 && achievs.completedCategoriesMax.length === i) {
        achievs.completedCategoriesMax.push(Date.now());
        newAchievs.push(`${achievValues.completedCategoriesMax[i]} ${i === 0 ? 'category' : 'categories'} completed in one game!`);
      };
    };

    if(achievs.all === false
      && achievs.gamesPlayed.length === 3
      && achievs.correctAnswers.length === 3
      && achievs.highScore.length === 3
      && achievs.totalScore.length === 3
      && achievs.completedCategoriesMax.length === 6
      && achievs.completedCategoriesTotal.length === 3
    ){
      achievs.all = true;
      newAchievs.push('ALL Achievements!');
    };

    const update = await User.updateOne({username: req.params.username}, {achievs});
    if(!update.matchedCount) return res.status(204).send({message: 'user not found'});

    res.newAchievs = newAchievs;

    nxt();
  }catch(err){nxt(err)}
}