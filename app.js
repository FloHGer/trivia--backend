<<<<<<< Updated upstream
const app = require('express')();

app.use((req, res) => res.send('<h1>TRIVIA GAME backend</h1>'));

=======
// Imports
const mongoose = require('mongoose');
const express = require('express');
require('dotenv').config();

const loginController = require('./controller/loginController.js');
const userRouter = require('./routes/userRoute.js');
const HttpError, errorController = require('./errors/errorController.js');


// Server Start
const app = express();

//Database Connection
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

// Routes
app.post('/login', loginController.loginRequest);
app.get('/login/:tid', loginController.verifyToken);
app.post('/logout', loginController.logoutUser);
app.post('/signup', loginController.signupUser);

app.use('/user/:uid', userRouter);

// Error Handling
app.use(errorController.routeError);
// if(res.headerSent) return next(error)
app.use(errorController.errorHandler);

// Server End
>>>>>>> Stashed changes
const port = process.env.PORT || 3003;
app.listen(port, () => console.log(`listening on PORT: ${port}`));
