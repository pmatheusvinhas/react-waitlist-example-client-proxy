import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Import our proxy handlers
import { recaptchaProxyHandler } from './api/recaptcha-proxy.js';
import { resendProxyHandler } from './api/resend-proxy.js';
import { webhookProxyHandler } from './api/webhook-proxy.js';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables with priority:
// 1. .env.server.local (for development with real secrets, ignored by git)
// 2. .env.server.production (template with placeholders, versioned in git)
const envLocalPath = path.join(__dirname, '.env.server.local');
const envProductionPath = path.join(__dirname, '.env.server.production');

// Check if .env.server.local exists, otherwise fall back to .env.server.production
const envPath = fs.existsSync(envLocalPath) ? envLocalPath : envProductionPath;
dotenv.config({ path: envPath });

// Log which environment file was loaded (but don't show any secrets)
console.log(`Loaded environment variables from: ${path.basename(envPath)}`);

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

// Create Resend proxy endpoint
app.post('/api/resend-proxy', resendProxyHandler);

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