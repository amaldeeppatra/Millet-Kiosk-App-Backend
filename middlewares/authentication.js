const jwt = require('jsonwebtoken');
require('dotenv').config();

const isAuthenticated = (req, res, next) => {
  // Get the token from cookies (assuming you use cookie-parser)
  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).json({ error: 'You must be signed in to access this resource.' });
  }
  try {
    // Verify the token. If valid, attach the payload to req.user
    const payload = jwt.verify(token, process.env.jwtsecretkey);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token, please sign in again.' });
  }
};

module.exports = isAuthenticated;