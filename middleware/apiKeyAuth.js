// middleware/apiKeyAuth.js
// API Key authentication for internal/service routes
// Usage: app.get('/route', authenticateApiKey, handler)

const authenticateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  // Read valid keys from .env (comma-separated)
  const envKeys = process.env.API_KEYS || '';
  const validKeys = envKeys.split(',').map(k => k.trim()).filter(k => k.length > 0);
  
  if (apiKey && validKeys.includes(apiKey)) {
    next();
  } else {
    res.status(401).json({ 
      error: 'Unauthorized: Invalid or missing API Key',
      hint: 'Include X-API-Key header in your request'
    });
  }
};

module.exports = authenticateApiKey;
