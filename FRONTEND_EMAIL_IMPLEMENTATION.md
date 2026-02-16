# Email Automation - Frontend Implementation Guide

## Frontend Integration with Email System

This guide shows how to integrate the email automation system from the frontend admin panel.

---

## 1. Create Owner Account (Admin Panel)

### Backend Endpoint
```
POST /api/admin/create-owner
```

### Requirements
- Admin/SuperAdmin authentication
- Bearer token in Authorization header

### Frontend Implementation

#### Using Axios
```javascript
import axios from 'axios';

const createOwnerAccount = async (userData) => {
  try {
    const token = localStorage.getItem('authToken'); // Get your auth token
    
    const response = await axios.post(
      'https://your-api.com/api/admin/create-owner',
      {
        name: userData.name,
        email: userData.email,
        role: userData.role || 'user' // 'user', 'owner', 'admin'
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Owner created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating owner:', error.response?.data?.message);
    throw error;
  }
};
```

### React Component Example

```jsx
import React, { useState } from 'react';
import axios from 'axios';

const CreateOwnerForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'owner'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        '/api/admin/create-owner',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setMessage(`✅ ${response.data.message}`);
      setFormData({ name: '', email: '', role: 'owner' });
      
      // Refresh the owners list or show success message
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create owner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-owner-form">
      <h2>Create New Owner Account</h2>
      <p className="info-text">
        The owner will receive a welcome email with temporary password: <strong>Homewhize@2026</strong>
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter full name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter email address"
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="user">User</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? '⏳ Creating Account...' : '✨ Create Account & Send Email'}
        </button>
      </form>

      <div className="email-info">
        <h3>📧 What Happens Next:</h3>
        <ul>
          <li>✅ Owner account is created</li>
          <li>✅ Welcome email sent with temporary password</li>
          <li>✅ Step-by-step instructions to change password</li>
          <li>✅ KYC reminder email sent after 1 second</li>
        </ul>
      </div>
    </div>
  );
};

export default CreateOwnerForm;
```

---

## 2. Email Customization Options

### Default Configuration

The system uses these defaults:
- **Temporary Password:** `Homewhize@2026`
- **Email Service:** Gmail SMTP
- **From Address:** Your configured `EMAIL_USER`

### Customization Points

If you want to customize:

#### A. Change Temporary Password
Edit `controllers/adminController.js`:
```javascript
// Change this line:
const tempPassword = "Homewhize@2026";
// To:
const tempPassword = "YourCustomPassword@2026";
```

#### B. Change Email Template Design
Edit `utils/emailService.js`, specifically the `getWelcomeTemplate()` function - modify colors, text, layout, etc.

#### C. Change Sender Email
Edit `.env`:
```
EMAIL_USER=new-email@gmail.com
EMAIL_PASS=your-app-password
```

---

## 3. Handle Email Failures Gracefully

The system is designed to never fail the primary operation if email fails:

```javascript
// Even if email fails, the account is created
try {
  // Account creation succeeds
  createUser(...);
  
  // Email sending (non-blocking)
  sendWelcomeEmail(...)
    .catch((err) => {
      console.warn("Email failed but account created:", err);
    });
} catch (err) {
  // Only DB errors will throw
}
```

### Best Practice for Frontend
Always assume the account was created even if email sending fails:

```javascript
// Assume success
setMessage('✅ Owner account created successfully!');

// Email is bonus - don't show as error if it fails
// Log email failures to admin dashboard instead
```

---

## 4. Display Email Status to Users

### Admin Dashboard Example

