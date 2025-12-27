const express = require('express');
const router = express.Router();
const { 
  getAllDestinations, 
  getDestinationById, 
  getNearbyDestinations 
} = require('../controllers/destinationController');

/**
 * @route   GET /api/destinations
 * @desc    Get all destinations
 * @access  Public
 */
router.get('/', getAllDestinations);

/**
 * @route   GET /api/destinations/nearby
 * @desc    Get nearby destinations (LBS)
 * @access  Public
 */
router.get('/nearby', getNearbyDestinations);

/**
 * @route   GET /api/destinations/:id
 * @desc    Get destination by ID
 * @access  Public
 */
router.get('/:id', getDestinationById);

module.exports = router;