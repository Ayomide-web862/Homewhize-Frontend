# KYC (Know Your Customer) System Documentation

## Overview
The KYC system allows property owners to submit verification documents (ID + Ownership proof) and enables Super Admins to review and approve/reject submissions.

---

## System Architecture

### Frontend Components

#### 1. **AdminKYC Page** (`Frontend/src/pages/AdminKYC.jsx`)
- **Purpose**: Property owners submit their KYC documents and personal info
- **Features**:
  - Form validation with error messages
  - File upload preview functionality
  - Document type validation (JPG, PNG, WebP, PDF, DOC, DOCX)
  - File size limit: 10MB per document
  - Real-time status checking
  - Success/error alerts
  - Duplicate submission prevention

**Form Fields**:
- Full Name (required)
- Email Address (required, format validated)
- Phone Number (required)
- Residential Address (required)
- ID Document upload (required)
- Ownership Document upload (required)

**Upload Support**:
- Images: JPG, PNG, WebP
- Documents: PDF, DOC, DOCX
- Max file size: 10MB each

#### 2. **SuperAdminKYC Page** (`Frontend/src/pages/SuperAdminKYC.jsx`)
- **Purpose**: Super admins review and approve/reject KYC submissions
- **Features**:
  - View all KYC submissions in card layout
  - Filter by status (All, Pending, Approved, Rejected)
  - Modal view for document inspection
  - Approve/Reject/View actions per submission
  - Error handling with retry option
  - Submission counter
  - Responsive design for all devices

---

### Backend Components

#### 1. **KYC Controller** (`Backend/controllers/kycController.js`)

**Endpoints**:

##### a) Submit KYC (Admin)
```javascript
POST /api/kyc/submit
Headers: Authorization: Bearer {token}
Body: FormData
  - fullName (string, required)
  - email (string, required)
  - phone (string, required)
  - address (string, required)
  - idDocument (file, required)
  - ownershipDocument (file, required)

Response (201):
{
  "message": "KYC submitted successfully",
  "status": "Pending",
  "id": 123
}

Error Responses:
- 400: Missing required fields
- 409: Duplicate submission (already Pending or Approved)
- 500: Upload or database error
```

**Features**:
- Validates all required fields
- Checks for duplicate Pending/Approved submissions
- Uploads documents to Cloudinary
- Stores submission in database with auto-generated timestamps
- Returns submission ID for tracking

##### b) Get My Status (Admin)
```javascript
GET /api/kyc/my-status
Headers: Authorization: Bearer {token}

Response:
{
  "id": 123,
  "status": "Pending",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

**Features**:
- Fetches user's latest KYC submission
- Returns "Not Submitted" if no submission exists
- Includes creation and update timestamps

##### c) Get All KYC (Super Admin)
```javascript
GET /api/kyc/all
Headers: Authorization: Bearer {token} (superadmin role required)

