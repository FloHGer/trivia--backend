module.exports = class HttpError extends Error {
  constructor (code, message) {
    super(message)
    this.code = code
  }
}


module.exports = errorController = {
  routeError: (req, res, nxt) => {
    nxt(new HttpError(404, 'We don\'t know where you wanna go!'));
  },
  
  errorHandler: (error, req, res, nxt) => {
    res.status(error.code || 500).send({
      error: {
        message: error.message || 'unknown Error',
      },
    });
  },
}


// if(res.headerSent) return nxt(error) // -> to be reviewed