```jsx
const AdminOwnersList = () => {
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwners = async () => {
    // Fetch list of owners
    // Note: Email status not tracked in DB (assumed sent)
    // Could add tracking if needed
  };

  return (
    <div className="owners-list">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {owners.map(owner => (
            <tr key={owner.id}>
              <td>{owner.name}</td>
              <td>{owner.email}</td>
              <td>{owner.role}</td>
              <td>{new Date(owner.created_at).toLocaleDateString()}</td>
              <td>
                <button>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

---

## 5. Environment Setup (Frontend)

### Add to your `.env.local`

```
VITE_API_BASE_URL=http://localhost:5000/api
# Or for production:
VITE_API_BASE_URL=https://api.homewhize.com/api
```

### Update Axios instance

```javascript
// api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Add auth token to all requests
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
```

---

## 6. Testing the Email System

### Test Locally

1. **Set up test email account:**
   ```env
   EMAIL_USER=your-test-email@gmail.com
   EMAIL_PASS=your-app-specific-password
   ```

2. **Create test owner:**
   ```bash
   POST http://localhost:5000/api/admin/create-owner
   {
     "name": "Test Owner",
     "email": "test@example.com",
     "role": "owner"
   }
   ```

3. **Check email inbox:**
   - Main email should receive welcome email
   - Check spam folder if not in inbox
   - Allow 1-2 seconds for KYC reminder

### Production Testing

Before deploying:
1. Test with actual Gmail credentials
2. Test with various email addresses (Gmail, Outlook, etc.)
3. Verify email passes spam filters
4. Test on mobile email clients

---

## 7. Troubleshooting Frontend Issues

### Email Not Received

1. **Check backend logs:**
   ```bash
   # Look for email sending errors
   npm run start  # Check console output
   ```

2. **Check email configuration:**
   ```bash
   # Verify .env has correct EMAIL_USER and EMAIL_PASS
   echo $EMAIL_USER
   ```

3. **Check email provider:**
   - Gmail: Verify App-Specific Password
   - Other: Ensure SMTP credentials are correct

### API Request Failing

```javascript
// Debug API call
const debugCreateOwner = async () => {
  try {
    const response = await axios.post('/api/admin/create-owner', {
      name: 'Test',
      email: 'test@example.com'
    });
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Status:', error.response?.status);
    console.error('Message:', error.response?.data?.message);
    console.error('Full error:', error);
  }
};
```

---

## 8. User Email Examples

### What Users Will See

#### Welcome Email (Owner Creation)
```
Subject: Welcome to HomeWhize - Owner Account Created

Dear John Doe,

Congratulations! Your HomeWhize Owner account has been successfully created!

🔐 YOUR ACCOUNT CREDENTIALS
├─ Email: john@example.com
└─ Temporary Password: Homewhize@2026

📋 HOW TO CHANGE YOUR PASSWORD
1. Login to Admin Dashboard
   - Visit: https://homewhize.com/admin
   - Enter your email and temporary password

2. Access Settings
   - Click profile icon → Settings

3. Change Password
   - Select "Change Password"
   - Enter temporary password
   - Create your new password

4. Complete KYC Verification
   - Go to KYC page
   - Upload required documents

⚠️ IMPORTANT: Change your password immediately after first login!

Need help? Contact our support team.

Best regards,
HomeWhize Team
```

---

## 9. Success Indicators

When the system is working correctly:

- ✅ Owner account created in database
- ✅ Welcome email received within 2-3 seconds
- ✅ Email contains temporary password
- ✅ Email has clear password change instructions
- ✅ KYC reminder email received within 2-3 seconds
- ✅ All emails properly branded with HomeWhize colors
- ✅ Emails are mobile responsive
- ✅ No errors in backend logs

---

## 10. Performance Considerations

### Email Sending Performance

- **Non-blocking:** Emails sent asynchronously
- **No delay:** Account creation returns immediately
- **Timeout:** 5-10 seconds per email send
- **Fallback:** Account succeeds even if email fails

### Optimization Tips

1. **Queue emails for bulk operations:**
   ```javascript
   // If creating many owners:
   // Implement a queue instead of sending all at once
   ```

2. **Cache transporter:**
   - Already done in emailService.js
   - Reuses same SMTP connection

3. **Minimize template size:**
   - HTML templates are self-contained
   - No external CSS files needed

---

## Conclusion

The email automation system is production-ready and requires minimal frontend integration. Simply call the `/api/admin/create-owner` endpoint and the system handles everything else!

For questions, refer to `EMAIL_AUTOMATION_DOCUMENTATION.md` in the backend folder.
