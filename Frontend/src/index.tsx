import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Clerk publishable key not found in environment variables');
}


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)
