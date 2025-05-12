// A simple API endpoint to test if serverless functions are working at all
module.exports = (req, res) => {
  // Log the request info
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);
  console.log('Request headers:', req.headers);
  
  // Return a simple response
  res.status(200).json({
    message: 'API is working!',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    requestInfo: {
      method: req.method,
      path: req.url,
      headers: req.headers,
      body: req.body || 'No body'
    },
    serverInfo: {
      nodeVersion: process.version,
      platform: process.platform,
      hostname: require('os').hostname()
    }
  });
}; 