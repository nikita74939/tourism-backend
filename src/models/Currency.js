const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Currency = sequelize.define('Currency', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true
    },
    rate_to_idr: {
      type: DataTypes.DECIMAL(12, 4),
      allowNull: true
    }
  }, {
    tableName: 'currencies',
    timestamps: true,
    createdAt: false,
    updatedAt: 'updated_at'
  });

  return Currency;
};