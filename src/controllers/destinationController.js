const { Destination } = require('../models');
const { success, notFound, badRequest } = require('../utils/response');
const { Op } = require('sequelize');

/**
 * Get all destinations
 */
const getAllDestinations = async (req, res, next) => {
  try {
    const { search, city } = req.query;

    const whereClause = {};

    if (search) {
      whereClause.name = { [Op.like]: `%${search}%` };
    }

    if (city) {
      whereClause.city = city;
    }

    const destinations = await Destination.findAll({
      where: whereClause,
      order: [['id', 'DESC']]
    });

    return success(res, destinations, 'Destinations retrieved successfully');

  } catch (error) {
    next(error);
  }
};

/**
 * Get destination by ID
 */
const getDestinationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const destination = await Destination.findByPk(id);

    if (!destination) {
      return notFound(res, 'Destination not found');
    }

    return success(res, destination, 'Destination retrieved successfully');

  } catch (error) {
    next(error);
  }
};

/**
 * Get nearby destinations (LBS - Location Based Service)
 */
const getNearbyDestinations = async (req, res, next) => {
  try {
    const { latitude, longitude, radius = 50 } = req.query;

    if (!latitude || !longitude) {
      return badRequest(res, 'Latitude and longitude are required');
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    const rad = parseFloat(radius);

    // Simple distance calculation using Haversine formula
    // This is a basic implementation - for production use PostGIS or similar
    const destinations = await Destination.findAll({
      where: {
        latitude: { [Op.not]: null },
        longitude: { [Op.not]: null }
      }
    });

    // Calculate distance for each destination
    const destinationsWithDistance = destinations.map(dest => {
      const destLat = parseFloat(dest.latitude);
      const destLon = parseFloat(dest.longitude);

      // Haversine formula
      const R = 6371; // Earth radius in km
      const dLat = (destLat - lat) * Math.PI / 180;
      const dLon = (destLon - lon) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat * Math.PI / 180) * Math.cos(destLat * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;

      return {
        ...dest.toJSON(),
        distance: Math.round(distance * 100) / 100 // Round to 2 decimal places
      };
    });

    // Filter by radius and sort by distance
    const nearbyDestinations = destinationsWithDistance
      .filter(dest => dest.distance <= rad)
      .sort((a, b) => a.distance - b.distance);

    return success(res, nearbyDestinations, 'Nearby destinations retrieved successfully');

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDestinations,
  getDestinationById,
  getNearbyDestinations
};