const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) {
    return res
      .status(401)
      .json({ msg: 'Authorization denied because there was no token' });
  }

  try {
    const decodedToken = jwt.verify(token, config.get('jwtPass'));
    req.user = decodedToken.user;
    next();
  } catch (e) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
