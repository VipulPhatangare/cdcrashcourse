# Application Flow & Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         MERN STACK APPLICATION                       │
└─────────────────────────────────────────────────────────────────────┘

┌──────────────────────────┐        ┌──────────────────────────┐
│       FRONTEND           │        │        BACKEND           │
│      (React + Vite)      │◄──────►│   (Node.js + Express)    │
│                          │  API   │                          │
│  ┌────────────────────┐  │        │  ┌────────────────────┐  │
│  │  Landing Page      │  │        │  │  Controllers       │  │
│  │  Registration      │  │        │  │  - Admin           │  │
│  │  Profile           │  │        │  │  - Crash Course    │  │
│  │  Admin Login       │  │        │  └────────────────────┘  │
│  │  Admin Dashboard   │  │        │                          │
│  └────────────────────┘  │        │  ┌────────────────────┐  │
│                          │        │  │  Routes            │  │
│  ┌────────────────────┐  │        │  │  - /api/admin      │  │
│  │  Axios API Client  │  │        │  │  - /api/crashcourse│  │
│  └────────────────────┘  │        │  └────────────────────┘  │
│                          │        │                          │
│  Port: 5173             │        │  Port: 5000             │
└──────────────────────────┘        └──────────────────────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    │                        │                        │
          ┌─────────▼─────────┐    ┌────────▼────────┐    ┌─────────▼─────────┐
          │   MongoDB Atlas   │    │   Nodemailer    │    │  File Storage     │
          │   Database        │    │   Email Service │    │  (Multer)         │
          │                   │    │                 │    │                   │
          │  - Students       │    │  - OTP Emails   │    │  - Payment        │
          │  - OTPs           │    │  - HTML         │    │    Screenshots    │
          │  - Admins         │    │    Templates    │    │  - Profile Photos │
          └───────────────────┘    └─────────────────┘    └───────────────────┘
```

## Student Registration Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│                    STUDENT REGISTRATION FLOW                          │
└──────────────────────────────────────────────────────────────────────┘

1. Landing Page
   │
   ├─► Student clicks "Register Now"
   │
   ▼
2. Step 1: Personal Information
   │
   ├─► Enter: Name, Phone, Email
   │
   ├─► Click "Send OTP"
   │   │
   │   ├─► Backend generates 6-digit OTP
   │   │
   │   ├─► Saves OTP to MongoDB (expires in 10 min)
   │   │
   │   └─► Nodemailer sends OTP email
   │
   ├─► Student enters OTP
   │
   ├─► Click "Verify OTP"
   │   │
   │   ├─► Backend validates OTP
   │   │
   │   └─► OTP deleted from database
   │
   ├─► Email verified ✓
   │
   └─► Click "Continue to Payment"
       │
       ▼
3. Step 2: Payment Verification
   │
   ├─► Student sees QR code
   │
   ├─► Makes payment via UPI
   │
   ├─► Enters transaction ID
   │
   ├─► Uploads payment screenshot
   │   │
   │   └─► Multer validates & stores file
   │
   └─► Click "Submit Registration"
       │
       ├─► Backend creates student record
       │
       ├─► Payment status = "Pending"
       │
       └─► Returns student ID
           │
           ▼
4. Step 3: Success
   │
   ├─► Show success message
   │
   └─► Redirect to profile page
```

## Admin Workflow

```
┌──────────────────────────────────────────────────────────────────────┐
│                       ADMIN WORKFLOW                                  │
└──────────────────────────────────────────────────────────────────────┘

1. Admin Login
   │
   ├─► Enter email & password
   │
   ├─► Backend verifies credentials
   │   │
   │   └─► Bcrypt compares hashed password
   │
   ├─► JWT token generated
   │
   └─► Token stored in localStorage
       │
       ▼
2. Dashboard
   │
   ├─► View Statistics Cards:
   │   │
   │   ├─► Total Registrations
   │   ├─► Pending Payments
   │   ├─► Approved Payments
   │   └─► Rejected Payments
   │
   ├─► View Student Table:
   │   │
   │   └─► All student registrations
   │
   └─► Payment Actions:
       │
       ├─► Click "View" → See payment screenshot in modal
       │
       ├─► Click "Approve"
       │   │
       │   ├─► Backend updates payment status
       │   │
       │   ├─► Status = "Approved"
       │   │
       │   └─► Dashboard refreshes
       │
       └─► Click "Reject"
           │
           ├─► Backend updates payment status
           │
           ├─► Status = "Rejected"
           │
           └─► Dashboard refreshes
```

## Database Relationships

