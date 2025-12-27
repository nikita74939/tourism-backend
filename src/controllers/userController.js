const { User } = require('../models');
const { success, badRequest, notFound } = require('../utils/response');

/**
 * Update user profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (!name && !email) {
      return badRequest(res, 'At least one field (name or email) is required');
    }

    const user = await User.findByPk(req.userId);
    
    if (!user) {
      return notFound(res, 'User not found');
    }

    // Update fields
    if (name) user.name = name;
    if (email) {
      // Check if email is already taken
      const existingUser = await User.findOne({ 
        where: { email },
        attributes: ['id']
      });
      
      if (existingUser && existingUser.id !== req.userId) {
        return badRequest(res, 'Email already in use');
      }
      user.email = email;
    }

    await user.save();

    return success(res, user, 'Profile updated successfully');

  } catch (error) {
    next(error);
  }
};

/**
 * Change password
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return badRequest(res, 'Current password and new password are required');
    }

    if (newPassword.length < 6) {
      return badRequest(res, 'New password must be at least 6 characters');
    }

    const user = await User.findByPk(req.userId);

    // Verify current password
    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      return badRequest(res, 'Current password is incorrect');
    }

    // Update password
    user.password_hash = newPassword;
    await user.save();

    return success(res, null, 'Password changed successfully');

  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateProfile,
  changePassword
};