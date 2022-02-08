const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth20' ).Strategy;
const GitHubStrategy = require('passport-github2').Strategy;

const User = require('../schemas/userSchema.js');


// GOOGLE
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.CALLBACK}/auth/google/callback`,
  },
  async (accessToken, refreshToken, profile, done) => {
    const DBUserFound = await User.findOne({id: profile.id, provider: 'google'});
    if(DBUserFound) return done(null, DBUserFound.id);

    const DBUserCreated = await User.create({
      provider: profile.provider,
      username: profile.displayName.replaceAll(' ', '_'),
      email: profile.emails[0].value,
      id: profile.id,
      img: profile.photos[0].value,
    });
    if(DBUserCreated) return done(null, DBUserCreated.id);

    return done(err);
  }
));


// GITHUB
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.CALLBACK}/auth/github/callback`,
    scope: ["user:email"],
  },
  async (accessToken, refreshToken, profile, done) => {
    const DBUserFound = await User.findOne({id: profile.id, provider: 'github'});
    if(DBUserFound) return done(null, DBUserFound.id);

    const DBUserCreated = await User.create({
      provider: profile.provider,
      username: profile.username,
      id: profile.id,
      img: profile.photos[0].value,
      email: profile.emails[0].value,
    });
    if(DBUserCreated) return done(null, DBUserCreated.id);

    return done(err);
  }
));


// passport.use(new TokenStrategy({
//     tokenField: 'token',
//     callbackURL: 'https://triviagamebackend.herokuapp.com/auth/callback',
//   },
//   async (token, done) => {
//     console.log('token works')
//     await User.findOne({token}, (err, user) => {
//       if(err) return done(err);
//       if(!user) return done(null, false);
//       if(!user.verifyToken(token)) return done(null, false);
//       return done(null, user);
//     });
//   }
// ));


passport.serializeUser((userID, done) => {
  return done(null, userID);
});

passport.deserializeUser(async(userID, done) => {
  const DBUser = await User.findOne({id: userID});
  if(!DBUser) return done(null, false);
  return done(null, DBUser);
});
