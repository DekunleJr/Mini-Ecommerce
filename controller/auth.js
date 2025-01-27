const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');



exports.postSignup = async (req, res, next) => {
    try {
        const { name, email, password, isAdmin = false } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            isAdmin,
        });

        res.status(201).json({ message: 'User created successfully', userId: user.id });
    } catch (err) {
        next(err);
    }
};


exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Include isAdmin in the response
    res.status(200).json({
      token,
      userId: user.id,
      isAdmin: user.isAdmin, // Add this line
    });
  } catch (err) {
    next(err);
  }
};
