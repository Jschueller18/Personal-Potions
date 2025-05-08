// Simple test endpoint
module.exports = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is working!',
    received: req.body || {},
    method: req.method,
    time: new Date().toISOString()
  });
}; 