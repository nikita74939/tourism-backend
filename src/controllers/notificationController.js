const { Notification, Itinerary, Trip } = require('../models');
const { success, created, badRequest, notFound } = require('../utils/response');
const { Op } = require('sequelize');

/**
 * Create notification for an itinerary
 */
const createNotification = async (req, res, next) => {
  try {
    const { itinerary_id, notify_time } = req.body;

    if (!itinerary_id || !notify_time) {
      return badRequest(res, 'Itinerary ID and notify time are required');
    }

    // Check if itinerary exists and belongs to user
    const itinerary = await Itinerary.findOne({
      where: { id: itinerary_id },
      include: [{
        model: Trip,
        where: { user_id: req.userId }
      }]
    });

    if (!itinerary) {
      return notFound(res, 'Itinerary not found');
    }

    // Validate notify_time is before activity_time
    const notifyTime = new Date(notify_time);
    const activityTime = new Date(itinerary.activity_time);

    if (notifyTime >= activityTime) {
      return badRequest(res, 'Notification time must be before activity time');
    }

    const notification = await Notification.create({
      user_id: req.userId,
      itinerary_id,
      notify_time
    });

    return created(res, notification, 'Notification created successfully');

  } catch (error) {
    next(error);
  }
};

/**
 * Get all notifications for current user
 */
const getUserNotifications = async (req, res, next) => {
  try {
    const { is_sent } = req.query;

    const whereClause = { user_id: req.userId };

    if (is_sent !== undefined) {
      whereClause.is_sent = is_sent === 'true';
    }

    const notifications = await Notification.findAll({
      where: whereClause,
      include: [{
        model: Itinerary,
        include: [{
          model: Trip,
          attributes: ['id', 'destination_id']
        }]
      }],
      order: [['notify_time', 'ASC']]
    });

    return success(res, notifications, 'Notifications retrieved successfully');

  } catch (error) {
    next(error);
  }
};

/**
 * Get pending notifications (for scheduler)
 */
const getPendingNotifications = async (req, res, next) => {
  try {
    const now = new Date();

    const notifications = await Notification.findAll({
      where: {
        is_sent: false,
        notify_time: { [Op.lte]: now }
      },
      include: [{
        model: Itinerary,
        include: [{
          model: Trip
        }]
      }]
    });

    return success(res, notifications, 'Pending notifications retrieved successfully');

  } catch (error) {
    next(error);
  }
};

/**
 * Mark notification as sent
 */
const markAsSent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOne({
      where: { id, user_id: req.userId }
    });

    if (!notification) {
      return notFound(res, 'Notification not found');
    }

    notification.is_sent = true;
    await notification.save();

    return success(res, notification, 'Notification marked as sent');

  } catch (error) {
    next(error);
  }
};

/**
 * Delete notification
 */
const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOne({
      where: { id, user_id: req.userId }
    });

    if (!notification) {
      return notFound(res, 'Notification not found');
    }

    await notification.destroy();

    return success(res, null, 'Notification deleted successfully');

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  getPendingNotifications,
  markAsSent,
  deleteNotification
};