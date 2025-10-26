// config/database.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

async function syncDatabase() {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully');
  } catch (err) {
    console.error('Error syncing database:', err.stack);
  }
}

export { sequelize, syncDatabase };