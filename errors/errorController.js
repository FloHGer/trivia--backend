class HttpError extends Error {
  constructor (code, message) {
    super(message)
    this.code = code
  }
}


const errorController = {
  routeError: (req, res, nxt) => {
    nxt(new HttpError(404, 'We don\'t know where you wanna go!'));
  },
  
  errorHandler: (error, req, res, nxt) => {
    console.log(error);
    res.status(error.code || 500).send({
      error: {
        message: error.message || 'unknown Error',
      },
    });
  },
}

module.exports = {HttpError, errorController};

// if(res.headerSent) return nxt(error) // -> to be reviewed