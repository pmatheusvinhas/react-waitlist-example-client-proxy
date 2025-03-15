import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables with priority:
// 1. .env.server.local (for development with real secrets, ignored by git)
// 2. .env.server.production (template with placeholders, versioned in git)
const envLocalPath = path.join(__dirname, '..', '.env.server.local');
const envProductionPath = path.join(__dirname, '..', '.env.server.production');

// Debug file paths
console.log('Current directory:', __dirname);
console.log('Local env path:', envLocalPath);
console.log('Production env path:', envProductionPath);
console.log('Local env exists:', fs.existsSync(envLocalPath));
console.log('Production env exists:', fs.existsSync(envProductionPath));

// Check if .env.server.local exists, otherwise fall back to .env.server.production
const envPath = fs.existsSync(envLocalPath) ? envLocalPath : envProductionPath;

// Try to read the file content directly
try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('Environment file content found:', envContent.split('\n').length, 'lines');
} catch (error) {
  console.error('Error reading environment file:', error);
}

// Load environment variables
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('Error loading environment variables:', result.error);
  process.exit(1);
}

// Debug environment variables
console.log('Environment file loaded:', envPath);
console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
console.log('RESEND_API_KEY length:', process.env.RESEND_API_KEY?.length);

export default result; 