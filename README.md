# React Waitlist Example - Client-Side with Proxy

This example demonstrates how to use the `WaitlistForm` component from the `react-waitlist` package in a Vite React application with a proxy server to protect your API keys.

## Features

- Client-side React application built with Vite
- Express.js proxy server to protect API keys
- TypeScript support
- Secure integration with Resend API

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/pmatheusvinhas/react-waitlist-example-client-proxy.git
cd react-waitlist-example-client-proxy
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up environment variables:

Create a `.env` file in the root directory with the following content:

```
RESEND_API_KEY=your_api_key_here
PORT=3001
```

4. Start the development server:

```bash
# Start the Vite development server
npm run dev

# In a separate terminal, start the proxy server
node server/index.js
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser to see the result.

## How It Works

This example uses the `WaitlistForm` component from the `react-waitlist` package with a proxy server to protect your API keys. The proxy server is built with Express.js and uses the `createResendProxy` utility from the `react-waitlist/server` package.

### Client-Side Component

```jsx
import { WaitlistForm } from 'react-waitlist';

function App() {
  return (
    <div>
      <WaitlistForm 
        resendAudienceId="your-audience-id"
        resendProxyEndpoint="http://localhost:3001/api/resend-proxy"
        title="Join Our Waitlist"
        description="Be the first to know when we launch."
      />
    </div>
  );
}
```

### Proxy Server

```javascript
const express = require('express');
const cors = require('cors');
const { createResendProxy } = require('react-waitlist/server');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/api/resend-proxy', createResendProxy({
  apiKey: process.env.RESEND_API_KEY,
  allowedAudiences: ['your-audience-id'],
}));

app.listen(3001, () => {
  console.log('Proxy server running on port 3001');
});
```

## Advantages of This Approach

- **Security**: API keys are kept secure on the server and never exposed to the client.
- **Flexibility**: Works with any client-side React application.
- **Control**: Full control over the proxy server implementation.

## Production Deployment

For production deployment, you would typically:

1. Build the client-side application:

```bash
npm run build
```

2. Deploy the built files (in the `dist` directory) to a static hosting service.

3. Deploy the proxy server to a Node.js hosting service.

## Learn More

- [React Waitlist Documentation](https://github.com/pmatheusvinhas/react-waitlist)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Express.js Documentation](https://expressjs.com/)

## License

MIT
