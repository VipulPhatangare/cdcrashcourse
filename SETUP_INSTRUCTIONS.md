# Quick Setup Instructions

## Step-by-Step Guide to Run the Project

### 1️⃣ Backend Setup

Open PowerShell and run:

```powershell
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
Copy-Item .env.example .env

# Create uploads folder
mkdir uploads
mkdir uploads\payments
```

**Edit `.env` file with your credentials:**
- MongoDB Atlas URI
- JWT Secret
- Gmail credentials for email service

**Create admin user:**
```powershell
node createAdmin.js
```

**Start backend server:**
```powershell
npm run dev
```

✅ Backend running on http://localhost:5000

---

### 2️⃣ Frontend Setup

Open a **NEW PowerShell window** and run:

```powershell
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend running on http://localhost:5173

---

### 3️⃣ Access the Application

Open your browser and visit:

- **Landing Page:** http://localhost:5173/crash-course
- **Admin Login:** http://localhost:5173/admin

**Admin Credentials:**
- Email: `admin@campusdekho.ai`
- Password: `admin123456`

---

### 4️⃣ Test the Flow

1. Visit landing page
2. Click "Register Now"
3. Fill personal information
4. Verify email with OTP
5. Upload payment screenshot
6. View your profile
7. Login as admin to approve/reject payments

---

## ⚙️ Environment Variables Setup

### MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create database user
4. Get connection string
5. Add to `.env` file

### Gmail App Password Setup

1. Enable 2-Factor Authentication on Gmail
2. Go to: Google Account → Security → App passwords
3. Generate new app password for "Mail"
4. Copy password to `.env` file

---

## 🐛 Common Issues

**Port already in use:**
- Kill the process or change port in .env (backend) or vite.config.js (frontend)

**MongoDB connection error:**
- Check connection string
- Whitelist IP address (0.0.0.0/0 for development)

**Email not sending:**
- Verify Gmail app password
- Check 2FA is enabled

**File upload error:**
- Ensure uploads/payments folder exists
- Check folder permissions

---

## 📞 Need Help?

Check README.md for detailed documentation.
