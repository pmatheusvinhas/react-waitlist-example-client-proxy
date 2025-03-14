// Import the createRecaptchaProxy function from react-waitlist
import { createRecaptchaProxy } from 'react-waitlist/server';

// Create and export the reCAPTCHA proxy handler
export const recaptchaProxyHandler = createRecaptchaProxy({
  secretKey: process.env.RECAPTCHA_SECRET_KEY,
  minScore: 0.5,
  allowedActions: ['submit_waitlist'],
  debug: process.env.NODE_ENV !== 'production'
}); 