const { Activity } = require('../models');
const { success, created, badRequest } = require('../utils/response');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Record user activity from sensor
 */
const recordActivity = async (req, res, next) => {
  try {
    const { activity_type } = req.body;

    if (!activity_type) {
      return badRequest(res, 'Activity type is required');
    }

    // Validate activity type
    const validTypes = ['walking', 'idle', 'traveling', 'running', 'cycling'];
    if (!validTypes.includes(activity_type)) {
      return badRequest(res, 'Invalid activity type');
    }

    const activity = await Activity.create({
      user_id: req.userId,
      activity_type
    });

    return created(res, activity, 'Activity recorded successfully');

  } catch (error) {
    next(error);
  }
};

/**
 * Get user activities
 */
const getUserActivities = async (req, res, next) => {
  try {
    const { type, date, limit = 100 } = req.query;

    const whereClause = { user_id: req.userId };

    if (type) {
      whereClause.activity_type = type;
    }

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      whereClause.recorded_at = {
        [Op.between]: [startDate, endDate]
      };
    }

    const activities = await Activity.findAll({
      where: whereClause,
      order: [['recorded_at', 'DESC']],
      limit: parseInt(limit)
    });

    return success(res, activities, 'Activities retrieved successfully');

  } catch (error) {
    next(error);
  }
};

/**
 * Get activity statistics
 */
const getActivityStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const whereClause = { user_id: req.userId };

    if (startDate && endDate) {
      whereClause.recorded_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const activities = await Activity.findAll({
      where: whereClause,
      attributes: [
        'activity_type',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['activity_type']
    });

    // Format response
    const stats = {};
    activities.forEach(activity => {
      stats[activity.activity_type] = parseInt(activity.dataValues.count);
    });

    return success(res, stats, 'Activity statistics retrieved successfully');

  } catch (error) {
    next(error);
  }
};

module.exports = {
  recordActivity,
  getUserActivities,
  getActivityStats
};