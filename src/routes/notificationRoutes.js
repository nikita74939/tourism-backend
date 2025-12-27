const express = require('express');
const router = express.Router();
const { 
  createNotification, 
  getUserNotifications, 
  getPendingNotifications, 
  markAsSent, 
  deleteNotification 
} = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');

// All notification routes require authentication
router.use(authMiddleware);

/**
 * @route   POST /api/notifications
 * @desc    Create new notification
 * @access  Private
 */
router.post('/', createNotification);

/**
 * @route   GET /api/notifications
 * @desc    Get all notifications for current user
 * @access  Private
 */
router.get('/', getUserNotifications);

/**
 * @route   GET /api/notifications/pending
 * @desc    Get pending notifications
 * @access  Private
 */
router.get('/pending', getPendingNotifications);

/**
 * @route   PATCH /api/notifications/:id/sent
 * @desc    Mark notification as sent
 * @access  Private
 */
router.patch('/:id/sent', markAsSent);

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Delete notification
 * @access  Private
 */
router.delete('/:id', deleteNotification);

module.exports = router;