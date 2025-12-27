const { Activity } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Service untuk handle sensor data processing
 */

/**
 * Classify activity based on accelerometer data
 * This is a simplified version - in production you'd use ML models
 */
const classifyActivity = (accelerometerData) => {
  // accelerometerData: { x, y, z }
  const { x, y, z } = accelerometerData;

  // Calculate magnitude
  const magnitude = Math.sqrt(x * x + y * y + z * z);

  // Simple classification based on magnitude
  // These thresholds should be calibrated based on real data
  if (magnitude < 0.5) {
    return 'idle';
  } else if (magnitude < 2.0) {
    return 'walking';
  } else if (magnitude < 5.0) {
    return 'running';
  } else {
    return 'traveling'; // Fast movement like in vehicle
  }
};

/**
 * Process and store sensor data
 */
const processSensorData = async (userId, sensorData) => {
  try {
    // Classify activity
    const activityType = classifyActivity(sensorData);

    // Store in database
    const activity = await Activity.create({
      user_id: userId,
      activity_type: activityType
    });

    return {
      activity,
      classification: activityType,
      magnitude: Math.sqrt(
        sensorData.x * sensorData.x + 
        sensorData.y * sensorData.y + 
        sensorData.z * sensorData.z
      )
    };
  } catch (error) {
    console.error('Error processing sensor data:', error);
    throw error;
  }
};

/**
 * Get activity summary for a user
 */
const getActivitySummary = async (userId, startDate, endDate) => {
  try {
    const whereClause = { user_id: userId };

    if (startDate && endDate) {
      whereClause.recorded_at = {
        [Op.between]: [new Date(startDate), new Date(endDate)]
      };
    }

    const activities = await Activity.findAll({
      where: whereClause,
      attributes: [
        'activity_type',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('MIN', sequelize.col('recorded_at')), 'first_recorded'],
        [sequelize.fn('MAX', sequelize.col('recorded_at')), 'last_recorded']
      ],
      group: ['activity_type']
    });

    // Format response
    const summary = {
      total: 0,
      activities: {}
    };

    activities.forEach(activity => {
      const count = parseInt(activity.dataValues.count);
      summary.total += count;
      summary.activities[activity.activity_type] = {
        count,
        first_recorded: activity.dataValues.first_recorded,
        last_recorded: activity.dataValues.last_recorded
      };
    });

    return summary;
  } catch (error) {
    console.error('Error getting activity summary:', error);
    throw error;
  }
};

/**
 * Detect if user is currently traveling (for trip suggestions)
 */
const detectTraveling = async (userId) => {
  try {
    // Get recent activities (last 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const recentActivities = await Activity.findAll({
      where: {
        user_id: userId,
        recorded_at: {
          [Op.gte]: fiveMinutesAgo
        }
      },
      order: [['recorded_at', 'DESC']],
      limit: 10
    });

    if (recentActivities.length === 0) {
      return { is_traveling: false, confidence: 0 };
    }

    // Count traveling activities
    const travelingCount = recentActivities.filter(
      a => a.activity_type === 'traveling'
    ).length;

    const confidence = travelingCount / recentActivities.length;

    return {
      is_traveling: confidence > 0.5,
      confidence: Math.round(confidence * 100),
      recent_activity: recentActivities[0].activity_type
    };
  } catch (error) {
    console.error('Error detecting traveling:', error);
    throw error;
  }
};

module.exports = {
  classifyActivity,
  processSensorData,
  getActivitySummary,
  detectTraveling
};