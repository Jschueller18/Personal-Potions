const express = require('express');
const path = require('path');
const app = express();

// Load environment variables
require('dotenv').config();

// Middleware
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Import API routes
const surveyHandler = require('./api/customers/survey');
const checkDbHandler = require('./api/check-db');

// API Routes
app.post('/api/customers/survey', surveyHandler);
app.get('/api/check-db', checkDbHandler);

// Serve index.html for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to view the site`);
  console.log(`API endpoints available at http://localhost:${PORT}/api/*`);
}); 