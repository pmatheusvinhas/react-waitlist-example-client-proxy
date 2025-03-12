const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Import the createResendProxy from the local react-waitlist package
// In a real application, you would use: const { createResendProxy } = require('react-waitlist/server');
const { createResendProxy } = require('../../../src/server');

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Create Resend proxy endpoint
app.post('/api/resend-proxy', createResendProxy({
  apiKey: process.env.RESEND_API_KEY,
  allowedAudiences: ['your-audience-id'],
  rateLimit: {
    max: 10,
    windowSec: 60,
  },
}));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export the server for testing
module.exports = app;
