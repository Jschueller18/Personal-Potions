const express = require('express');
const path = require('path');
const app = express();

// Load environment variables
require('dotenv').config();

// Middleware
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Import API routes
const surveyHandler = require('./api/customers/survey');
const checkDbHandler = require('./api/check-db');

// API Routes - these will proxy to the backend on port 5000
app.post('/api/customers/survey', surveyHandler);
app.get('/api/check-db', checkDbHandler);

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Frontend server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to view the site`);
  console.log(`API endpoints will be proxied to http://localhost:5000/api/*`);
}); 