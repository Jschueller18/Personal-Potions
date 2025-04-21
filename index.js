// This file helps Vercel understand the project structure
// For a static site, we don't need to implement a full server

console.log('Personal Potions Site is running');

// If this were a server-side app, we'd have code like:
// 
// const express = require('express');
// const app = express();
// const port = process.env.PORT || 3000;
// 
// app.use(express.static('.'));
// 
// app.listen(port, () => {
//   console.log(`Personal Potions site listening on port ${port}`);
// });

// But for a static site with Vercel, we don't need this. 

// Load environment variables
require('dotenv').config();

// Vercel serverless function handler
const { MongoClient } = require('mongodb');

// Simple health check endpoint
module.exports = async (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  
  try {
    // Check if environment variables are properly loaded
    const mongoUri = process.env.MONGODB_URI || 'Not configured';
    const nodeEnv = process.env.NODE_ENV || 'Not set';
    
    // Return basic system info without exposing full connection strings
    res.end(JSON.stringify({
      status: 'ok',
      environment: nodeEnv,
      mongodb: mongoUri ? 'Configured' : 'Not configured',
      timestamp: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error in health check:', error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Server error', message: error.message }));
  }
}; 