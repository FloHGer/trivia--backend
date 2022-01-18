const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth20' ).Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const TokenStrategy = require('passport-accesstoken').Strategy;

const User = require('../schemas/userSchema.js');


// GOOGLE
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3003/auth/callback', // change to https later
  },
  async (accessToken, refreshToken, profile, done) => {
    let DBUser = await User.findOne({id: profile.id, provider: 'google'});
    if(DBUser) return done(null, DBUser.id);

    DBUser = await User.create({
      provider: profile.provider,
      username: profile.displayName,
      email: profile.emails[0].value,
      id: profile.id,
      dob: null,
      img: profile.photos[0].value,
    });
    if(DBUser) return done(null, DBUser.id);

    return done(err);
  }
));


// GITHUB
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:3003/auth/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
console.log('strat1')
    let DBUser = await User.findOne({id: profile.id, provider: 'github'});
    if(DBUser) return done(null, DBUser.id);

    DBUser = await User.create({
      provider: profile.provider,
      user: profile.username,
      email: null,
      id: profile.id,
      dob: null,
      img: profile.photos[0].value,
    });
    console.log('strat2')
    if(DBUser) return done(null, DBUser.id);

    return done(err);
  }
));


passport.use(new TokenStrategy({
    tokenField: 'token',
    callbackURL: 'http://localhost:3003/auth/callback',
  },
  async (token, done) => {
    console.log('token works')
    await User.findOne({token}, (err, user) => {
      if(err) return done(err);
      if(!user) return done(null, false);
      if(!user.verifyToken(token)) return done(null, false);
      return done(null, user);
    });
  }
));


passport.serializeUser((userID, done) => {
  return done(null, userID) // data for session
});

passport.deserializeUser(async(userID, done) => {
  const DBUser = await User.findOne({id: userID})
  if(!DBUser) return done(null, false);
  return done(null, DBUser);
});
