// Load environment variables
require('dotenv').config();

const express = require('express');
const app = express();

// Middleware
app.use(express.json());

// Enable CORS for frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: process.env.APP_NAME || 'Sweet Shop Management System API',
    version: process.env.API_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      auth: '/api/auth',
      sweets: '/api/sweets'
    },
    documentation: 'Visit /api/sweets to see available sweets'
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/sweets', require('./routes/sweets'));

module.exports = app;
