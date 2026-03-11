# Campus Dekho - Crash Course Registration System

Complete MERN stack application for crash course registration with payment verification.

## Quick Start Guide

### Prerequisites
- Node.js installed
- MongoDB Atlas account
- Gmail account for sending OTP emails

### Backend Setup
1. Navigate to backend folder: `cd backend`
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure:
   - MongoDB URI
   - JWT Secret
   - Gmail credentials (use App Password)
4. Create uploads folders: `mkdir uploads/payments uploads/profiles`
5. Create admin user: `node scripts/createAdmin.js`
6. Start backend: `npm run dev`

### Frontend Setup
1. Navigate to frontend folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start frontend: `npm run dev`

### Access the Application
- **Student Portal**: http://localhost:5173/crash-course
- **Admin Portal**: http://localhost:5173/admin
- **Admin Credentials**: admin@campusdekho.ai / Admin@123

## Features
✅ Multi-step registration with OTP verification
✅ Payment screenshot upload
✅ Student profile management
✅ Admin dashboard with statistics
✅ Payment approval/rejection system
✅ Responsive design with Campus Dekho theme

## Tech Stack
- **Backend**: Node.js, Express, MongoDB, JWT, Nodemailer, Multer
- **Frontend**: React, React Router, Axios, Vite

For detailed documentation, see main README.md file.
