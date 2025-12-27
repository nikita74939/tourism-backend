const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Itinerary = sequelize.define('Itinerary', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    trip_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'trips',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    activity_time: {
      type: DataTypes.DATE,
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'itineraries',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  return Itinerary;
};