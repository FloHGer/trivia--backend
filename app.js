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
// app.use((req, res, nxt) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', '*');
//   res.header('Access-Control-Allow-Headers', "Origin, x-Requested-With, Content-Type, Accept" );
//   nxt()
// })
app.use(cors());
// app.use(cors({
//   origin: 'https://localhost:3000',
//   methods: '*',
//   header: '*'
// }));
app.use(fileUpload({
  createParentPath: true,
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: false, // brauchen wir das?
}));
app.use(passport.initialize());
app.use(passport.session());


// Routes
app.get('/', () => <h1>TEST</h1>);
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
