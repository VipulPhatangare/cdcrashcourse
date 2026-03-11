# Campus Dekho - Crash Course Registration System

A comprehensive MERN stack application for managing crash course registrations with payment verification and admin dashboard.

## 🚀 Features

### Student Features
- **Landing Page**: Course information with benefits and pricing
- **Multi-step Registration**: 
  - Step 1: Personal information with email OTP verification
  - Step 2: Payment screenshot upload and transaction ID
  - Step 3: Success confirmation
- **Student Profile**: View and edit profile information
- **Payment Status Tracking**: Real-time payment status updates

### Admin Features
- **Secure Admin Login**: JWT-based authentication
- **Dashboard Statistics**: 
  - Total registrations
  - Pending payments
  - Approved payments
  - Rejected payments
- **Student Management**: View all registered students
- **Payment Verification**: Approve or reject payments with screenshot preview

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Nodemailer (Email OTP)
- Multer (File Upload)
- Bcrypt (Password Hashing)

### Frontend
- React 18
- React Router v6
- Axios
- Vite

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Gmail account for sending emails (or any SMTP service)

## 🔧 Installation

### 1. Clone or Download the Project

```bash
cd f:\campusdekho\crash_cource
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in the backend folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key_here_make_it_long_and_random
JWT_EXPIRE=7d

# Email Configuration (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
EMAIL_FROM=Campus Dekho <noreply@campusdekho.ai>

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

**Important**: For Gmail, you need to generate an "App Password":
1. Go to Google Account Settings
2. Security → 2-Step Verification
3. App passwords → Generate new app password
4. Use this password in EMAIL_PASSWORD

Create uploads directory:

```bash
mkdir uploads
mkdir uploads/payments
mkdir uploads/profiles
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create `.env` file in the frontend folder (optional):

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Create Initial Admin User

Create a file `backend/scripts/createAdmin.js`:

```javascript
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@campusdekho.ai' });
    
    if (existingAdmin) {
      console.log('Admin already exists!');
      process.exit(0);
    }
    
    // Create new admin
    const admin = await Admin.create({
      email: 'admin@campusdekho.ai',
      password: 'Admin@123',
      role: 'admin'
    });
    
    console.log('Admin created successfully!');
    console.log('Email:', admin.email);
    console.log('Password: Admin@123');
    console.log('Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createAdmin();
```

Run the script:

```bash
cd backend
node scripts/createAdmin.js
```

## 🚀 Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

Backend will run on: http://localhost:5000

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

Frontend will run on: http://localhost:5173

## 📱 Application Routes

### Student Routes
- `/crash-course` - Landing page
- `/crash-course/register` - Registration form
- `/crash-course/profile/:id` - Student profile

### Admin Routes
- `/admin` - Admin login
- `/admin/dashboard` - Admin dashboard

## 🔐 Default Admin Credentials

After running the createAdmin script:
- **Email**: admin@campusdekho.ai
- **Password**: Admin@123

**⚠️ Change these credentials after first login!**

## 📡 API Endpoints

### Crash Course APIs
- `POST /api/crashcourse/send-otp` - Send OTP to email
- `POST /api/crashcourse/verify-otp` - Verify OTP
- `POST /api/crashcourse/register` - Register student
- `GET /api/crashcourse/profile/:id` - Get student profile
- `PATCH /api/crashcourse/profile/:id` - Update student profile

### Admin APIs
- `POST /api/admin/login` - Admin login
- `GET /api/admin/students` - Get all students with statistics
- `GET /api/admin/statistics` - Get dashboard statistics
- `PATCH /api/admin/approve/:id` - Approve payment
- `PATCH /api/admin/reject/:id` - Reject payment

## 🎨 Design Theme

The application follows the **Campus Dekho** design system:
- **Primary Gradient**: Purple to Indigo (#667eea → #764ba2)
- **Card-based Layout**: Clean, modern cards with shadows
- **Responsive Design**: Mobile-first approach
- **Dashboard Style**: Purple gradient headers, white backgrounds

## 📁 Project Structure

```
crash_cource/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   └── crashCourseController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   ├── models/
│   │   ├── Admin.js
│   │   ├── OTP.js
│   │   └── Student.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   └── crashCourseRoutes.js
│   ├── services/
│   │   └── emailService.js
│   ├── uploads/
│   │   └── payments/
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js
    │   ├── pages/
    │   │   ├── AdminDashboard.jsx/.css
    │   │   ├── AdminLogin.jsx/.css
    │   │   ├── CrashCourseLanding.jsx/.css
    │   │   ├── CrashCourseProfile.jsx/.css
    │   │   └── CrashCourseRegister.jsx/.css
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## 🔒 Security Features

- JWT-based authentication for admin routes
- Password hashing using bcrypt
- OTP expiration (10 minutes)
- File upload validation (images only, max 5MB)
- Protected API routes
- Email verification required for registration

## 📧 Email OTP System

- 6-digit OTP generation
- OTP expires in 10 minutes
- Beautiful HTML email template
- Automatic OTP cleanup after expiration

## 💳 Payment Verification Flow

1. Student completes personal information
2. Student uploads payment screenshot (QR code payment)
3. Student enters transaction ID
4. Admin receives notification
5. Admin views payment screenshot
6. Admin approves/rejects payment
7. Student profile updated with status

## 🐛 Troubleshooting

### Email not sending
- Check Gmail app password
- Enable "Less secure app access" (if needed)
- Verify SMTP settings in .env

### Database connection error
- Check MongoDB Atlas connection string
- Ensure IP address is whitelisted in MongoDB Atlas
- Verify network connectivity

### File upload issues
- Ensure uploads/payments directory exists
- Check file size limits (max 5MB)
- Verify file is an image format

### Admin login not working
- Ensure createAdmin script was run
- Check JWT_SECRET is set in .env
- Clear browser cache and localStorage

## 📝 Future Enhancements

- [ ] Payment gateway integration
- [ ] Email notifications for payment status
- [ ] Bulk email/SMS to students
- [ ] Course materials upload
- [ ] Student dashboard with course content
- [ ] Certificate generation
- [ ] Multiple course support
- [ ] Advanced analytics

## 📄 License

This project is created for Campus Dekho.

## 👨‍💻 Support

For any issues or questions, please contact the development team.

---

**© 2026 Campus Dekho. All rights reserved.**
