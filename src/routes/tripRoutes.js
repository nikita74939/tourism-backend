const express = require('express');
const router = express.Router();
const { 
  createTrip, 
  getUserTrips, 
  getTripById, 
  updateTrip, 
  deleteTrip 
} = require('../controllers/tripController');
const authMiddleware = require('../middlewares/authMiddleware');

// All trip routes require authentication
router.use(authMiddleware);

/**
 * @route   POST /api/trips
 * @desc    Create new trip
 * @access  Private
 */
router.post('/', createTrip);

/**
 * @route   GET /api/trips
 * @desc    Get all trips for current user
 * @access  Private
 */
router.get('/', getUserTrips);

/**
 * @route   GET /api/trips/:id
 * @desc    Get trip by ID
 * @access  Private
 */
router.get('/:id', getTripById);

/**
 * @route   PUT /api/trips/:id
 * @desc    Update trip
 * @access  Private
 */
router.put('/:id', updateTrip);

/**
 * @route   DELETE /api/trips/:id
 * @desc    Delete trip
 * @access  Private
 */
router.delete('/:id', deleteTrip);

module.exports = router;