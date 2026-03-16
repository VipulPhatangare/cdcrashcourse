const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadProfile } = require('../middleware/upload');
const {
  sendOTP,
  verifyOTP,
  registerStudent,
  getStudentProfile,
  updateStudentProfile,
  studentLogin,
  forgotPassword,
  resetPassword,
  getStudentMaterials,
  getStudentEvents,
  submitQuery
} = require('../controllers/crashCourseController');

// Auth & registration
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/register', upload.single('paymentScreenshot'), registerStudent);
router.post('/login', studentLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Profile
router.get('/profile/:id', getStudentProfile);
router.patch('/profile/:id', uploadProfile.single('profilePhoto'), updateStudentProfile);

// Materials (approved students only)
router.get('/materials/:studentId', getStudentMaterials);

// Events (all logged-in students)
router.get('/events', getStudentEvents);

// Support queries
router.post('/queries', submitQuery);

module.exports = router;
