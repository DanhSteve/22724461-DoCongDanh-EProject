const jwt = require("jsonwebtoken");
const config = require("../config");

/**
 * Middleware to verify the token
 */

module.exports = function (req, res, next) {
  const authHeader = req.header("authorization");

  // console.log(authHeader)
  if (!authHeader) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // Check if Bearer token
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  // Extract token (remove "Bearer " prefix)
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (e) {
    res.status(400).json({ message: "Token is not valid" });
  }
};
