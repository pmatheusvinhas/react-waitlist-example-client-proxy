// Import environment configuration first
import '../config/env.js';
import { createResendProxy } from 'react-waitlist/server';

// Debug environment variables
console.log('Creating Resend proxy with API key:', !!process.env.RESEND_API_KEY);
console.log('API Key length:', process.env.RESEND_API_KEY?.length);

// Create the handler with the current API key
const handler = createResendProxy({
  apiKey: process.env.RESEND_API_KEY,
  rateLimit: {
    max: 10,
    windowSec: 60,
  },
  debug: true // Enable debug mode for detailed logs
});

// Wrap the handler with additional logging and transparent response handling
export const resendProxyHandler = async (req, res) => {
  console.log('Resend proxy request received:', {
    method: req.method,
    body: {
      ...req.body,
      // We don't log the API key for security reasons
      apiKey: req.body.apiKey ? '[REDACTED]' : undefined
    }
  });

  // Create a response interceptor to capture and forward all responses
  const originalJson = res.json;
  const originalStatus = res.status;
  const originalSend = res.send;
  
  // Override response methods to log before sending
  res.json = function(body) {
    console.log('Resend proxy response:', body);
    return originalJson.call(this, body);
  };
  
  res.status = function(code) {
    console.log('Resend proxy status code:', code);
    return originalStatus.call(this, code);
  };
  
  res.send = function(body) {
    console.log('Resend proxy sending response:', body);
    return originalSend.call(this, body);
  };

  try {
    // Execute the handler
    await handler(req, res);
  } catch (error) {
    console.error('Unhandled error in Resend proxy:', error);
    
    // If response hasn't been sent yet, send a error with appropriate status code
    if (!res.headersSent) {
      return res.status(error.statusCode || 500).json({ 
        error: error.name || 'Internal server error',
        message: error.message || 'Unknown error'
      });
    }
  }
}; 