import { useState } from 'react'
import './App.css'

// Import the WaitlistForm from the local react-waitlist package
// In a real application, you would use: import { WaitlistForm } from 'react-waitlist';
import WaitlistForm from '../../../src/components/WaitlistForm'

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>React Waitlist Example</h1>
        <h2>Client-Side with Proxy</h2>
        <p>This example demonstrates using the WaitlistForm component with a proxy endpoint to protect your API keys.</p>
      </header>

      <main>
        <div className="form-container">
          <WaitlistForm 
            resendAudienceId="your-audience-id"
            resendProxyEndpoint="http://localhost:3001/api/resend-proxy"
            title="Join Our Waitlist"
            description="Be the first to know when we launch our new product."
            submitText="Join Now"
            fields={[
              {
                name: 'email',
                type: 'email',
                label: 'Email',
                required: true,
                placeholder: 'your@email.com',
              },
              {
                name: 'firstName',
                type: 'text',
                label: 'First Name',
                required: false,
                placeholder: 'John',
              },
              {
                name: 'role',
                type: 'select',
                label: 'Role',
                options: [
                  { value: 'developer', label: 'Developer' },
                  { value: 'designer', label: 'Designer' },
                  { value: 'product', label: 'Product Manager' },
                  { value: 'other', label: 'Other' }
                ],
                required: false,
              }
            ]}
            onSuccess={(data: { formData: any; response: any }) => {
              console.log('Success:', data.formData, data.response);
            }}
            onError={(data: { error: any }) => {
              console.error('Error:', data.error);
            }}
          />
        </div>
      </main>

      <footer>
        <p>This is an example of using React Waitlist with a proxy endpoint.</p>
        <p>
          <a href="https://github.com/pmatheusvinhas/react-waitlist" target="_blank" rel="noopener noreferrer">
            View on GitHub
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App
