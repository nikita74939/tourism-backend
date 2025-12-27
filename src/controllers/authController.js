const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config/env');
const { success, created, badRequest, unauthorized } = require('../utils/response');

/**
 * Generate JWT token
 */
const generateToken = (userId) => {
  return jwt.sign({ userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });
};

/**
 * Register new user
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return badRequest(res, 'Name, email, and password are required');
    }

    if (password.length < 6) {
      return badRequest(res, 'Password must be at least 6 characters');
    }

    // Check if email exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return badRequest(res, 'Email already registered');
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password_hash: password
    });

    // Generate token
    const token = generateToken(user.id);

    return created(res, {
      user,
      token
    }, 'User registered successfully');

  } catch (error) {
    next(error);
  }
};

/**
 * Login user
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return badRequest(res, 'Email and password are required');
    }

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return unauthorized(res, 'Invalid email or password');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return unauthorized(res, 'Invalid email or password');
    }

    // Generate token
    const token = generateToken(user.id);

    return success(res, {
      user,
      token
    }, 'Login successful');

  } catch (error) {
    next(error);
  }
};

/**
 * Get current user profile
 */
const getProfile = async (req, res, next) => {
  try {
    return success(res, req.user, 'Profile retrieved successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile
};