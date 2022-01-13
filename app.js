const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const auth = require('./common/auth.js');
const authRouter = require('./routes/authRoute.js');
const userRouter = require('./routes/userRoute.js');
const {errorController, HttpError} = require('./errors/errorController.js');
const feedbackController = require('./controller/feedbackController.js');


// Server Start
const app = express();


// Database Connection
mongoose.connect(process.env.DB_CONNECT);
mongoose.connection
  .on('error', (err) => console.error(err))
  .on('connecting', () => {
    console.log('DB connecting...');
  })
  .on('connected', () => {
    console.log('DB connected!');
  });


// Middleware
app.use(fileUpload({
  createParentPath: true,
}));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use('/auth', authRouter);

app.use('/user/:uid', auth.isLoggedIn, userRouter);

app.post('/feedback', feedbackController);

app.post('/upload', async(req, res, nxt) => {
   // works with "multipart/form-data"
  if(!req.files) return res.status(204).send('no file uploaded');
  const userImg = req.files.userImg;
  const path = `./uploads/images/${userImg.name}`;
  userImg.mv(path);
  const update = await User.updateOne({username: req.body.username}, {img: path});
  if(!update.modifiedCount) return res.status(304).send('user not updated');
  res.send({message: 'profile image uploaded'});

})

// Error Handling
app.use(errorController.routeError);
app.use(errorController.errorHandler);


// Server End
const port = process.env.PORT || 3003;
app.listen(port, () => console.log(`listening on PORT: ${port}`));



