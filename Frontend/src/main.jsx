import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";

const isProduction = import.meta.env.MODE === "production";
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || (!isProduction
  ? "223866737352-lgiqu15dp3ber1rfbgto45noeos2nu7k.apps.googleusercontent.com"
  : undefined);

if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
  if (isProduction) {
    console.error(
      "[Google OAuth] VITE_GOOGLE_CLIENT_ID is missing in production. Google sign-in will not work until this env var is configured."
    );
  } else {
    console.warn(
      "[Google OAuth] VITE_GOOGLE_CLIENT_ID not set — using fallback client id for local development."
    );
  }
}

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={googleClientId}>
    <App />
  </GoogleOAuthProvider>
);