```
┌──────────────────────────────────────────────────────────────────────┐
│                    DATABASE RELATIONSHIPS                             │
└──────────────────────────────────────────────────────────────────────┘

┌─────────────────────┐
│   Students          │
├─────────────────────┤
│ _id (ObjectId)      │
│ name                │
│ email (unique)      │──┐
│ phone               │  │
│ emailVerified       │  │  Email used for
│ transactionId       │  │  OTP verification
│ paymentScreenshot   │  │
│ paymentStatus       │  │
│ courseName          │  │
│ profilePhoto        │  │
│ createdAt           │  │
└─────────────────────┘  │
                         │
┌─────────────────────┐  │
│   OTPs              │  │
├─────────────────────┤  │
│ _id (ObjectId)      │  │
│ email               │◄─┘ Temporary link
│ otp (6 digits)      │    (deleted after verification)
│ expiresAt           │
│ createdAt           │
└─────────────────────┘

┌─────────────────────┐
│   Admins            │
├─────────────────────┤
│ _id (ObjectId)      │
│ email (unique)      │
│ password (hashed)   │
│ role                │
│ createdAt           │
└─────────────────────┘
```

## API Request/Response Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│                    API REQUEST/RESPONSE FLOW                          │
└──────────────────────────────────────────────────────────────────────┘

STUDENT REGISTRATION API

POST /api/crashcourse/register
│
Request (multipart/form-data):
│
├─► name: "John Doe"
├─► email: "john@example.com"
├─► phone: "9876543210"
├─► transactionId: "TXN123456789"
└─► paymentScreenshot: [file]
    │
    ▼
Backend Processing:
│
├─► Validate inputs
├─► Check email not already registered
├─► Multer saves file to /uploads/payments/
├─► Create student document in MongoDB
├─► Set paymentStatus = "Pending"
│
    ▼
Response (JSON):
│
{
  "success": true,
  "message": "Registration submitted successfully",
  "data": {
    "studentId": "64abc123...",
    "name": "John Doe",
    "email": "john@example.com",
    "courseName": "Campus Dekho Admission Crash Course"
  }
}

─────────────────────────────────────────────────────────────────────

ADMIN APPROVE PAYMENT API

PATCH /api/admin/approve/:id
│
Headers:
│
└─► Authorization: Bearer <JWT_TOKEN>
    │
    ▼
Backend Processing:
│
├─► Verify JWT token (auth middleware)
├─► Check admin exists
├─► Find student by ID
├─► Update paymentStatus = "Approved"
├─► Save to database
│
    ▼
Response (JSON):
│
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

## Security Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│                       SECURITY LAYERS                                 │
└──────────────────────────────────────────────────────────────────────┘

Public Routes (No Authentication)
│
├─► /api/crashcourse/send-otp
├─► /api/crashcourse/verify-otp
├─► /api/crashcourse/register
├─► /api/crashcourse/profile/:id
└─► /api/admin/login

Protected Routes (JWT Required)
│
├─► Authorization Header: Bearer <token>
│
├─► Middleware: auth.protect
│   │
│   ├─► Extract token from header
│   ├─► Verify token with JWT_SECRET
│   ├─► Check token not expired
│   ├─► Find admin by decoded ID
│   │
│   └─► If valid → Continue to route
│       If invalid → Return 401 Unauthorized
│
├─► /api/admin/students
├─► /api/admin/statistics
├─► /api/admin/approve/:id
└─► /api/admin/reject/:id

Password Security
│
├─► User Registration/Update
│   │
│   ├─► Plain password input
│   ├─► Bcrypt generates salt (10 rounds)
│   ├─► Password hashed with salt
│   └─► Only hash stored in database
│
└─► User Login
    │
    ├─► Plain password input
    ├─► Fetch hashed password from DB
    ├─► Bcrypt compares plain vs hash
    └─► Match → Login success
        No match → Login failed

File Upload Security
│
├─► Type validation: Only images
├─► Size validation: Max 5MB
├─► Extension check: jpg, jpeg, png, gif, webp
├─► Unique filename generation
└─► Stored outside public directory
```

## Email OTP Flow

```
┌──────────────────────────────────────────────────────────────────────┐
│                      EMAIL OTP FLOW                                   │
└──────────────────────────────────────────────────────────────────────┘

1. Send OTP Request
   │
   ├─► POST /api/crashcourse/send-otp
   ├─► Body: { email: "user@example.com" }
   │
   ▼
