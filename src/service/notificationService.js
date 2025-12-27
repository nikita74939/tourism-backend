const { Notification, Itinerary, Trip, User } = require('../models');
const { Op } = require('sequelize');

/**
 * Service untuk handle notification logic
 */

/**
 * Get notifications that should be sent now
 */
const getNotificationsToSend = async () => {
  try {
    const now = new Date();

    const notifications = await Notification.findAll({
      where: {
        is_sent: false,
        notify_time: {
          [Op.lte]: now
        }
      },
      include: [
        {
          model: Itinerary,
          include: [{
            model: Trip
          }]
        },
        {
          model: User,
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    return notifications;
  } catch (error) {
    console.error('Error getting notifications to send:', error);
    throw error;
  }
};

/**
 * Mark notifications as sent
 */
const markNotificationsAsSent = async (notificationIds) => {
  try {
    await Notification.update(
      { is_sent: true },
      {
        where: {
          id: {
            [Op.in]: notificationIds
          }
        }
      }
    );
  } catch (error) {
    console.error('Error marking notifications as sent:', error);
    throw error;
  }
};

/**
 * Create notification for itinerary (helper)
 * Set notify time 1 hour before activity
 */
const createAutoNotification = async (itineraryId, userId) => {
  try {
    const itinerary = await Itinerary.findByPk(itineraryId);
    
    if (!itinerary) {
      throw new Error('Itinerary not found');
    }

    // Set notification 1 hour before activity
    const notifyTime = new Date(itinerary.activity_time);
    notifyTime.setHours(notifyTime.getHours() - 1);

    const notification = await Notification.create({
      user_id: userId,
      itinerary_id: itineraryId,
      notify_time: notifyTime
    });

    return notification;
  } catch (error) {
    console.error('Error creating auto notification:', error);
    throw error;
  }
};

/**
 * Process notifications (can be called by cron job or scheduler)
 */
const processNotifications = async () => {
  try {
    const notifications = await getNotificationsToSend();

    if (notifications.length === 0) {
      console.log('No notifications to send');
      return;
    }

    console.log(`Processing ${notifications.length} notifications...`);

    // Here you would integrate with actual notification service
    // (e.g., Firebase Cloud Messaging, OneSignal, etc.)
    for (const notification of notifications) {
      console.log(`Sending notification to user ${notification.user_id}:`, {
        title: notification.Itinerary.title || 'Trip Reminder',
        message: `Your activity is coming up at ${notification.Itinerary.activity_time}`,
        itinerary_id: notification.itinerary_id
      });
    }

    // Mark as sent
    const notificationIds = notifications.map(n => n.id);
    await markNotificationsAsSent(notificationIds);

    console.log(`Successfully processed ${notifications.length} notifications`);
  } catch (error) {
    console.error('Error processing notifications:', error);
    throw error;
  }
};

module.exports = {
  getNotificationsToSend,
  markNotificationsAsSent,
  createAutoNotification,
  processNotifications
};