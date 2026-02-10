# Forgot Password Feature - Architecture & Diagrams

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                         │
│                                                             │
│  ┌────────────────┐         ┌──────────────────┐           │
│  │  Login Page    │  ──→    │ ForgotPassword   │           │
│  │                │         │ Page (Step 1)    │           │
│  │ "Forgot Pass?" │         │  Email Input     │           │
│  └────────────────┘         └────────┬─────────┘           │
│                                      │                      │
│                                      │ OTP Received         │
│                                      ▼                      │
│                            ┌──────────────────┐             │
│                            │ ForgotPassword   │             │
│                            │ Page (Step 2)    │             │
│                            │  OTP Input       │             │
│                            └────────┬─────────┘             │
│                                     │                       │
│                                     │ OTP Verified          │
│                                     ▼                       │
│                            ┌──────────────────┐             │
│                            │ ResetPassword    │             │
│                            │ Page             │             │
│                            │ Password Input   │             │
│                            └────────┬─────────┘             │
│                                     │                       │
│                                     │ Password Reset        │
│                                     ▼                       │
│                            ┌──────────────────┐             │
│                            │ Redirect to      │             │
│                            │ Login with       │             │
│                            │ Success Message  │             │
│                            └──────────────────┘             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
                    API Calls │
                              │
┌─────────────────────────────▼─────────────────────────────────┐
│                    Backend (Express/Node)                     │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              Password Router                           │ │
│  │  POST /request-otp                                    │ │
│  │  POST /verify-otp                                     │ │
│  │  POST /reset-password                                 │ │
│  └─────────┬──────────────────────────────────┬──────────┘ │
│            │                                  │            │
│  ┌─────────▼────────────┐        ┌───────────▼──────────┐ │
│  │ Password Controller  │        │  Email Service      │ │
│  │                      │        │ (Nodemailer)        │ │
│  │ • requestOTP()       │        │                     │ │
│  │ • verifyOTPCode()    │────→   │ Send OTP Email      │ │
│  │ • resetPassword()    │        │ (HTML Template)     │ │
│  └─────────┬────────────┘        └─────────────────────┘ │
│            │                                              │
│  ┌─────────▼────────────────────────────────────────────┐ │
│  │        User Model (Database Functions)              │ │
│  │                                                     │ │
│  │ • saveOTP()                                         │ │
│  │ • verifyOTP()                                       │ │
│  │ • updatePasswordById()                              │ │
│  │ • clearOTP()                                        │ │
│  └─────────┬────────────────────────────────────────────┘ │
│            │                                              │
│            ▼                                              │
│  ┌──────────────────────────────────────────────────────┐ │
│  │          MySQL Database                            │ │
│  │  users table with OTP columns                      │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagram

```
User submits Email
    │
    ▼
┌─────────────────────────┐
│ /request-otp Endpoint   │
│ ✓ Validate email exists │
├─────────────────────────┤
│ Generate Random OTP     │
│ Set 1-minute expiry     │
│ Save to database        │
├─────────────────────────┤
│ Send Email with OTP     │
│ (HTML Template)         │
└─────────────────────────┘
    │
    ▼
User receives Email ← Gmail SMTP
    │
    ▼
User submits OTP
    │
    ▼
┌─────────────────────────┐
│ /verify-otp Endpoint    │
│ ✓ Validate OTP format   │
├─────────────────────────┤
│ Check OTP matches       │
│ Check not expired       │
│ ✓ OTP is valid          │
├─────────────────────────┤
│ Generate Reset Token    │
│ Set 15-min expiry       │
│ Save to database        │
│ Return Reset Token      │
└─────────────────────────┘
    │
    ▼
Frontend stores resetToken
Navigates to /reset-password
    │
    ▼
User submits New Password
    │
    ▼
┌─────────────────────────┐
│ /reset-password         │
│ ✓ Validate inputs       │
├─────────────────────────┤
│ Hash new password       │
│ Update in database      │
│ Clear OTP               │
│ Clear reset token       │
│ Success response        │
└─────────────────────────┘
    │
    ▼
Frontend redirects to /login
    │
    ▼
User logs in with new password ✓
```

---

## 🔐 Security Layers

```
Layer 1: Input Validation
├─ Email validation
├─ OTP format check (6 digits)
├─ Password length check (8+ chars)
└─ Express-validator rules

Layer 2: Database Protection
├─ OTP indexed for query optimization
├─ OTP expiry automatic
├─ Single-use enforcement
└─ Password stored hashed

Layer 3: Rate Limiting
├─ 10 requests per 15 minutes
├─ Per-IP tracking
├─ Applied to all endpoints
└─ 429 Too Many Requests

Layer 4: Email Security
├─ Credentials in environment
├─ No credentials in code
├─ HTML injection prevention
└─ Professional template

Layer 5: Token Security
├─ Reset token with expiry
├─ Random generation
├─ Temporary storage only
└─ Automatic cleanup
```

