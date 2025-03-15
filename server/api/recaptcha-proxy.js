// Import the createRecaptchaProxy function from react-waitlist
import { createRecaptchaProxy } from 'react-waitlist/server';

// Create the reCAPTCHA proxy handler
const handler = createRecaptchaProxy({
  secretKey: process.env.RECAPTCHA_SECRET_KEY,
  minScore: 0.5,
  allowedActions: ['submit_waitlist'],
  debug: process.env.NODE_ENV !== 'production'
});

// Wrap the handler to ensure all responses are passed transparently to the frontend
export const recaptchaProxyHandler = async (req, res) => {
  console.log('reCAPTCHA proxy request received:', {
    method: req.method,
    token: req.body.token ? '[REDACTED]' : undefined
  });

  // Create a response interceptor to capture and forward all responses
  const originalJson = res.json;
  const originalStatus = res.status;
  const originalSend = res.send;
  
  // Override response methods to log before sending
  res.json = function(body) {
    console.log('reCAPTCHA proxy response:', body);
    return originalJson.call(this, body);
  };
  
  res.status = function(code) {
    console.log('reCAPTCHA proxy status code:', code);
    return originalStatus.call(this, code);
  };
  
  res.send = function(body) {
    console.log('reCAPTCHA proxy sending response:', body);
    return originalSend.call(this, body);
  };

  try {
    // Execute the handler
    await handler(req, res);
  } catch (error) {
    console.error('Unhandled error in reCAPTCHA proxy:', error);
    
    // If response hasn't been sent yet, send error to client
    if (!res.headersSent) {
      return res.status(error.statusCode || 500).json({ 
        error: error.name || 'Internal server error',
        message: error.message || 'Unknown error'
      });
    }
  }
}; 