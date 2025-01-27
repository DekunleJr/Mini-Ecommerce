const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'Not authenticated.' });
  }

  const token = authHeader.split(' ')[1];
  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error('Token verification failed:', err);
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }

  if (!decodedToken) {
    return res.status(401).json({ message: 'Not authenticated.' });
  }

  req.userId = decodedToken.userId;
  req.isAdmin = decodedToken.isAdmin;

  console.log('Decoded Token:', decodedToken); // Debugging log
  next();
};

