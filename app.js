<<<<<<< HEAD
// Imports
const mongoose = require ('mongoose');
const express = require('express')
require('dotenv').config()
const loginController = require ('./controller/loginController')
const userRouter = require("./routes/userRoute");
const {routeError, errorHandler} = require ('./errors/errorHandler')

// console.log(errorHandler);
// Server Start
const app = express();

//Database Connection
mongoose.connect(process.env.DB_CONNECT)
mongoose.connection
 .on('error', console.error)
 .on('connecting', ()=>{
     console.log('Connecting to Database...')
 })
 .on('connected', ()=>{
     console.log('Database Connection established!');
 })



// Middleware
app.use(express.urlencoded({extended: true}))
app.use(express.json())

// Routes
// app.use((req, res) => res.send('<h1>TRIVIA GAME backend</h1>'));

app.post('/login', loginController.loginUser)
app.get('/login/:tid', loginController.verifyToken)
app.post("/logout", loginController.logoutUser);
app.post("/signup", loginController.signupUser);



app.use('/user/:uid', userRouter)


// Error Handling
app.use(routeError);
// if(res.headerSent) return next(error)
app.use(errorHandler)

=======
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
require('dotenv').config();

const loginRouter = require('./routes/loginRoute.js');
const userRouter = require('./routes/userRoute.js');
const loginController = require('./controller/loginController.js');
const {errorController} = require('./errors/errorController.js');


// Server Start
const app = express();

// Database Connection
mongoose.connect(process.env.DB_CONNECT);
mongoose.connection
  .on('error', console.error)
  .on('connecting', () => {
    console.log('DB connecting...');
  })
  .on('connected', () => {
    console.log('DB connected!');
  });

// Middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/login', loginRouter);
app.post('/logout', loginController.logoutUser);
app.post('/signup', loginController.signupUser);

app.use('/user/:uid', userRouter);

// Error Handling
app.use(errorController.routeError);
// if(res.headerSent) return next(error)
app.use(errorController.errorHandler);
>>>>>>> floh

// Server End
const port = process.env.PORT || 3003;
app.listen(port, () => console.log(`listening on PORT: ${port}`));
