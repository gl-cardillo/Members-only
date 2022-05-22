module.exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({msg: "You are not authorized"})
  }
}

module.exports.isMemeber = (req,res,next) => {
  if (req.isAuthenticated() && req.user.isMeber) {
    next()
  } else {
    res.status(401).json({msg: 'not member'})
  }
}

const authenticationMiddleware = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  } else {
    res.redirect('/login')
  }
}

module.exports = authenticationMiddleware