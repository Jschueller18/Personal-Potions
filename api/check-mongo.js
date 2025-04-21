// CommonJS format for better Vercel compatibility
const { MongoClient } = require('mongodb');

// Load environment variables if not done already
try {
  require('dotenv').config();
} catch (e) {
  console.warn('dotenv not available, continuing without it');
}

module.exports = async (req, res) => {
  // Allow cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Check if environment variables are loaded
    const uri = process.env.MONGODB_URI;
    const envSource = process.env.NODE_ENV || 'development';
    
    // Return early if no MongoDB URI is configured
    if (!uri) {
      console.log('No MongoDB URI found');
      return res.status(200).json({
        status: 'error',
        connected: false,
        error: 'MONGODB_URI is not configured',
        env: {
          nodeEnv: envSource,
          hasUri: !!uri
        }
      });
    }
    
    console.log('Attempting MongoDB connection with URI starting with:', uri.substring(0, 15) + '...');
    
    // Try connecting to the database
    const client = new MongoClient(uri, {
      connectTimeoutMS: 5000,
      socketTimeoutMS: 30000
    });
    
    await client.connect();
    console.log('Connected to MongoDB successfully');
    
    // Get database stats as a simple test
    const db = client.db('realdata');
    const stats = await db.stats();
    
    // Close the connection
    await client.close();
    
    // Return connection status
    return res.status(200).json({
      status: 'success',
      connected: true,
      database: 'realdata',
      collections: stats.collections,
      env: {
        nodeEnv: envSource
      }
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    
    // Return error details
    return res.status(500).json({
      status: 'error',
      connected: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      env: {
        nodeEnv: process.env.NODE_ENV || 'development'
      }
    });
  }
}; 