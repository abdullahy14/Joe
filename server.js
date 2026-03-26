const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const learningRoutes = require('./routes/learning');
const marketRoutes = require('./routes/market');
const tournamentRoutes = require('./routes/tournaments');
const rankingRoutes = require('./routes/rankings');
const { supportPlayerMiddleware } = require('./middleware/supportPlayer');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next();

  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'core-concept-dev-secret');
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  next();
}

app.use(authenticateJWT);
app.use(supportPlayerMiddleware);

app.get('/api', (req, res) => {
  res.json({
    service: 'Core Concept API',
    modules: ['Learning', 'Marketplace', 'Competition', 'Support Player'],
    supportPlayer: req.supportPlayer
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/learning', learningRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/tournaments', tournamentRoutes);
app.use('/api/rankings', rankingRoutes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

io.on('connection', (socket) => {
  socket.emit('welcome', { message: 'Connected to Core Concept realtime channel' });

  socket.on('tournament:update', (payload) => {
    io.emit('notification', { type: 'tournament_update', payload });
  });

  socket.on('voice:signal', (signal) => {
    socket.broadcast.emit('voice:signal', signal);
  });
});

async function start() {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/core-concept';

  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.warn('MongoDB unavailable. Continuing without DB connection for local demo.');
  }

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Core Concept running on http://localhost:${PORT}`);
  });
}

start();
