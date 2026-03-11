const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  sendOTP,
  verifyOTP,
  registerStudent,
  getStudentProfile,
  updateStudentProfile,
  studentLogin,
  forgotPassword,
  resetPassword
} = require('../controllers/crashCourseController');

// Public routes
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/register', upload.single('paymentScreenshot'), registerStudent);
router.post('/login', studentLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile/:id', getStudentProfile);
router.patch('/profile/:id', upload.single('profilePhoto'), updateStudentProfile);

module.exports = router;
