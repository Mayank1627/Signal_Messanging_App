// backend/src/server.js
const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');

// Importing the database file runs the initDB() function automatically
require('./config/database');

// Import the socket handler and seeder
const initializeSocket = require('./sockets/socketHandler');
const seedDatabase = require('./utils/seeder'); // <-- Added

// Create HTTP server using the Express app
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Initialize socket event handlers
initializeSocket(io);

// Run the seeder on startup so the deployed app has data
seedDatabase();

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});