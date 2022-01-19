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
        achievs.gamesPlayed.unlocked.push(Date.now());
        newAchievs.push(`${achievValues.gamesPlayed[i]} Games played!`);
      };
      if(achievs.gamesPlayed.unlocked.length < 3 
      && achievs.gamesPlayed.unlocked.length === i)
        achievs.gamesPlayed.next = achievValues.gamesPlayed[i] - stats.gamesPlayed;

      if(stats.answers.correct >= achievValues.correctAnswers[i]
      && achievs.correctAnswers.unlocked.length === i) {
        achievs.correctAnswers.unlocked.push(Date.now());
        newAchievs.push(`${achievValues.correctAnswers[i]} correct answers!`);
      };
      if(achievs.correctAnswers.unlocked.length < 3 
      && achievs.correctAnswers.unlocked.length === i)
        achievs.correctAnswers.next = achievValues.correctAnswers[i] - stats.answers.correct;

      if(stats.score.high >= achievValues.highScore[i]
      && achievs.score.high.unlocked.length === i) {
        achievs.score.high.unlocked.push(Date.now());
        newAchievs.push(`HIGHSCORE of ${achievValues.highScore[i]}!`);
      };
      if(achievs.score.high.unlocked.length < 3 
      && achievs.score.high.unlocked.length === i)
        achievs.score.high.next = achievValues.highScore[i] - stats.score.high;

      if(stats.score.total >= achievValues.totalScore[i]
      && achievs.score.total.unlocked.length === i) {
        achievs.score.total.unlocked.push(Date.now());
        newAchievs.push(`Total score of ${achievValues.totalScore[i]}!`);
      };
      if(achievs.score.total.unlocked.length < 3 
      && achievs.score.total.unlocked.length === i)
        achievs.score.total.next = achievValues.totalScore[i] - stats.score.total;

      if(stats.completedCategories.total >= achievValues.completedCategoriesTotal[i]
      && achievs.completedCategories.total.unlocked.length === i) {
        achievs.completedCategories.total.unlocked.push(Date.now());
        newAchievs.push(`${achievValues.completedCategoriesTotal[i]} completed categories!`);
      };
      if(achievs.completedCategories.total.unlocked.length < 3 
      && achievs.completedCategories.total.unlocked.length === i)
        achievs.completedCategories.total.next = achievValues.completedCategoriesTotal[i] - stats.completedCategories.total;
    };

    for(let i = 0; i < 6; i++){
      if(stats.completedCategories.max >= i + 1
      && achievs.completedCategories.max.unlocked.length === i) {
        achievs.completedCategories.max.unlocked.push(Date.now());
        newAchievs.push(`${achievValues.completedCategoriesMax[i]} ${i === 0 ? 'category' : 'categories'} completed in one game!`);
      };
      if(achievs.completedCategories.max.unlocked.length < 6 
        && achievs.completedCategories.max.unlocked.length === i)
      achievs.completedCategories.max.next = achievValues.completedCategoriesMax[i] - stats.completedCategories.max;
    };

    if(achievs.all === false
      && achievs.gamesPlayed.unlocked.length === 3
      && achievs.correctAnswers.unlocked.length === 3
      && achievs.score.high.unlocked.length === 3
      && achievs.score.total.unlocked.length === 3
      && achievs.completedCategories.max.unlocked.length === 6
      && achievs.completedCategories.total.unlocked.length === 3
    ){
      achievs.all.unlocked = Date.now();
      newAchievs.push('ALL Achievements!');
    };

    const update = await User.updateOne({username: req.params.username}, {achievs});
    if(!update.matchedCount) return res.status(204).send({message: 'user not found'});

    res.newAchievs = newAchievs;

    nxt();
  }catch(err){nxt(err)}
}