Response:
[
  {
    "id": 123,
    "user_id": 45,
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": "+234812345678",
    "address": "123 Main Street",
    "id_document_url": "https://res.cloudinary.com/...",
    "ownership_document_url": "https://res.cloudinary.com/...",
    "status": "Pending",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
]
```

**Features**:
- Returns all KYC submissions
- Ordered by creation date (newest first)
- Includes full document URLs for viewing
- Includes all submission details

##### d) Update KYC Status (Super Admin)
```javascript
PUT /api/kyc/{id}/status
Headers: Authorization: Bearer {token} (superadmin role required)
Body:
{
  "status": "Approved" | "Rejected" | "Pending"
}

Response:
{
  "message": "KYC status updated to Approved",
  "id": 123,
  "status": "Approved"
}

Error Responses:
- 400: Invalid status value
- 404: KYC not found
- 500: Database error
```

**Features**:
- Validates status against allowed values
- Checks if KYC exists before updating
- Updates timestamp automatically
- Prevents status downgrade (can't revert from Approved to Pending)

#### 2. **KYC Routes** (`Backend/routes/kycRoutes.js`)
- POST `/submit` - Admin role required
- GET `/my-status` - Authenticated users
- GET `/all` - Super Admin role required
- PUT `/:id/status` - Super Admin role required

#### 3. **KYC Upload Middleware** (`Backend/middleware/kycUpload.js`)
**Features**:
- Memory storage for temporary file buffering
- File size limit: 10MB
- Accepts: JPG, PNG, WebP, PDF, DOC, DOCX
- Multer fields configuration:
  - `idDocument` (max 1 file)
  - `ownershipDocument` (max 1 file)

#### 4. **Cloudinary Integration**
- **Folder**: `kyc_documents`
- **Resource Type**: Auto-detected (image or raw)
- **Secure URLs**: All documents stored securely on Cloudinary

---

## Database Schema

### `kyc_requests` Table

```sql
CREATE TABLE kyc_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  address TEXT NOT NULL,
  id_document_url VARCHAR(500) NOT NULL,
  ownership_document_url VARCHAR(500) NOT NULL,
  status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
);
```

**Columns**:
- `id`: Unique identifier
- `user_id`: Reference to the users table
- `full_name`: Property owner's full name
- `email`: Owner's email address
- `phone`: Owner's phone number
- `address`: Residential address
- `id_document_url`: Cloudinary URL for ID document
- `ownership_document_url`: Cloudinary URL for ownership proof
- `status`: Submission status (Pending/Approved/Rejected)
- `created_at`: Submission timestamp
- `updated_at`: Last update timestamp

---

## Error Handling

### Frontend Errors

1. **Validation Errors**:
   - Missing fields display error alert
   - Invalid email format shows message
   - File type not supported shows rejection reason

2. **File Upload Errors**:
   - File too large (>10MB): "File size must be less than 10MB"
   - Invalid type: "Invalid file type. Allowed: JPG, PNG, WebP, PDF, DOC, DOCX"
   - Upload failure: Displays error message from server

3. **Submission Errors**:
   - Duplicate submission: "KYC already submitted with status: Pending/Approved..."
   - Network error: Shows generic error with retry option

### Backend Error Responses

1. **Status 400 (Bad Request)**:
   - Missing required fields
   - Invalid file format
   - Invalid status value

2. **Status 404 (Not Found)**:
   - KYC ID doesn't exist

3. **Status 409 (Conflict)**:
   - Duplicate active submission

4. **Status 500 (Server Error)**:
   - Cloudinary upload failure
   - Database operation failure

---

## Workflow

### For Property Owners (Admin)

1. Navigate to KYC Verification page
2. Fill out personal information form
3. Upload ID document (JPG, PNG, WebP, PDF, DOC, DOCX)
4. Upload Ownership proof document (same formats)
5. Review preview images/documents
6. Submit for review
7. System prevents duplicate submissions while Pending/Approved
8. Check status anytime on the same page

### For Super Admins

1. Navigate to KYC Verification page
2. View all submissions in card layout
3. Filter by status (Pending, Approved, Rejected)
4. Click "View" to see documents in modal
5. Review documents (can download if display fails)
6. Click "Approve" or "Reject" to update status
7. Updated timestamp reflects action time
8. Filter refreshes to show updated list

---

## Security Features

1. **Authentication**: JWT tokens required for all endpoints
2. **Authorization**: Role-based access control (Admin/Super Admin)
3. **File Validation**: MIME type and size limits enforced
4. **Cloudinary Storage**: Secure, encrypted cloud storage
5. **Database Security**: Foreign key constraints, indexed queries
6. **Error Messages**: Server errors don't expose sensitive info

---

## Installation & Setup

### 1. Database Migration
```bash
cd Backend
# Run the migration file
mysql -u root -p database_name < migrations/001_kyc_schema.sql
```

### 2. Environment Variables
Ensure these are set in `Backend/.env`:
```
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Frontend Setup
No additional setup needed. Uses centralized axios instance with env variables.

---

## Testing

### Test Cases

#### Admin Submit KYC
```bash
curl -X POST http://localhost:5000/api/kyc/submit \
  -H "Authorization: Bearer {admin_token}" \
  -F "fullName=John Doe" \
  -F "email=john@example.com" \
  -F "phone=+234812345678" \
  -F "address=123 Main St" \
  -F "idDocument=@id_photo.jpg" \
  -F "ownershipDocument=@property_deed.pdf"
```

#### Super Admin Get All
```bash
curl -X GET http://localhost:5000/api/kyc/all \
  -H "Authorization: Bearer {superadmin_token}"
```

#### Update Status
```bash
curl -X PUT http://localhost:5000/api/kyc/123/status \
  -H "Authorization: Bearer {superadmin_token}" \
  -H "Content-Type: application/json" \
  -d '{"status":"Approved"}'
```

---

## Troubleshooting

### Issue: "File not received" on submission
**Solution**: Ensure `Content-Type: multipart/form-data` is set (axios handles this automatically)

### Issue: Duplicate submission error
**Solution**: User must wait for current submission to be Approved or Rejected first

### Issue: Document doesn't display in modal
**Solution**: Check Cloudinary URL is valid; fallback download option provided

### Issue: "Not Allowed by CORS"
**Solution**: Verify `FRONTEND_URLS` is set correctly in backend `.env`

### Issue: File upload fails with 413 error
**Solution**: File size exceeds 10MB; reduce file size and retry

---

## Future Enhancements

1. **Email Notifications**: Send confirmation/approval emails
2. **Document OCR**: Auto-extract info from ID documents
3. **Batch Operations**: Approve multiple KYCs at once
4. **Audit Trail**: Log all KYC actions by super admins
5. **Expiration**: Auto-expire KYC after X months
6. **Document Templates**: Pre-fill common fields
7. **Integration**: Connect to payment/booking systems

---

## Support

For issues or questions, refer to the main README or contact the development team.
