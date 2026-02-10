import axios from "axios";

let base = import.meta.env.VITE_API_BASE_URL || "";

// During local development, always use the local backend unless explicitly
// configured otherwise. This prevents accidental requests to production DNS
// (which may not resolve locally) while developing.
if (import.meta.env.MODE === "development") {
  if (base && !base.includes("localhost")) {
    console.warn(
      "Running in development mode — ignoring VITE_API_BASE_URL and using http://localhost:5000/api"
    );
  }
  base = "http://localhost:5000/api";
} else {
  // Production / staging: ensure '/api' segment exists
  if (base && !/\/api(\/|$)/.test(base)) {
    console.warn("VITE_API_BASE_URL does not contain '/api' — appending '/api' for API paths.");
    base = base.replace(/\/$/, "") + "/api";
  }

  if (!base) {
    console.error('VITE_API_BASE_URL is not set. Frontend may not reach backend.');
  }
}

const resolvedBase = base || "http://localhost:5000/api";
console.log("[API] Resolved baseURL:", resolvedBase);

const api = axios.create({
  baseURL: resolvedBase,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default api;
