const { Itinerary, Trip } = require('../models');
const { success, created, badRequest, notFound } = require('../utils/response');

/**
 * Create itinerary for a trip
 */
const createItinerary = async (req, res, next) => {
  try {
    const { trip_id, title, activity_time, notes } = req.body;

    if (!trip_id || !activity_time) {
      return badRequest(res, 'Trip ID and activity time are required');
    }

    // Check if trip exists and belongs to user
    const trip = await Trip.findOne({
      where: { id: trip_id, user_id: req.userId }
    });

    if (!trip) {
      return notFound(res, 'Trip not found');
    }

    // Validate activity time is within trip dates
    const activityTime = new Date(activity_time);
    const startDate = new Date(trip.start_date);
    const endDate = new Date(trip.end_date);

    if (activityTime < startDate || activityTime > endDate) {
      return badRequest(res, 'Activity time must be within trip dates');
    }

    const itinerary = await Itinerary.create({
      trip_id,
      title,
      activity_time,
      notes
    });

    return created(res, itinerary, 'Itinerary created successfully');

  } catch (error) {
    next(error);
  }
};

/**
 * Get all itineraries for a trip
 */
const getTripItineraries = async (req, res, next) => {
  try {
    const { tripId } = req.params;

    // Verify trip belongs to user
    const trip = await Trip.findOne({
      where: { id: tripId, user_id: req.userId }
    });

    if (!trip) {
      return notFound(res, 'Trip not found');
    }

    const itineraries = await Itinerary.findAll({
      where: { trip_id: tripId },
      order: [['activity_time', 'ASC']]
    });

    return success(res, itineraries, 'Itineraries retrieved successfully');

  } catch (error) {
    next(error);
  }
};

/**
 * Get itinerary by ID
 */
const getItineraryById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const itinerary = await Itinerary.findOne({
      where: { id },
      include: [{
        model: Trip,
        where: { user_id: req.userId }
      }]
    });

    if (!itinerary) {
      return notFound(res, 'Itinerary not found');
    }

    return success(res, itinerary, 'Itinerary retrieved successfully');

  } catch (error) {
    next(error);
  }
};

/**
 * Update itinerary
 */
const updateItinerary = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, activity_time, notes } = req.body;

    const itinerary = await Itinerary.findOne({
      where: { id },
      include: [{
        model: Trip,
        where: { user_id: req.userId }
      }]
    });

    if (!itinerary) {
      return notFound(res, 'Itinerary not found');
    }

    // Validate activity time if provided
    if (activity_time) {
      const activityTime = new Date(activity_time);
      const startDate = new Date(itinerary.Trip.start_date);
      const endDate = new Date(itinerary.Trip.end_date);

      if (activityTime < startDate || activityTime > endDate) {
        return badRequest(res, 'Activity time must be within trip dates');
      }

      itinerary.activity_time = activity_time;
    }

    if (title !== undefined) itinerary.title = title;
    if (notes !== undefined) itinerary.notes = notes;

    await itinerary.save();

    return success(res, itinerary, 'Itinerary updated successfully');

  } catch (error) {
    next(error);
  }
};

/**
 * Delete itinerary
 */
const deleteItinerary = async (req, res, next) => {
  try {
    const { id } = req.params;

    const itinerary = await Itinerary.findOne({
      where: { id },
      include: [{
        model: Trip,
        where: { user_id: req.userId }
      }]
    });

    if (!itinerary) {
      return notFound(res, 'Itinerary not found');
    }

    await itinerary.destroy();

    return success(res, null, 'Itinerary deleted successfully');

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createItinerary,
  getTripItineraries,
  getItineraryById,
  updateItinerary,
  deleteItinerary
};