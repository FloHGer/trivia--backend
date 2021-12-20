class HttpError extends Error {
    constructor (code, message) {
        super(message)
        this.code = code
    }
}

// if(res.headerSent) return next(error) // -> to be reviewed


const routeError = (req, res, next) => {
   next(new HttpError(404, "We don't know where you wanna go!"));
};

const errorHandler = (error, req, res, next) => {
   res.status(error.code || 500).send({
      error: {
         message: error.message || "unknown Error",
      },
   });
};

module.exports = { routeError, errorHandler };