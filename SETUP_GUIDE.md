# PADUP - Complete Setup & Deployment Guide

## What Was Fixed

✅ **Backend CORS** — now reads `FRONTEND_URLS` from env; set to `http://localhost:5173` for dev  
✅ **Backend .env** — removed production domain; added `FRONTEND_URLS`, `NODE_ENV`, `DB_CONN_LIMIT`  
✅ **Frontend .env** — cleared production domain; dev mode now auto-uses `http://localhost:5000/api`  
✅ **Frontend API axios** — added logging to show resolved base URL at runtime  
✅ **Database pool** — using connection pool (promise + callback support)  
✅ **Input validation** — express-validator on auth/password routes  
✅ **Security** — Helmet (CSP), rate limiting, HTTPS redirect option, trust proxy  
✅ **Password reset** — DB-backed tokens (no in-memory storage)  

---

## Quick Start (Local Development)

### 1. Terminal 1 — Start Backend

```bash
cd Backend
node server.js
# or with auto-restart:
nodemon server.js
```

**Expected output:**
```
✅ Backend initialized
   Allowed CORS origins: [ 'http://localhost:5173' ]
   NODE_ENV: development
   FORCE_HTTPS: false
MySQL pool connected
Server running on port 5000
```

**Test it:**
```bash
curl http://localhost:5000/
# Should return: { message: "HomeWhize Backend is running", env: "development", allowedOrigins: [...] }

curl http://localhost:5000/api/properties/public
# Should return: [] (or array of properties if data exists)
```

---

### 2. Terminal 2 — Start Frontend

```bash
cd Frontend
npm run dev
```

**Expected output:**
```
  VITE v5... ready in XXX ms
  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

**Check browser console (DevTools):**
- Should see: `[API] Resolved baseURL: http://localhost:5000/api`
- Should see: `Running in development mode — ignoring VITE_API_BASE_URL and using http://localhost:5000/api`
- No CORS errors

---

### 3. Browser — Test the App

1. Go to `http://localhost:5173/shortlets`
2. You should see the **Shortlets page** with:
   - Search box
   - Available shortlets displayed as cards
   - Images and property details (if data exists in DB)

If shortlets are empty:
- Check backend console for errors
- Run: `curl http://localhost:5000/api/properties/public`
- Verify `properties` table has data in MySQL

---

## Database Setup

Add the reset token columns (if not already present):

```sql
ALTER TABLE users
  ADD COLUMN reset_token VARCHAR(255) NULL,
  ADD COLUMN reset_token_expire DATETIME NULL;
```

Verify tables exist:
```sql
SHOW TABLES;
-- Should include: users, properties, property_images, bookings, kyc_requests, community_posts, etc.
```

Sample test data (optional):
```sql
INSERT INTO properties (name, address, location, price, bedrooms, bathrooms, max_guests, status, description)
VALUES ('Test Apartment', '123 Main St', 'Lagos', 50000, 2, 1, 4, 'Available', 'Test property');
```

---

## Environment Variables (Production)

### Backend (Backend/.env)

```bash
# Server
PORT=5000
NODE_ENV=production
FORCE_HTTPS=true

# Database
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password_rotated_NOW
DB_NAME=your_db_name
DB_CONN_LIMIT=20

# Security
JWT_SECRET=your_very_long_random_secret_32_chars_min

# CORS — comma-separated if multiple origins
FRONTEND_URLS=https://yourdomain.com,https://www.yourdomain.com

# Email (use transactional provider in prod)
EMAIL_USER=noreply@yourdomain.com
EMAIL_PASS=your_api_key_or_password

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id

# Cloudinary
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (set in CI/CD or hosting env, NOT in .env)

```bash
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

For **Vercel/Netlify**, set these in project settings → Environment Variables.

---

## Deployment Checklist

- [ ] Rotate all secrets (JWT_SECRET, EMAIL_PASS, CLOUDINARY_API_SECRET)
- [ ] Set `NODE_ENV=production` on backend
- [ ] Set `FORCE_HTTPS=true` and ensure TLS certificate installed
- [ ] Set `FRONTEND_URLS` to your production domain(s)
- [ ] Database backup and migrations run
- [ ] Backend behind reverse proxy (nginx) with TLS
- [ ] Frontend built with `npm run build` and `VITE_API_BASE_URL` set
- [ ] Use PM2 or systemd to manage backend process
- [ ] Add Sentry/logging for error tracking
- [ ] Enable monitoring and uptime checks
- [ ] Set up CI/CD pipeline (GitHub Actions, GitLab CI, etc.)

