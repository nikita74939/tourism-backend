const { Trip, Destination, Itinerary } = require('../models');
const { success, created, badRequest, notFound } = require('../utils/response');
const { Op } = require('sequelize');

/**
 * Create new trip
 */
const createTrip = async (req, res, next) => {
  try {
    const { destination_id, start_date, end_date } = req.body;

    if (!destination_id || !start_date || !end_date) {
      return badRequest(res, 'Destination, start date, and end date are required');
    }

    // Validate dates
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    if (startDate >= endDate) {
      return badRequest(res, 'End date must be after start date');
    }

    // Check if destination exists
    const destination = await Destination.findByPk(destination_id);
    if (!destination) {
      return notFound(res, 'Destination not found');
    }

    const trip = await Trip.create({
      user_id: req.userId,
      destination_id,
      start_date,
      end_date
    });

    // Load destination data
    await trip.reload({ include: [Destination] });

    return created(res, trip, 'Trip created successfully');

  } catch (error) {
    next(error);
  }
};

/**
 * Get all trips for current user
 */
const getUserTrips = async (req, res, next) => {
  try {
    const { status } = req.query; // upcoming, ongoing, past

    const whereClause = { user_id: req.userId };
    const now = new Date();

    if (status === 'upcoming') {
      whereClause.start_date = { [Op.gt]: now };
    } else if (status === 'ongoing') {
      whereClause.start_date = { [Op.lte]: now };
      whereClause.end_date = { [Op.gte]: now };
    } else if (status === 'past') {
      whereClause.end_date = { [Op.lt]: now };
    }

    const trips = await Trip.findAll({
      where: whereClause,
      include: [
        {
          model: Destination,
          attributes: ['id', 'name', 'city', 'image_url']
        }
      ],
      order: [['start_date', 'DESC']]
    });

    return success(res, trips, 'Trips retrieved successfully');

  } catch (error) {
    next(error);
  }
};

/**
 * Get trip by ID
 */
const getTripById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const trip = await Trip.findOne({
      where: { id, user_id: req.userId },
      include: [
        {
          model: Destination,
          attributes: ['id', 'name', 'city', 'description', 'image_url', 'latitude', 'longitude']
        },
        {
          model: Itinerary,
          order: [['activity_time', 'ASC']]
        }
      ]
    });

    if (!trip) {
      return notFound(res, 'Trip not found');
    }

    return success(res, trip, 'Trip retrieved successfully');

  } catch (error) {
    next(error);
  }
};

/**
 * Update trip
 */
const updateTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { start_date, end_date } = req.body;

    const trip = await Trip.findOne({
      where: { id, user_id: req.userId }
    });

    if (!trip) {
      return notFound(res, 'Trip not found');
    }

    if (start_date) {
      const startDate = new Date(start_date);
      const endDate = end_date ? new Date(end_date) : trip.end_date;

      if (startDate >= endDate) {
        return badRequest(res, 'End date must be after start date');
      }

      trip.start_date = start_date;
    }

    if (end_date) {
      const endDate = new Date(end_date);
      const startDate = start_date ? new Date(start_date) : trip.start_date;

      if (startDate >= endDate) {
        return badRequest(res, 'End date must be after start date');
      }

      trip.end_date = end_date;
    }

    await trip.save();
    await trip.reload({ include: [Destination] });

    return success(res, trip, 'Trip updated successfully');

  } catch (error) {
    next(error);
  }
};

/**
 * Delete trip
 */
const deleteTrip = async (req, res, next) => {
  try {
    const { id } = req.params;

    const trip = await Trip.findOne({
      where: { id, user_id: req.userId }
    });

    if (!trip) {
      return notFound(res, 'Trip not found');
    }

    await trip.destroy();

    return success(res, null, 'Trip deleted successfully');

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTrip,
  getUserTrips,
  getTripById,
  updateTrip,
  deleteTrip
};