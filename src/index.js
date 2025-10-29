// src/index.js
import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { sequelize, syncDatabase } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import ridersRoutes from './routes/RiderRouter.js';
import passengerRoutes from './routes/PassengerRoutes.js'

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/riders', ridersRoutes);
app.use('/api/passengers', passengerRoutes);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('update-location', (data) => {
    socket.broadcast.emit('location-update', data);
  });

  socket.on('disconnect', () => console.log('User disconnected'));
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    console.log("sequalizer port: ", sequelize);
    await syncDatabase();
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
  }
}

startServer();