## Forgot Password Feature - Implementation Guide

### Overview
A complete OTP-based password reset flow has been implemented for the HomeWhize application. Users receive a 6-digit OTP via email that expires in 1 minute, and can then securely reset their password.

---

## Backend Implementation

### Database Changes
**File:** `Backend/migrations/002_otp_password_reset.sql`

Adds the following columns to the `users` table:
- `otp` - Stores the 6-digit OTP
- `otp_expire` - Timestamp for OTP expiry
- `reset_token` - Temporary token after OTP verification
- `reset_token_expire` - Token expiry timestamp

**How to Apply:**
```bash
# Execute the migration on your MySQL database
mysql -h <DB_HOST> -u <DB_USER> -p <DB_NAME> < Backend/migrations/002_otp_password_reset.sql
```

### Backend Files Modified/Created

#### 1. **Controller:** `Backend/controllers/passwordController.js`
Three main functions:

- **`requestOTP(req, res)`** - Sends OTP to user email
  - Validates email exists
  - Generates random 6-digit OTP
  - Saves OTP with 1-minute expiry
  - Sends formatted email with OTP

- **`verifyOTPCode(req, res)`** - Validates OTP
  - Checks OTP matches and is not expired
  - Generates temporary reset token (15-minute validity)
  - Returns resetToken for password reset step

- **`resetPasswordWithToken(req, res)`** - Resets password
  - Validates new password (min 8 characters)
  - Hashes password with bcrypt
  - Clears OTP after successful reset

#### 2. **Routes:** `Backend/routes/passwordRouter.js`
Three endpoints with validation:

```
POST /api/auth/password/request-otp
  Body: { email }
  Response: { message, email }

POST /api/auth/password/verify-otp
  Body: { email, otp }
  Response: { message, resetToken }

POST /api/auth/password/reset-password
  Body: { email, resetToken, newPassword }
  Response: { message }
```

#### 3. **Model:** `Backend/models/userModel.js`
New functions added:
- `saveOTP(userId, otp, expireAt, callback)` - Stores OTP
- `verifyOTP(userId, otp, callback)` - Validates OTP and expiry
- `clearOTP(userId, callback)` - Clears OTP after reset

### Email Configuration
**Required Environment Variables:**
```
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_specific_password
FRONTEND_URL=https://your-frontend.com
```

Email template uses:
- Theme color: #0F4D3C (dark green)
- Background: #F6EEE2 (light beige)
- Professional HTML formatting with HomeWhize branding

---

## Frontend Implementation

### New Pages Created

#### 1. **ForgotPasswordPage.jsx** (`Frontend/src/pages/ForgotPasswordPage.jsx`)
Two-step form:

**Step 1: Request OTP**
- Email input field
- Displays error/success messages
- Loading state management

**Step 2: Verify OTP**
- 6-digit OTP input (numeric only)
- Shows "Valid for 1 minute" timer
- Validates before submission
- Navigates to reset password on success

**Features:**
- Back button to return to login
- Responsive design
- Form validation
- Loading indicators
- Error handling

#### 2. **ResetPasswordPage.jsx** (`Frontend/src/pages/ResetPasswordPage.jsx`)
Password reset form with:

- New password input with show/hide toggle
- Confirm password field with show/hide toggle
- Password strength indicator (min 8 characters)
- Validation that both passwords match
- Session validation (checks for valid resetToken)
- Success message and redirect to login

**Features:**
- Back button to forgot password page
- Eye icon toggle for password visibility
- Disabled inputs during submission
- Automatic session cleanup (localStorage)
- 2-second redirect to login after success

### CSS Styling

**File:** `Frontend/src/pages/ForgotPasswordAuth.css`

