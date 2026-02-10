# Deployment and Production Readiness Checklist

This project contains a backend (Node/Express) and frontend (Vite + React).

Essential steps before deploying:

1. Environment variables
   - Backend: create a `.env` with values from `Backend/.env.example` (do NOT commit `.env`).
   - Frontend: set `VITE_API_BASE_URL` in your CI/CD or hosting environment (e.g., `https://api.yourdomain.com/api`).

2. Database
   - Run migrations and create the necessary tables.
   - Ensure connection pool values are set (`DB_CONN_LIMIT`).

3. Secrets rotation
   - If any secrets were committed, rotate them immediately (EMAIL_PASS, CLOUDINARY_API_SECRET, JWT_SECRET).

4. Build and serve frontend
   - Use `npm run build` in `Frontend` with `VITE_API_BASE_URL` set to the backend production URL.
   - Serve static files via CDN or a hosting platform (Netlify, Vercel, or your own static host + CDN).

5. Backend deployment
   - Run `npm install --production` on the server.
   - Set `NODE_ENV=production` and `FORCE_HTTPS=true` (if behind HTTPS).
   - Use a process manager (PM2, systemd) behind a reverse proxy (nginx) with TLS.

6. Logging & monitoring
   - Add structured logging (winston/pino) and error monitoring (Sentry).

7. Security
   - Ensure `JWT_SECRET` is set and strong.
   - Use a transactional email provider and do not expose SMTP passwords in code.
   - Use HTTP security headers (CSP) and limit CORS via `FRONTEND_URLS` env.

8. CI/CD
   - Add pipeline to run tests, build frontend with `VITE_API_BASE_URL`, and deploy backend.

Quick local dev
- Frontend:
  cd Frontend
  npm install
  npm run dev

- Backend:
  cd Backend
  npm install
  node server.js

If you want, I can:
- Add a migration file for the `users.reset_token` columns and a small migration runner.
- Create `Dockerfile`s for both frontend and backend and a `docker-compose.yml` for staging.
- Wire up `winston` logging and a Sentry integration stub.
