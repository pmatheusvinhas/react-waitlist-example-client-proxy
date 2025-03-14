// Import the createWebhookProxy function from react-waitlist
import { createWebhookProxy } from 'react-waitlist/server';

// Create and export the webhook proxy handler
export const webhookProxyHandler = createWebhookProxy({
  webhookSecret: process.env.WEBHOOK_SECRET,
  allowedWebhooks: [process.env.ALLOWED_WEBHOOK_URL],
  debug: process.env.NODE_ENV !== 'production'
}); 