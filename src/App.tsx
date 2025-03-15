import { useState } from 'react'
import './App.css'

// Import from the installed package
import { WaitlistForm, materialUIDefaultTheme } from 'react-waitlist'

// Define the event data interface
interface WaitlistEventData {
  type: string;
  timestamp: string;
  field?: string;
  formData?: Record<string, any>;
  response?: any;
  error?: {
    message: string;
    code?: string;
  };
  securityType?: string;
  details?: Record<string, any>;
}

// Define the security event data interface
interface SecurityEventData {
  timestamp: string;
  securityType: string;
  details: Record<string, any>;
}

// Create a custom theme with reduced spacing
const compactTheme = {
  ...materialUIDefaultTheme,
  spacing: {
    xs: '0.125rem', // 2px (reduced)
    sm: '0.25rem',  // 4px (reduced)
    md: '0.5rem',   // 8px (reduced)
    lg: '0.75rem',  // 12px (reduced)
    xl: '1rem',     // 16px (reduced)
  },
  components: {
    ...materialUIDefaultTheme.components,
    container: {
      ...materialUIDefaultTheme.components?.container,
      padding: '1rem',
    },
    title: {
      ...materialUIDefaultTheme.components?.title,
      fontSize: '1.25rem',
      marginBottom: '0.5rem',
    },
    description: {
      ...materialUIDefaultTheme.components?.description,
      marginBottom: '0.75rem',
    },
    form: {
      ...materialUIDefaultTheme.components?.form,
      gap: '0.5rem',
    },
    fieldContainer: {
      ...materialUIDefaultTheme.components?.fieldContainer,
      marginBottom: '0.5rem',
    },
    label: {
      ...materialUIDefaultTheme.components?.label,
      marginBottom: '0.125rem',
    },
    input: {
      ...materialUIDefaultTheme.components?.input,
      padding: '0.5rem 0.5rem',
    },
    button: {
      ...materialUIDefaultTheme.components?.button,
      padding: '0.5rem 1.25rem',
    },
  }
}

