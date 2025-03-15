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

// Wrap the handler with additional logging
export const resendProxyHandler = async (req, res) => {
  console.log('Resend proxy request received:', {
    method: req.method,
    body: {
      ...req.body,
      // We don't log the API key for security reasons
      apiKey: req.body.apiKey ? '[REDACTED]' : undefined
    }
  });

  try {
    // Execute the handler
    await handler(req, res);
  } catch (error) {
    console.error('Unhandled error in Resend proxy:', error);
    
    // If response hasn't been sent yet, send a 500 error
    if (!res.headersSent) {
      return res.status(500).json({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}; 