const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth20' ).Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('../schemas/userSchema.js');


// GOOGLE
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3003/auth/google/callback', // change to https later
  },
  async (accessToken, refreshToken, profile, done) => {
    let DBUser = await User.findOne({id: profile.id, provider: 'google'});
    if(DBUser) return done(null, DBUser.id);

    DBUser = await User.create({
      provider: profile.provider,
      id: profile.id,
      username: profile.displayName,
      email: profile.emails[0].value,
      dob: null,
      img: profile.photos[0].value,
    });
    if(DBUser) return done(null, DBUser.id);

    return done(err, false);
  }
));


// GITHUB
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:3003/auth/github/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    let DBUser = await User.findOne({id: profile.id, provider: 'github'});
    if(DBUser) return done(null, DBUser.id); // data for serialize

    DBUser = await User.create({
      provider: profile.provider,
      id: profile.id,
      username: profile.username,
      email: null,
      dob: null,
      img: profile.photos[0].value,
    });
    if(DBUser) return done(null, DBUser.id); // data for serialize

    return done(err, false);
  }
));


// passport.use(new JwtStrategy(
//   {
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//     secretOrKey: process.env.JWTKEY,
//     issuer: process.env.EMAIL_ADD,
//     audience: 'trivia-ga.me',
//   },
//   (jwt_payload, done) => {
//     User.findOne({id: jwt_payload.sub, provider: 'local'}, function(err, user) {
//       if (err) return done(err, false);
//       if (user) return done(null, user);
//       return done(null, false);
//       // or you could create a new account
//     });
//   }
// ));


passport.serializeUser((userID, done) => {
  return done(null, userID) // data for session
});

passport.deserializeUser(async(userID, done) => {
  const DBUser = await User.findOne({id: userID})
  if(DBUser) return done(null, DBUser);
  if(!DBUser) return done(null, false);
});
