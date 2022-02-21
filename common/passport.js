const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth20' ).Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const { UniqueTokenStrategy } = require('passport-unique-token');

const jwt = require('jsonwebtoken');

const User = require('../schemas/userSchema.js');


// GOOGLE
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.CALLBACK}/auth/google/callback`,
  },
  async (accessToken, refreshToken, profile, done) => {
    const DBUserFound = await User.findOne({email: profile.emails[0].value});
    if(DBUserFound){
      if(!DBUserFound.googleId) await User.updateOne(
        {googleId: profile.id}
      )
      return done(null, DBUserFound.email);
    }

    const DBUserCreated = await User.create({
      username: profile.displayName.replaceAll(' ', '_'),
      email: profile.emails[0].value,
      googleId: profile.id,
      img: profile.photos[0].value,
    });
    if(DBUserCreated) return done(null, DBUserCreated.email);

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
    const DBUserFound = await User.findOne({email: profile.emails[0].value});
    if(DBUserFound){
      if(!DBUserFound.githubId) await User.updateOne(
        {githubId: profile.id}
      )
      return done(null, DBUserFound.email);
    }

    const DBUserCreated = await User.create({
      username: profile.username,
      email: profile.emails[0].value,
      githubId: profile.id,
      img: profile.photos[0].value,
    });
    if(DBUserCreated) return done(null, DBUserCreated.email);

    return done(err);
  }
));


// EMAIL
passport.use(new UniqueTokenStrategy({tokenQuery: 'token'}, (token, done) => {
    User.findOne({token}, (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false);
      jwt.verify(token, process.env.JWTKEY, (err, decoded) => {
        if (err) return done(err);
        if (!decoded) return done(null, false);
        return done(null, user.email);
      })
    });
  }),
);


passport.serializeUser((email, done) => {
  return done(null, email);
});

passport.deserializeUser(async(email, done) => {
  const DBUser = await User.findOne({email});
  if(!DBUser) return done(null, false);
  return done(null, DBUser);
});