---

## Troubleshooting

### CORS Error: "Response to preflight request doesn't pass access control check"

**Cause:** Backend not recognizing frontend origin.

**Fix:**
1. Verify `Backend/.env` has `FRONTEND_URLS` set to your frontend origin
2. Restart backend: `node server.js`
3. Check backend console for: `Allowed CORS origins: [...]`
4. If not there, CORS env is not loaded

```bash
# Test CORS directly:
curl -X OPTIONS http://localhost:5000/api/properties/public \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: GET" \
  -v
# Should return 200 with Access-Control-Allow-Origin header
```

### Shortlets Not Loading (Empty Page)

**Causes:**
1. Backend not running → Start it
2. Database empty → Insert test data (see Database Setup)
3. API returning error → Check backend console
4. Frontend not hitting backend → Check browser DevTools Network tab, API logs

**Debug:**
```bash
# Terminal
curl http://localhost:5000/api/properties/public | jq

# Browser DevTools → Network tab → click request → Response tab
# Should show JSON array (even if empty)
```

### "Failed to fetch shortlets: AxiosError"

**Cause:** Backend not reachable or CORS blocking.

**Fix:**
1. Ensure backend is running: `ps aux | grep node`
2. Check backend logs for errors
3. Test endpoint manually: `curl http://localhost:5000/api/properties/public`
4. If DNS fails: backend may not be on expected host

---

## Production Architecture (Recommended)

```
┌─────────────────────────────────────────────────┐
│  Frontend (React + Vite)                        │
│  - Deployed to: Vercel, Netlify, or S3 + CDN   │
│  - VITE_API_BASE_URL=https://api.domain.com/api│
└───────────────┬─────────────────────────────────┘
                │ HTTPS
┌───────────────▼─────────────────────────────────┐
│  nginx (reverse proxy, TLS termination)         │
│  ├─ Port 443 (HTTPS)                           │
│  └─ Forwards to: http://localhost:5000         │
└───────────────┬─────────────────────────────────┘
                │ HTTP (internal)
┌───────────────▼─────────────────────────────────┐
│  Node.js Backend (PM2 managed)                  │
│  ├─ PORT=5000                                   │
│  ├─ NODE_ENV=production                         │
│  └─ trust proxy=1                               │
└───────────────┬─────────────────────────────────┘
                │
┌───────────────▼─────────────────────────────────┐
│  MySQL Database (with backups)                  │
└─────────────────────────────────────────────────┘
```

---

## Next Steps

1. **Logging & Monitoring** — Add Winston/Pino + Sentry
2. **CI/CD** — GitHub Actions pipeline (test → build → deploy)
3. **Docker** — Containerize both services for reproducibility
4. **Tests** — Unit + integration tests for auth/booking flows
5. **Email Provider** — Migrate from Gmail SMTP to SendGrid/Mailgun

---

## File Summary

**Backend:**
- `Backend/server.js` — CORS from env, debug logging
- `Backend/.env` — FRONTEND_URLS for CORS, env vars organized
- `Backend/config/db.js` — Connection pool (promise + callback)
- `Backend/routes/authRoutes.js` — Input validation with express-validator
- `Backend/routes/passwordRouter.js` — Validation on forgot/reset
- `Backend/controllers/passwordController.js` — DB-backed password reset
- `Backend/models/userModel.js` — Reset token helpers

**Frontend:**
- `Frontend/.env` — Empty (dev auto-uses localhost)
- `Frontend/.env.example` — Production template
- `Frontend/src/api/axios.js` — Dev mode forces localhost, prod uses env with fallback
- `Frontend/src/pages/ShortletsPage.jsx` — Uses centralized api instance
- All admin/property pages — Centralized API calls

**Docs:**
- `.gitignore` — Prevent .env commits
- `Backend/.env.example` — Secrets template
- `Frontend/.env.example` — API config template
- `README_DEPLOY.md` — Deployment checklist

---

**You're now production-ready!** 🚀
