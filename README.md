# React Waitlist Example - Client-Side with Proxy

This example demonstrates how to use the React Waitlist component with proxy endpoints to securely handle API requests that require secret keys.

## Features

- **Proxy Implementation**: Secure handling of API requests that require secret keys
- **reCAPTCHA Verification**: Handled by a proxy endpoint that securely stores your secret key on the server side
- **Resend Integration**: API integration handled by a proxy endpoint to avoid exposing your API key in client-side code
- **Event Logging**: Comprehensive logging of events and API calls for debugging
- **Security Features**: Honeypot, submission time check, and reCAPTCHA integration

## Project Structure

```
/
├── src/                  # Frontend React application
├── server/               # Backend Express server
│   ├── index.js          # Main server file
│   ├── .env.server.production  # Server-side environment template (versioned)
│   ├── .env.server.local # Server-side local environment variables (ignored by git)
│   └── api/              # API endpoints
│       ├── recaptcha-proxy.js  # reCAPTCHA proxy endpoint
│       ├── resend-proxy.js     # Resend proxy endpoint
│       └── webhook-proxy.js    # Webhook proxy endpoint
├── .env.production       # Frontend environment template (versioned)
├── .env.local            # Frontend local environment variables (ignored by git)
└── package.json          # Project dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/pmatheusvinhas/react-waitlist.git
   cd react-waitlist/examples/vite-proxy
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:

   We use a dual environment file approach for better security and development workflow:
   
   - **Production templates** (`.env.production` and `.env.server.production`): These files are versioned in git and contain template values.
   - **Local development files** (`.env.local` and `.env.server.local`): These files are ignored by git and contain your actual secret keys.

   a. Create a `.env.local` file in the root directory for frontend variables:
   ```
   # Frontend Environment Variables (LOCAL)
   # This file should be ignored by git (.gitignore)
   VITE_RESEND_AUDIENCE_ID=your_actual_audience_id_here
   VITE_RECAPTCHA_SITE_KEY=your_actual_recaptcha_site_key_here
   VITE_RESEND_PROXY_ENDPOINT=http://localhost:3001/api/resend-proxy
   VITE_RECAPTCHA_PROXY_ENDPOINT=http://localhost:3001/api/recaptcha-proxy
   ```

   b. Create a `.env.server.local` file in the `server` directory for backend variables:
   ```
   # Server-side Environment Variables (LOCAL) - KEEP THIS FILE SECURE!
   # This file should be ignored by git (.gitignore)
   
   # Resend API Key (server-side only)
   RESEND_API_KEY=your_actual_resend_api_key_here
   RESEND_AUDIENCE_ID=your_actual_audience_id_here
   
   # reCAPTCHA Keys (server-side only)
   RECAPTCHA_SECRET_KEY=your_actual_recaptcha_secret_key_here
   
   # Webhook Configuration (server-side only)
   WEBHOOK_SECRET=your_actual_webhook_secret_here
   ALLOWED_WEBHOOK_URL=https://your-actual-webhook-url.com/webhook
   
   # Server Configuration
   PORT=3001
   
   # CORS Configuration (optional)
   ALLOWED_ORIGINS=http://localhost:5173
   ```

   c. The repository includes template files (`.env.production` and `.env.server.production`) that you can use as a reference:
   ```
   # Copy .env.production to .env.local and update with your actual values
   # Copy .env.server.production to .env.server.local and update with your actual values
   ```

### Environment Files Management

Our approach to environment files follows these principles:

1. **Version Control**:
   - `.env.production` and `.env.server.production`: These files are committed to git and serve as templates with placeholder values.
   - `.env.local` and `.env.server.local`: These files contain actual secrets and are excluded from git via `.gitignore`.

2. **Development Workflow**:
   - Developers copy the production templates to their local versions and fill in their own secrets.
   - This prevents accidental commits of sensitive information.

3. **Deployment**:
   - In production environments, you can either use the `.env.production` files or set environment variables directly in your hosting platform.

4. **Update .gitignore**:
   - Make sure to add the following to your `.gitignore` file:
     ```
     .env.local
     .env.*.local
     ```

### Development

Run the development server:

```bash
npm run dev
```

This will start both the frontend and backend servers:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### Production

Build the application for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## How It Works

### Security Architecture

This example follows a secure architecture by:

1. **Separating Environment Variables**: 
   - Frontend variables (`.env.local`) only contain public information and proxy endpoints
   - Backend variables (`.env.server.local`) contain all sensitive API keys and secrets
   - Template files (`.env.production` and `.env.server.production`) provide structure without exposing secrets

2. **Proxy Endpoints**: All API requests that require secret keys are routed through secure proxy endpoints

### Proxy Endpoints

The proxy endpoints are implemented in the `server/api` directory:

- **recaptcha-proxy.js**: Handles reCAPTCHA verification using the secret key stored on the server
- **resend-proxy.js**: Handles Resend API integration using the API key stored on the server
- **webhook-proxy.js**: Handles webhook integration using the webhook secret stored on the server

### Frontend Integration

The frontend integrates with the proxy endpoints using the environment variables:

```jsx
<WaitlistForm 
  // Resend integration
  resendAudienceId={import.meta.env.VITE_RESEND_AUDIENCE_ID}
  resendProxyEndpoint={import.meta.env.VITE_RESEND_PROXY_ENDPOINT}
  
  // reCAPTCHA integration
  security={{
    enableReCaptcha: true,
    reCaptchaSiteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
    recaptchaProxyEndpoint: import.meta.env.VITE_RECAPTCHA_PROXY_ENDPOINT,
  }}
  
  // Other props...
/>
```

## Security Considerations

This example demonstrates a secure approach to handling API requests that require secret keys:

1. **Secret Keys**: All secret keys are stored on the server side and never exposed to the client
2. **Proxy Endpoints**: API requests are routed through proxy endpoints that handle the authentication
3. **Rate Limiting**: The proxy endpoints include rate limiting to prevent abuse
4. **CORS Protection**: The server is configured to only accept requests from allowed origins
5. **Environment File Separation**: Using `.env.*.local` for secrets and `.env.*.production` as templates prevents accidental exposure of sensitive information

## License

MIT
