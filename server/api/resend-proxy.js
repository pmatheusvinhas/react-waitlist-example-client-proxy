// Import the createResendProxy function from react-waitlist
import { createResendProxy } from 'react-waitlist/server';

// Create and export the Resend proxy handler
export const resendProxyHandler = createResendProxy({
  apiKey: process.env.RESEND_API_KEY,
  allowedAudiences: [process.env.RESEND_AUDIENCE_ID],
  rateLimit: {
    max: 10,
    windowSec: 60,
  },
  debug: process.env.NODE_ENV !== 'production'
}); 