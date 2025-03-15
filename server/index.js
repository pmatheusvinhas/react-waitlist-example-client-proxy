// Load environment variables first
import './config/env.js';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import our proxy handlers
import { recaptchaProxyHandler } from './api/recaptcha-proxy.js';
import { resendProxyHandler } from './api/resend-proxy.js';
import { webhookProxyHandler } from './api/webhook-proxy.js';

const app = express();
app.use(express.json());

// Configure CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:5173']; // Default to local development

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Create Resend proxy endpoint with debug info
app.post('/api/resend-proxy', (req, res, next) => {
  console.log('Resend API Key at request time:', !!process.env.RESEND_API_KEY);
  console.log('Resend Audience ID at request time:', process.env.RESEND_AUDIENCE_ID);
  console.log('Request body:', req.body);
  console.log('Request headers:', req.headers);
  
  try {
    return resendProxyHandler(req, res, next);
  } catch (error) {
    console.error('Error in Resend proxy handler:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Create webhook proxy endpoint
app.post('/api/webhook-proxy', webhookProxyHandler);

// Create reCAPTCHA verification endpoint
app.post('/api/recaptcha-proxy', recaptchaProxyHandler);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// Catch-all handler for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`- Resend proxy available at: http://localhost:${PORT}/api/resend-proxy`);
  console.log(`- reCAPTCHA proxy available at: http://localhost:${PORT}/api/recaptcha-proxy`);
  console.log(`- Webhook proxy available at: http://localhost:${PORT}/api/webhook-proxy`);
});

// Export the server for testing
export default app; 