const express = require('express');
const router = express.Router();
const { 
  createItinerary, 
  getTripItineraries, 
  getItineraryById, 
  updateItinerary, 
  deleteItinerary 
} = require('../controllers/itineraryController');
const authMiddleware = require('../middlewares/authMiddleware');

// All itinerary routes require authentication
router.use(authMiddleware);

/**
 * @route   POST /api/itineraries
 * @desc    Create new itinerary
 * @access  Private
 */
router.post('/', createItinerary);

/**
 * @route   GET /api/itineraries/trip/:tripId
 * @desc    Get all itineraries for a trip
 * @access  Private
 */
router.get('/trip/:tripId', getTripItineraries);

/**
 * @route   GET /api/itineraries/:id
 * @desc    Get itinerary by ID
 * @access  Private
 */
router.get('/:id', getItineraryById);

/**
 * @route   PUT /api/itineraries/:id
 * @desc    Update itinerary
 * @access  Private
 */
router.put('/:id', updateItinerary);

/**
 * @route   DELETE /api/itineraries/:id
 * @desc    Delete itinerary
 * @access  Private
 */
router.delete('/:id', deleteItinerary);

module.exports = router;