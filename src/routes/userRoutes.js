const express = require('express');
const router = express.Router();
const { updateProfile, changePassword } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authMiddleware, updateProfile);

/**
 * @route   PUT /api/users/password
 * @desc    Change password
 * @access  Private
 */
router.put('/password', authMiddleware, changePassword);

module.exports = router;