// models/rideModel.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js'; // Fix: Use 'sequelize' instead of 'sequel'
import { User } from './userModel.js';

const Ride = sequelize.define(
  'Ride',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    passenger_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
      allowNull: false,
    },
    rider_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
      allowNull: true,
    },
    pickup_lat: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    pickup_lng: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    dropoff_lat: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    dropoff_lng: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'in_progress', 'completed', 'cancelled'),
      defaultValue: 'pending',
    },
    distance_km: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    estimated_fare: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'rides',
    timestamps: false,
  }
);

// Define associations
User.hasMany(Ride, { foreignKey: 'passenger_id', as: 'passenger_rides' });
User.hasMany(Ride, { foreignKey: 'rider_id', as: 'rider_rides' });
Ride.belongsTo(User, { foreignKey: 'passenger_id', as: 'passenger' });
Ride.belongsTo(User, { foreignKey: 'rider_id', as: 'rider' });

export { Ride };