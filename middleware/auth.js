const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.cookies.token;
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      res.status(401).json({
        status: 'Invalid Token'
      });
    }
    next();
  } catch (error) {
    res.status(401).json({
      status: 'Invalid Token'
    });
  }
};

module.exports = auth;