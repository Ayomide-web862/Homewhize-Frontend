import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from './App.jsx'

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "223866737352-lgiqu15dp3ber1rfbgto45noeos2nu7k.apps.googleusercontent.com";
if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
  // Log a visible warning in development so you can set the env var
  console.warn('[Google OAuth] VITE_GOOGLE_CLIENT_ID not set — using fallback client id. Update VITE_GOOGLE_CLIENT_ID in your .env for proper branding.');
}

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={googleClientId}>
    <StrictMode>
      <App />
    </StrictMode>
  </GoogleOAuthProvider>
)
