const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth20' ).Strategy;

const User = require('../schemas/userSchema.js');

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://localhost:3003/login/google/oauth',
  },
  (accessToken, refreshToken, profile, done) => {
    console.log('inside strat', profile);
    User.findOrCreate({ googleId: profile.id }, (err, user) =>  done(err, user));
  }
));


passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async(user, done) => {
  const foundUser = await User.findOne({if: user.id});
  if(foundUser) done(null, user);
});
