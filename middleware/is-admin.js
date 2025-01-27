module.exports = (req, res, next) => {
  console.log('Admin Check - isAdmin:', req.isAdmin);
  if (!req.userId || !req.isAdmin) {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};