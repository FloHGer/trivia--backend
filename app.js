const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
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


// Server Start
const app = express();

const store = new MongoDBStore({
  uri: process.env.DB_CONNECT,
  collection: 'sessions',
});
store.on('error', (err) => console.error(err));


// Middleware
app.use(cors({
  origin: '*',
  // origin: ['https://localhost:3000', 'https://trivia-ga.me', process.env.FRONTEND],
  methods: '*',
  header: '*',
  credentials: true,
}));
app.use(express.static('uploads'))
app.use(fileUpload({
  createParentPath: true,
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30 // 30days
  },
  store,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.get('/', (req, res) => res.send('<h1>HI</h1>'))
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