2. Backend Processing
   │
   ├─► Check email not already registered
   ├─► Generate 6-digit OTP: Math.floor(100000 + Math.random() * 900000)
   ├─► Delete any existing OTPs for this email
   │
   ├─► Save to MongoDB:
   │   {
   │     email: "user@example.com",
   │     otp: "123456",
   │     expiresAt: Date.now() + 10 minutes
   │   }
   │
   ▼
3. Send Email
   │
   ├─► Nodemailer connects to Gmail SMTP
   ├─► Beautiful HTML email template
   ├─► Subject: "Email Verification - Campus Dekho"
   ├─► Shows OTP in styled box
   ├─► Mentions 10-minute expiration
   │
   ▼
4. Student Receives Email
   │
   ├─► Opens email
   ├─► Copies 6-digit OTP
   ├─► Returns to registration form
   │
   ▼
5. Verify OTP Request
   │
   ├─► POST /api/crashcourse/verify-otp
   ├─► Body: { email: "user@example.com", otp: "123456" }
   │
   ▼
6. Backend Verification
   │
   ├─► Find OTP by email and otp
   ├─► Check if exists
   ├─► Check if not expired (expiresAt > Date.now())
   ├─► Delete OTP from database
   │
   ▼
7. Response
   │
   ├─► Valid → { success: true, message: "Email verified" }
   └─► Invalid → { success: false, message: "Invalid/Expired OTP" }

Auto Cleanup
   │
   └─► MongoDB TTL Index on expiresAt field
       │
       └─► Automatically deletes expired OTPs
```

## Component Hierarchy

```
┌──────────────────────────────────────────────────────────────────────┐
│                    REACT COMPONENT HIERARCHY                          │
└──────────────────────────────────────────────────────────────────────┘

App.jsx (Router)
│
├─► Route: /crash-course
│   └─► CrashCourseLanding.jsx
│       │
│       ├─► Navbar
│       ├─► Hero Section
│       ├─► Course Card
│       │   ├─► Course Details
│       │   └─► Benefits Grid
│       ├─► CTA Buttons
│       └─► Footer
│
├─► Route: /crash-course/register
│   └─► CrashCourseRegister.jsx
│       │
│       ├─► Navbar
│       ├─► Progress Bar (3 steps)
│       ├─► Message Display
│       │
│       └─► Conditional Rendering:
│           │
│           ├─► Step 1: Personal Info Form
│           │   ├─► Name Input
│           │   ├─► Phone Input
│           │   ├─► Email Input
│           │   ├─► Send OTP Button
│           │   ├─► OTP Input
│           │   └─► Verify OTP Button
│           │
│           ├─► Step 2: Payment Form
│           │   ├─► QR Code Display
│           │   ├─► Transaction ID Input
│           │   ├─► File Upload
│           │   └─► Sample Screenshots
│           │
│           └─► Step 3: Success Message
│               └─► View Profile Button
│
├─► Route: /crash-course/profile/:id
│   └─► CrashCourseProfile.jsx
│       │
│       ├─► Navbar
│       ├─► Profile Header
│       │   ├─► Avatar
│       │   └─► Name & Email
│       │
│       └─► Conditional Rendering:
│           │
│           ├─► View Mode
│           │   ├─► Detail Rows
│           │   ├─► Payment Screenshot Link
│           │   ├─► Status Badge
│           │   └─► Edit Button
│           │
│           └─► Edit Mode
│               ├─► Name Input
│               ├─► Phone Input
│               ├─► Photo Upload
│               └─► Save/Cancel Buttons
│
├─► Route: /admin
│   └─► AdminLogin.jsx
│       │
│       ├─► Logo Header
│       ├─► Login Form
│       │   ├─► Email Input
│       │   ├─► Password Input
│       │   └─► Login Button
│       │
│       └─► Message Display
│
└─► Route: /admin/dashboard
    └─► AdminDashboard.jsx
        │
        ├─► Dashboard Navbar
        │   ├─► Logo
        │   └─► Logout Button
        │
        ├─► Dashboard Header
        │
        ├─► Statistics Grid
        │   ├─► Total Registrations Card
        │   ├─► Pending Payments Card
        │   ├─► Approved Payments Card
        │   └─► Rejected Payments Card
        │
        ├─► Student Table
        │   ├─► Table Headers
        │   ├─► Student Rows
        │   │   ├─► Basic Info
        │   │   ├─► View Screenshot Button
        │   │   ├─► Status Badge
        │   │   └─► Action Buttons
        │   │
        │   └─► Empty State
        │
        └─► Screenshot Modal
            ├─► Modal Overlay
            ├─► Image Display
            └─► Close Button
```

---

**This visual guide helps understand the complete application flow and architecture!**
