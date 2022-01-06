const HttpError = require('../errors/errorController.js');


module.exports = auth = (req, res, nxt) => req.user ? nxt() : nxt(new HttpError(401, 'not logged in'));