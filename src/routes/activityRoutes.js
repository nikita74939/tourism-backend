const express = require('express');
const router = express.Router();
const { 
  recordActivity, 
  getUserActivities, 
  getActivityStats 
} = require('../controllers/activityController');
const authMiddleware = require('../middlewares/authMiddleware');

// All activity routes require authentication
router.use(authMiddleware);

/**
 * @route   POST /api/activities
 * @desc    Record user activity from sensor
 * @access  Private
 */
router.post('/', recordActivity);

/**
 * @route   GET /api/activities
 * @desc    Get user activities
 * @access  Private
 */
router.get('/', getUserActivities);

/**
 * @route   GET /api/activities/stats
 * @desc    Get activity statistics
 * @access  Private
 */
router.get('/stats', getActivityStats);

module.exports = router;