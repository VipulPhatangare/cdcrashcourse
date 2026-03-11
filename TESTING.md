# Testing Guide

## API Testing with Example Requests

### 1. Send OTP
**Endpoint**: `POST http://localhost:5000/api/crashcourse/send-otp`

**Request Body**:
```json
{
  "email": "student@example.com"
}
```

**Expected Response**:
```json
{
  "success": true,
  "message": "OTP sent successfully to your email"
}
```

### 2. Verify OTP
**Endpoint**: `POST http://localhost:5000/api/crashcourse/verify-otp`

**Request Body**:
```json
{
  "email": "student@example.com",
  "otp": "123456"
}
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

### 3. Register Student
**Endpoint**: `POST http://localhost:5000/api/crashcourse/register`

**Content-Type**: `multipart/form-data`

**Form Data**:
- name: "John Doe"
- email: "student@example.com"
- phone: "9876543210"
- transactionId: "TXN123456789"
- paymentScreenshot: [file]

**Expected Response**:
```json
{
  "success": true,
  "message": "Registration submitted successfully",
  "data": {
    "studentId": "64abc123...",
    "name": "John Doe",
    "email": "student@example.com",
    "courseName": "Campus Dekho Admission Crash Course"
  }
}
```

### 4. Admin Login
**Endpoint**: `POST http://localhost:5000/api/admin/login`

**Request Body**:
```json
{
  "email": "admin@campusdekho.ai",
  "password": "Admin@123"
}
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "admin": {
      "id": "64abc123...",
      "email": "admin@campusdekho.ai",
      "role": "admin"
    }
  }
}
```

### 5. Get All Students (Admin)
**Endpoint**: `GET http://localhost:5000/api/admin/students`

**Headers**:
```
Authorization: Bearer <token>
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "students": [...],
    "statistics": {
      "totalRegistrations": 10,
      "pendingPayments": 5,
      "approvedPayments": 3,
      "rejectedPayments": 2
    }
  }
}
```

### 6. Approve Payment (Admin)
**Endpoint**: `PATCH http://localhost:5000/api/admin/approve/:id`

**Headers**:
```
Authorization: Bearer <token>
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Payment approved successfully",
  "data": {
    "_id": "64abc...",
    "name": "John Doe",
    "paymentStatus": "Approved",
    ...
  }
}
```

## Manual Testing Workflow

### Student Registration Flow

1. **Visit Landing Page**
   - Navigate to: http://localhost:5173/crash-course
   - Verify course information displays correctly
   - Check responsive design

2. **Start Registration**
   - Click "Register Now"
   - Fill in personal information:
     - Name: Test Student
     - Phone: 9876543210
     - Email: test@example.com

3. **Email Verification**
   - Click "Send OTP"
   - Check email for OTP (6 digits)
   - Enter OTP and verify
   - Should see "Email verified successfully"

4. **Payment Verification**
   - Enter Transaction ID: TEST123456
   - Upload a test payment screenshot
   - Click "Submit Registration"

5. **View Profile**
   - Redirected to success page
   - Click "View My Profile"
   - Verify all details are correct

6. **Edit Profile**
   - Click "Edit Profile"
   - Update name or phone
   - Upload profile photo
   - Save changes

### Admin Testing Flow

1. **Admin Login**
   - Navigate to: http://localhost:5173/admin
   - Email: admin@campusdekho.ai
   - Password: Admin@123

2. **Dashboard Overview**
   - Verify statistics cards show correct counts
   - Check student table loads

3. **Payment Approval**
   - Click "View" to see payment screenshot
   - Click "Approve" to approve payment
   - Verify status changes to "Approved"

4. **Payment Rejection**
   - Click "View" to see another payment screenshot
   - Click "Reject" to reject payment
   - Verify status changes to "Rejected"

5. **Logout**
   - Click "Logout" button
   - Verify redirected to login page

## Common Test Scenarios

### Error Handling Tests

1. **Duplicate Email Registration**
   - Try to register with same email twice
   - Should show: "This email is already registered"

2. **Invalid OTP**
   - Enter wrong OTP
   - Should show: "Invalid OTP"

3. **Expired OTP**
   - Wait 10+ minutes after sending OTP
   - Try to verify
   - Should show: "OTP has expired"

4. **Unauthorized Admin Access**
   - Try to access /admin/dashboard without login
   - Should redirect to login page

5. **Invalid File Upload**
   - Try to upload non-image file
   - Should show file type error

6. **File Size Limit**
   - Try to upload file > 5MB
   - Should show size limit error

## Database Verification

### Check MongoDB Collections

1. **Students Collection**
```javascript
db.students.find().pretty()
```

2. **OTPs Collection**
```javascript
db.otps.find().pretty()
// Should auto-delete after expiration
```

3. **Admins Collection**
```javascript
db.admins.find().pretty()
```

## Browser Testing

Test on multiple browsers:
- [ ] Chrome
- [ ] Firefox
- [ ] Edge
- [ ] Safari
- [ ] Mobile Chrome
- [ ] Mobile Safari

## Responsive Testing

Test on different screen sizes:
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

## Performance Testing

1. **Load Time**
   - Landing page should load < 2 seconds
   - Dashboard should load < 3 seconds

2. **Image Upload**
   - Should handle up to 5MB images
   - Should show progress indicator

3. **API Response**
   - Most APIs should respond < 500ms
   - Email sending may take 1-2 seconds

## Security Testing

1. **JWT Token Expiration**
   - Token should expire after 7 days
   - Admin should be logged out automatically

2. **Password Security**
   - Passwords should be hashed in database
   - Never displayed in API responses

3. **File Upload Security**
   - Should only accept image files
   - Should limit file size to 5MB

4. **Input Validation**
   - Test SQL injection attempts
   - Test XSS attempts
   - Verify all inputs are sanitized

## Email Testing

### Test Email Receipt

1. **OTP Email**
   - Should receive within 1 minute
   - Should have professional design
   - Should show 6-digit OTP clearly

2. **Email Format**
   - Should display correctly on Gmail
   - Should display correctly on Outlook
   - Should be mobile-responsive

## Troubleshooting Tests

### If OTP Not Received

1. Check spam/junk folder
2. Verify EMAIL_USER and EMAIL_PASSWORD in .env
3. Check backend logs for errors
4. Verify Gmail app password is correct

### If Upload Fails

1. Check uploads/payments folder exists
2. Verify folder permissions
3. Check file size and type
4. Review backend logs

### If Database Connection Fails

1. Verify MongoDB URI in .env
2. Check network connectivity
3. Verify IP whitelist in MongoDB Atlas
4. Check MongoDB Atlas cluster status

## Automated Testing (Future)

Consider adding:
- Unit tests with Jest
- Integration tests with Supertest
- E2E tests with Cypress
- Load tests with Artillery

---

**Happy Testing! 🚀**
