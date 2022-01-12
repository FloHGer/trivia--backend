module.exports = auth = {
  isLoggedIn: (req, res, nxt) => req.isAuthenticated() ? nxt() : res.redirect('/'),
  isLoggedOut: (req, res, nxt) => !req.isAuthenticated() ? nxt() : res.redirect('/'),
}
