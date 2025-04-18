// A simple API endpoint to test if serverless functions are working at all
module.exports = (req, res) => {
  // Log the request info
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);
  console.log('Request headers:', req.headers);
  
  // Return a simple response
  res.status(200).json({
    message: 'Hello World! API is working!',
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
}; 