Comprehensive styling for both pages:
- Maintains website theme (green: #0F4D3C, beige: #F6EEE2)
- Consistent with existing Auth.css patterns
- Success/error message styling
- Input focus states
- Button hover/active states
- Mobile responsive design (breakpoints at 768px and 480px)
- Eye icon animations
- Back button hover effects

### Updated Files

#### 1. **App.jsx** (`Frontend/src/App.jsx`)
Added two new routes:
```jsx
<Route path="/forgot-password" element={<ForgotPasswordPage />} />
<Route path="/reset-password" element={<ResetPasswordPage />} />
```

#### 2. **Login.jsx** (`Frontend/src/pages/Login.jsx`)
- Imported `useNavigate` from react-router-dom
- Changed "Forgot password?" link from prompt dialog to navigation
- Now navigates to `/forgot-password` page

---

## User Flow Diagram

```
┌─────────────┐
│   Login     │ ← User clicks "Forgot password?"
└──────┬──────┘
       │
       ▼
┌──────────────────────────┐
│ ForgotPasswordPage       │
│ Step 1: Request OTP      │
│ - Enter email            │
│ - Click "Send OTP"       │
└──────────┬───────────────┘
           │
           ├─ API: /auth/password/request-otp
           │  └─ Email sent with OTP
           │
           ▼
┌──────────────────────────┐
│ ForgotPasswordPage       │
│ Step 2: Verify OTP       │
│ - Enter 6-digit OTP      │
│ - Click "Verify OTP"     │
└──────────┬───────────────┘
           │
           ├─ API: /auth/password/verify-otp
           │  └─ OTP validated, resetToken generated
           │
           ▼
┌──────────────────────────┐
│ ResetPasswordPage        │
│ - New password           │
│ - Confirm password       │
│ - Click "Reset Password" │
└──────────┬───────────────┘
           │
           ├─ API: /auth/password/reset-password
           │  └─ Password updated, OTP cleared
           │
           ▼
┌─────────────┐
│   Login     │ ← Redirect after 2 seconds
└─────────────┘
```

---

## Theme Consistency

### Color Scheme
- **Primary Green:** #0F4D3C
- **Background Beige:** #F6EEE2
- **Input Background:** #FAF6F0
- **Border Color:** #DCD4C8
- **Text Color:** #546C5F
- **Success Green:** #28A745
- **Error Red:** #DC3545
- **Warning Orange:** #D97706

### Typography
- **Font Family:** Poppins
- **Font Weights:** 400 (regular), 600 (semibold), 700 (bold)
- **Font Sizes:** Follow existing Auth.css patterns

### Spacing & Sizing
- Padding: Consistent with existing components
- Border Radius: 0.6-1rem (matches Auth.css)
- Max Width: 420px (same as Login card)
- Shadow: 0 4px 20px rgba(0, 0, 0, 0.08)

---

## Security Features

### 1. **OTP Security**
- Random 6-digit generation
- 1-minute expiry time
- Single-use validation
- Cleared after successful reset

### 2. **Password Security**
- Minimum 8 characters required
- Bcrypt hashing with salt rounds
- Password confirmation validation
- No password exposed in transit

### 3. **Session Security**
- Reset token with 15-minute validity
- Temporary token stored in localStorage
- Automatic session cleanup
- Validated on each step

### 4. **Email Security**
- Uses environment variables for credentials
- HTML email template prevents injection
- User verification required

### 5. **Rate Limiting**
- Existing auth rate limiter applies
- 10 requests per 15 minutes per IP
- Prevents brute force attempts

---

## Error Handling

### Frontend
- User-friendly error messages
- Validation feedback
- Loading state management
- Session validation checks
- Network error handling

### Backend
- Input validation with express-validator
- Database error handling
- Email sending error handling
- OTP expiry checking
- Token validation

---

## Testing Checklist

- [ ] Request OTP with valid email
- [ ] Request OTP with invalid email (shows error)
- [ ] Receive email with OTP
- [ ] Verify OTP with correct code
- [ ] Attempt OTP after 1 minute (should fail)
- [ ] Enter wrong OTP (should show error)
- [ ] Reset password successfully
- [ ] Password shorter than 8 characters (shows error)
- [ ] Passwords don't match (shows error)
- [ ] Confirm passwords match and redirect to login
- [ ] Test on mobile devices
- [ ] Test on different browsers

---

## Troubleshooting

### OTP not received
1. Check `EMAIL_USER` and `EMAIL_PASS` in `.env`
2. Verify Gmail app password is used (not regular password)
3. Check email spam folder
4. Ensure FRONTEND_URL is correct in `.env`

### Reset token expired
1. Process must be completed within 15 minutes
2. OTP request must be completed within 1 minute
3. Restarting flow will generate new tokens

### Password reset fails
1. Ensure email matches the request
2. New password must be at least 8 characters
3. Check database connectivity
4. Verify bcrypt is installed

### Style issues
1. Import `ForgotPasswordAuth.css` in components
2. Check Poppins font is loaded globally
3. Verify CSS cascade doesn't override styles
4. Clear browser cache

---

## Future Enhancements

1. **Email Verification:** Add email verification on signup
2. **Two-Factor Auth:** Optional 2FA option
3. **Password Strength Meter:** Real-time strength indicator
4. **Login Attempts:** Lock account after failed attempts
5. **OTP SMS:** Alternative OTP delivery via SMS
6. **Social Recovery:** Account recovery using social login
7. **Security Questions:** Additional recovery method
8. **Audit Logging:** Log all password reset attempts

---

## Deployment Notes

### Development
```bash
# Frontend
npm run dev
# Access at http://localhost:5173

# Backend
npm start
# API at http://localhost:5000/api
```

### Production
1. Update `.env` with production values
2. Run database migration: `002_otp_password_reset.sql`
3. Set `FORCE_HTTPS=true` in backend `.env`
4. Update FRONTEND_URL to production domain
5. Use proper app-specific password for Gmail
6. Enable CORS for production domain
7. Update rate limiting as needed

---

## Support

For issues or questions regarding this feature:
1. Check error messages in browser console
2. Review backend logs
3. Verify database columns are created
4. Check environment variables
5. Test API endpoints with Postman

---
