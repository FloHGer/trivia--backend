const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const fileUpload = require('express-fileupload');
const cors = require('cors');
require('dotenv').config();

const auth = require('./common/auth.js');
const authRouter = require('./routes/authRoute.js');
const userRouter = require('./routes/userRoute.js');
const rankingRouter = require('./routes/rankingRoute.js');
const {errorController} = require('./errors/errorController.js');
const generalController = require('./controller/generalController.js');


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
app.use(cors());
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
app.use('/user', userRouter);
app.get('/stats', generalController.stats);
app.use('/ranks', rankingRouter);
app.post('/feedback', generalController.feedback);


// Error Handling
app.use(errorController.routeError);
app.use(errorController.errorHandler);


// Server End
const port = process.env.PORT || 3003;
app.listen(port, () => console.log(`listening on PORT: ${port}`));