---

## 📈 State Diagram

```
                    ┌─────────────────────┐
                    │   Initial State     │
                    │   No OTP requested  │
                    └──────────┬──────────┘
                               │
                               │ User clicks "Forgot Password?"
                               ▼
                    ┌─────────────────────┐
                    │  Email Submitted    │
                    │  API: request-otp   │
                    └──────────┬──────────┘
                               │
                               ├─ Email not found ──→ Error
                               │
                               │ Email found
                               ▼
                    ┌─────────────────────┐
                    │  OTP Generated      │
                    │  Email Sent         │
                    │  Timer: 1 minute    │
                    └──────────┬──────────┘
                               │
                               ├─ Timeout ──→ OTP Expires
                               │
                               │ User enters OTP
                               ▼
                    ┌─────────────────────┐
    ┌──────────────→│  OTP Verification   │◄──────────────┐
    │               │  API: verify-otp    │               │
    │               └──────────┬──────────┘               │
    │                          │                         │
    │                          ├─ Wrong OTP ──→ Error ──┘
    │                          │
    │                          │ OTP correct
    │                          ▼
    │               ┌─────────────────────┐
    │               │  Reset Token        │
    │               │  Generated & Stored │
    │               └──────────┬──────────┘
    │                          │
    │                          │ Redirect to reset-password
    │                          ▼
    │               ┌─────────────────────┐
    │               │  New Password Form  │
    │               │  Page Displayed     │
    │               └──────────┬──────────┘
    │                          │
    │                          │ User submits password
    │                          ▼
    │               ┌─────────────────────┐
    │    ┌─────────→│  Password Reset     │◄──────────────┐
    │    │          │  API: reset-pass    │               │
    │    │          └──────────┬──────────┘               │
    │    │                     │                          │
    │    │                     ├─ Mismatch ──→ Error ────┤
    │    │                     ├─ Too short ──→ Error ───┤
    │    │                     ├─ Expired ──→ Error ────┤
    │    │                     │                          │
    │    │                     │ Valid                    │
    │    │                     ▼                          │
    │    │          ┌─────────────────────┐              │
    │    │          │  Password Updated   │              │
    │    │          │  OTP Cleared        │              │
    │    │          │  Success Response   │              │
    │    │          └──────────┬──────────┘              │
    │    │                     │                         │
    │    │                     │ Redirect to /login      │
    │    │                     ▼                         │
    │    │          ┌─────────────────────┐
    │    └─────────→│  Login Page         │
    └──────────────│  Success Message    │
                   └─────────────────────┘
```

---

## 🔄 Request-Response Cycle

```
┌─ REQUEST ─────────────────────────────────────┐
│                                               │
│ POST /request-otp                             │
│ {                                             │
│   "email": "user@example.com"                 │
│ }                                             │
│                                               │
└───────────────────────────────────────────────┘
                    │
         API Processing
                    │
┌─ RESPONSE ────────────────────────────────────┐
│                                               │
│ 200 OK                                        │
│ {                                             │
│   "message": "OTP sent to your email",        │
│   "email": "user@example.com"                 │
│ }                                             │
│                                               │
│ Email Content:                                │
│ ┌──────────────────────────┐                  │
│ │  HomeWhize Logo          │                  │
│ │  Password Reset Request  │                  │
│ │  Your OTP: 123456        │                  │
│ │  Valid for 1 minute      │                  │
│ └──────────────────────────┘                  │
│                                               │
└───────────────────────────────────────────────┘
```

---

## 📁 File Organization

```
HomeWhize/
├── Backend/
│   ├── controllers/
│   │   └── passwordController.js ✓ (Modified)
│   ├── models/
│   │   └── userModel.js ✓ (Modified)
│   ├── routes/
│   │   └── passwordRouter.js ✓ (Modified)
│   ├── migrations/
│   │   └── 002_otp_password_reset.sql ✓ (NEW)
│   ├── server.js
│   └── .env
│
├── Frontend/
│   └── src/
│       ├── pages/
│       │   ├── ForgotPasswordPage.jsx ✓ (NEW)
│       │   ├── ResetPasswordPage.jsx ✓ (NEW)
│       │   ├── ForgotPasswordAuth.css ✓ (NEW)
│       │   ├── Login.jsx ✓ (Modified)
│       │   └── Auth.css
│       ├── App.jsx ✓ (Modified)
│       └── api/
│           └── axios.js
│
└── Documentation/
    ├── DOCUMENTATION_INDEX.md ✓ (NEW)
    ├── FORGOT_PASSWORD_SETUP.md ✓ (NEW)
    ├── FORGOT_PASSWORD_FEATURE.md ✓ (NEW)
    ├── IMPLEMENTATION_SUMMARY.md ✓ (NEW)
    ├── IMPLEMENTATION_VERIFICATION.md ✓ (NEW)
    ├── API_TESTING_GUIDE.md ✓ (NEW)
    └── README_FORGOT_PASSWORD.md ✓ (NEW)
```

