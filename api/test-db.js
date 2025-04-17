import { MongoClient } from 'mongodb';

export default async function handler(req, res) {
  try {
    // Log environment for debugging
    console.log('Starting database connection test');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    
    // Connect to MongoDB
    const uri = process.env.MONGODB_URI;
    console.log('Connecting to database with URI starting with:', uri ? uri.substring(0, 20) + '...' : 'undefined');
    
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    const client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB successfully');
    
    // Test the connection
    const db = client.db('realdata');
    const collection = db.collection('customers');
    
    // Insert a test document
    const testDoc = { 
      test: true, 
      date: new Date(),
      source: 'connection-test'
    };
    
    const result = await collection.insertOne(testDoc);
    console.log('Test document inserted with ID:', result.insertedId);
    
    // Close the connection
    await client.close();
    
    return res.status(200).json({ 
      success: true, 
      message: 'Database connection successful',
      testDocumentId: result.insertedId,
      testTimestamp: new Date()
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 