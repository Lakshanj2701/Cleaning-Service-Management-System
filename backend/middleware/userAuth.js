// JWT middleware to protect user routes — requires role: 'user' in token payload
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    return res.status(401).json({ message: 'Access denied. Please log in.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'user') {
      return res.status(403).json({ message: 'Not authorized as a user.' });
    }
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};
