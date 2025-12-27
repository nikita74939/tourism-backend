const { sequelize } = require('../config/database');

// Import models
const User = require('./User')(sequelize);
const Destination = require('./Destination')(sequelize);
const Trip = require('./Trip')(sequelize);
const Itinerary = require('./Itinerary')(sequelize);
const Notification = require('./Notification')(sequelize);
const Activity = require('./Activity')(sequelize);
const Currency = require('./Currency')(sequelize);

// Define relationships

// User <-> Trip (1:N)
User.hasMany(Trip, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Trip.belongsTo(User, { foreignKey: 'user_id' });

// Destination <-> Trip (1:N)
Destination.hasMany(Trip, { foreignKey: 'destination_id', onDelete: 'CASCADE' });
Trip.belongsTo(Destination, { foreignKey: 'destination_id' });

// Trip <-> Itinerary (1:N)
Trip.hasMany(Itinerary, { foreignKey: 'trip_id', onDelete: 'CASCADE' });
Itinerary.belongsTo(Trip, { foreignKey: 'trip_id' });

// User <-> Notification (1:N)
User.hasMany(Notification, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

// Itinerary <-> Notification (1:N)
Itinerary.hasMany(Notification, { foreignKey: 'itinerary_id', onDelete: 'CASCADE' });
Notification.belongsTo(Itinerary, { foreignKey: 'itinerary_id' });

// User <-> Activity (1:N)
User.hasMany(Activity, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Activity.belongsTo(User, { foreignKey: 'user_id' });

// Sync database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: false }); // Set alter: true for dev if needed
    console.log('✅ Database synchronized');
  } catch (error) {
    console.error('❌ Database sync error:', error);
  }
};

module.exports = {
  sequelize,
  User,
  Destination,
  Trip,
  Itinerary,
  Notification,
  Activity,
  Currency,
  syncDatabase
};