// Import the createWebhookProxy function from react-waitlist
import { createWebhookProxy } from 'react-waitlist/server';

// Create the webhook proxy handler
const handler = createWebhookProxy({
  webhookSecret: process.env.WEBHOOK_SECRET,
  allowedWebhooks: [process.env.ALLOWED_WEBHOOK_URL],
  debug: process.env.NODE_ENV !== 'production'
});

// Wrap the handler to ensure all responses are passed transparently to the frontend
export const webhookProxyHandler = async (req, res) => {
  console.log('Webhook proxy request received:', {
    method: req.method,
    url: req.body.url
  });

  // Create a response interceptor to capture and forward all responses
  const originalJson = res.json;
  const originalStatus = res.status;
  const originalSend = res.send;
  
  // Override response methods to log before sending
  res.json = function(body) {
    console.log('Webhook proxy response:', body);
    return originalJson.call(this, body);
  };
  
  res.status = function(code) {
    console.log('Webhook proxy status code:', code);
    return originalStatus.call(this, code);
  };
  
  res.send = function(body) {
    console.log('Webhook proxy sending response:', body);
    return originalSend.call(this, body);
  };

  try {
    // Execute the handler
    await handler(req, res);
  } catch (error) {
    console.error('Unhandled error in webhook proxy:', error);
    
    // If response hasn't been sent yet, send error to client
    if (!res.headersSent) {
      return res.status(error.statusCode || 500).json({ 
        error: error.name || 'Internal server error',
        message: error.message || 'Unknown error'
      });
    }
  }
}; 