---

## 🔌 Integration Points

```
Frontend
   │
   ├─→ Axios Instance
   │      │
   │      └─→ http://localhost:5000/api
   │
   ├─→ React Router
   │      ├─ /forgot-password
   │      └─ /reset-password
   │
   └─→ localStorage
          ├─ resetToken
          └─ resetEmail

Backend
   │
   ├─→ Express Server (Port 5000)
   │      ├─ Rate Limiter
   │      ├─ CORS
   │      └─ Helmet Security
   │
   ├─→ Database (MySQL)
   │      ├─ users table
   │      ├─ otp column
   │      ├─ otp_expire column
   │      ├─ reset_token column
   │      └─ reset_token_expire column
   │
   └─→ Email Service (Gmail SMTP)
          ├─ authentication
          └─ HTML templates
```

---

## 📊 Timeline Diagram

```
User Action              Time         System Action
───────────────────────────────────────────────────────────
Click "Forgot Password"  T+0s         ✓ Navigate to form

Enter email & submit     T+1-5s       → API: /request-otp
                                      ← OTP generated
                                      → Email sent

Email arrives            T+5-15s      ✓ User receives OTP

Enter OTP & submit       T+20-60s     → API: /verify-otp
                                      ✓ OTP valid (if < 60s)
                                      ✗ OTP expired (if > 60s)
                                      ← Reset token generated

Navigate to reset page   T+65s        ✓ Password form shown

Enter password & submit  T+70-900s    → API: /reset-password
                                      ✓ Password updated
                                      ← Success response

Redirect to login        T+905s       ✓ Login page shown
                                      ✓ Password reset complete
```

---

## 🎯 Component Hierarchy

```
App.jsx
├── Router
│   └── Routes
│       ├── /login
│       │   └── Login.jsx
│       │       └── "Forgot Password?" Link
│       │           → /forgot-password
│       │
│       ├── /forgot-password ✓ NEW
│       │   └── ForgotPasswordPage.jsx
│       │       ├── Form (Step 1)
│       │       │   └── Email Input
│       │       │
│       │       ├── Form (Step 2)
│       │       │   ├── OTP Input
│       │       │   └── Timer Display
│       │       │
│       │       ├── Error Messages
│       │       ├── Loading States
│       │       └── Navigation
│       │
│       └── /reset-password ✓ NEW
│           └── ResetPasswordPage.jsx
│               ├── Password Input
│               ├── Confirm Input
│               ├── Validation Messages
│               ├── Eye Toggle Icons
│               ├── Error Messages
│               ├── Loading States
│               └── Navigation

Styling
└── ForgotPasswordAuth.css
    ├── .forgot-password-page
    ├── .forgot-password-card
    ├── .reset-password-page
    ├── .reset-password-card
    └── Media Queries (768px, 480px)
```

---

## 🔄 Data Transformation

```
User Input: "test@example.com"
    ↓
[Validation: Valid email format?]
    ↓
[Database: Email exists?]
    ↓
Generate OTP: 6 random digits
    ↓
Hash for storage (if needed)
    ↓
Set expiry: NOW + 60 seconds
    ↓
Save to database: users.otp, users.otp_expire
    ↓
Format email template
    ↓
Send via SMTP (Gmail)
    ↓
User receives email
    ↓
User enters OTP
    ↓
[Validation: 6 digits only?]
    ↓
[Database: Matches stored OTP?]
    ↓
[Validation: Not expired?]
    ↓
Generate reset token: Random 32 bytes
    ↓
Set expiry: NOW + 900 seconds (15 min)
    ↓
Save to database: users.reset_token
    ↓
Return token to frontend
    ↓
User submits new password
    ↓
[Validation: Min 8 characters?]
    ↓
[Validation: Matches confirmation?]
    ↓
Hash password: bcrypt(password)
    ↓
Save to database: users.password
    ↓
Clear OTP: users.otp = NULL
    ↓
Clear token: users.reset_token = NULL
    ↓
Return success response
    ↓
Redirect to login page ✓
```

---

**Generated:** February 4, 2026
**Version:** 1.0
**Status:** Complete
