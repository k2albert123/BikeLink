// src/index.js
import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { sequelize, syncDatabase } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import rideRoutes from './routes/rideRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rides', rideRoutes);

// Socket.io - Live Tracking
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('update-location', (data) => {
    // { userId, lat, lon }
    socket.broadcast.emit('location-update', data);
  });

  socket.on('disconnect', () => console.log('User disconnected'));
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    console.log("sequalizer port: ", sequelize);
    await syncDatabase(); // Call the function to sync the database
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
  }
}

startServer();