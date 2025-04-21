// CommonJS format for better Vercel compatibility
const { MongoClient } = require('mongodb');

module.exports = async (req, res) => {
  // Allow cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the data from the request
    const customerData = req.body;
    
    // Add timestamp
    customerData.createdAt = new Date();
    
    // Log request data for debugging
    console.log('Received submission:', customerData);
    
    // Check if MONGODB_URI is defined
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('MONGODB_URI is not defined');
      // For development fallback to a default connection string if needed
      // For now, we'll return an error so we know there's a config issue
      return res.status(500).json({ 
        error: 'MongoDB connection string is not configured',
        note: 'Please set MONGODB_URI environment variable'
      });
    }
    
    console.log('Connecting to database with URI starting with:', uri ? uri.substring(0, 20) + '...' : 'undefined');
    
    // Create a new MongoClient
    const client = new MongoClient(uri, {
      // Adding connection options for better reliability
      connectTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10
    });
    
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB successfully');
    
    // Access the database and collection
    const db = client.db('realdata');
    const collection = db.collection('customers');
    
    // Insert the customer data
    const result = await collection.insertOne(customerData);
    console.log('Document inserted successfully with ID:', result.insertedId);
    
    // Close the connection
    await client.close();
    
    // Return success with customer data
    return res.status(200).json({ 
      success: true, 
      customer: { _id: result.insertedId, ...customerData }
    });
  } catch (error) {
    console.error('Error processing submission:', error);
    
    // Return detailed error for debugging
    return res.status(500).json({ 
      error: error.message, 
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      tip: 'Check your MongoDB connection string and verify network access to your MongoDB instance'
    });
  }
}; 