function App() {
  // State to store events for logging
  const [events, setEvents] = useState<WaitlistEventData[]>([])
  const [apiCalls, setApiCalls] = useState<{timestamp: string, type: string, data: any}[]>([])

  // Debug environment variables
  console.log('Frontend Environment Variables:', {
    resendAudienceId: import.meta.env.VITE_RESEND_AUDIENCE_ID,
    resendProxyEndpoint: import.meta.env.VITE_RESEND_PROXY_ENDPOINT,
    recaptchaSiteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
    recaptchaProxyEndpoint: import.meta.env.VITE_RECAPTCHA_PROXY_ENDPOINT
  });

  // Add event to the log
  const logEvent = (event: WaitlistEventData) => {
    console.log('Event logged:', event); // Debug log
    setEvents(prev => [event, ...prev])
  }

  // Add API call to the log
  const logApiCall = (type: string, data: any) => {
    console.log('API call logged:', type, data); // Debug log
    setApiCalls(prev => [{
      timestamp: new Date().toISOString(),
      type,
      data
    }, ...prev])
  }

  // Log API errors
  const logApiError = (type: string, error: any) => {
    console.log('API error logged:', type, error); // Debug log
    logApiCall(`${type}_ERROR`, { 
      message: error.message || 'Unknown error',
      stack: error.stack,
      name: error.name
    })
  }

  // Handle security events
  const handleSecurityEvent = (data: SecurityEventData) => {
    console.log('Security event received:', data); // Debug log
    logEvent({
      type: 'security',
      timestamp: data.timestamp,
      securityType: data.securityType,
      details: data.details
    })
    
    // Also log to API calls for visibility
    logApiCall('SECURITY', {
      type: data.securityType,
      ...data.details
    })
  }

  // Simulated database function
  const saveToDatabase = async (data: any) => {
    logApiCall('DATABASE', { action: 'save', data })
    // In a real app, this would be an API call to your backend
    return new Promise((resolve) => {
      setTimeout(() => {
        const result = { success: true, id: 'user_' + Math.random().toString(36).substr(2, 9) }
        logApiCall('DATABASE', { action: 'response', data: result })
        resolve(result)
      }, 1000)
    })
  }

  return (
    <div className="app-container">
      <header>
        <h1>React Waitlist Example</h1>
        <h2>Client-Side with Proxy</h2>
        <p>This example demonstrates using the WaitlistForm component with a proxy endpoint to protect your API keys.</p>
      </header>

      <main className="main-content">
        <div className="form-container">
          <WaitlistForm 
            title="Join our waitlist"
            description="Be the first to know when we launch our new product."
            submitText="Join Now"
            
            // Use custom compact theme
            theme={compactTheme}
            
            // Enable security features
            security={{
              enableHoneypot: true,
              checkSubmissionTime: true,
              minSubmissionTime: 2000, // 2 seconds for testing
              enableReCaptcha: true,
              reCaptchaSiteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
              recaptchaProxyEndpoint: import.meta.env.VITE_RECAPTCHA_PROXY_ENDPOINT || "http://localhost:3001/api/recaptcha-proxy",
            }}
            
            // Resend integration
            resendAudienceId={import.meta.env.VITE_RESEND_AUDIENCE_ID}
            resendProxyEndpoint={import.meta.env.VITE_RESEND_PROXY_ENDPOINT || "http://localhost:3001/api/resend-proxy"}
            
            // Custom fields
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
                name: 'lastName',
                type: 'text',
                label: 'Last Name',
                required: false,
                placeholder: 'Doe',
              },
              {
                name: 'company',
                type: 'text',
                label: 'Company',
                required: false,
                placeholder: 'Acme Inc.',
              },
              {
                name: 'role',
                type: 'select',
                label: 'Role',
                required: false,
                placeholder: 'Select your role',
                options: ['Developer', 'Designer', 'Product Manager', 'Other']
              },
              {
                name: 'newsletter',
                type: 'checkbox',
                label: 'Subscribe to newsletter',
                required: true,
                defaultValue: true
              }
            ]}
            
            // Event handlers
            onFieldFocus={(data) => {
              logEvent({
                type: 'field_focus',
                timestamp: data.timestamp,
                field: data.field
              })
            }}
            
            onSubmit={(data) => {
              logEvent({
                type: 'submit',
                timestamp: data.timestamp,
                formData: data.formData
              })
            }}
            
            onSuccess={async (data) => {
              logEvent({
                type: 'success',
                timestamp: data.timestamp,
                formData: data.formData,
                response: data.response
              })
              
              // Handle the form submission yourself
              try {
                const result = await saveToDatabase(data.formData)
                return { success: true, data: result }
              } catch (error) {
                console.error('Error saving data:', error)
                logApiError('DATABASE', error)
                throw new Error('Failed to save data')
              }
            }}
            
            onError={(data) => {
              logEvent({
                type: 'error',
                timestamp: data.timestamp,
                formData: data.formData,
                error: {
                  message: data.error.message
                }
              })
              
              // Log the error in API calls too
              logApiError('FORM_SUBMISSION', data.error)
            }}
            
            // Add handler for security events
            onSecurityEvent={handleSecurityEvent}
            
            // Resend mapping
            resendMapping={{
              email: 'email',
              firstName: 'firstName',
              lastName: 'lastName',
              metadata: ['company', 'role', 'newsletter']
            }}
          />
        </div>
        
        <div className="logs-wrapper">
          <div className="event-log-container">
            <h3>Event Log</h3>
            <div className="event-log">
              {events.map((event, index) => (
                <div key={index} className="event-item">
                  <div className="event-header">
                    <span className={`event-type ${event.type === 'error' ? 'event-error' : ''} ${event.type === 'security' && event.securityType?.includes('failed') ? 'event-error' : ''} ${event.type === 'security' ? 'event-security' : ''}`}>
                      {event.type === 'security' ? `${event.type}:${event.securityType}` : event.type}
                    </span>
                    <span className="event-time">{new Date(event.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <pre className="event-data">{JSON.stringify(event, null, 2)}</pre>
                </div>
              ))}
              {events.length === 0 && <p className="no-events">No events yet. Interact with the form to see events.</p>}
            </div>
            
            <h3>API Calls</h3>
            <div className="api-log">
              {apiCalls.map((call, index) => (
                <div key={index} className="api-item">
                  <div className="api-header">
                    <span className={`api-type ${call.type.includes('ERROR') ? 'api-error' : ''} ${call.type === 'SECURITY' && call.data.type?.includes('failed') ? 'api-error' : ''} ${call.type === 'SECURITY' ? 'api-security' : ''}`}>
                      {call.type}
                    </span>
                    <span className="api-time">{new Date(call.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <pre className="api-data">{JSON.stringify(call.data, null, 2)}</pre>
                </div>
              ))}
              {apiCalls.length === 0 && <p className="no-events">No API calls yet. Submit the form to see API calls.</p>}
            </div>
          </div>
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
