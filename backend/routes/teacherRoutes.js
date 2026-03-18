const express = require('express');
const router = express.Router();
const { protectTeacher } = require('../middleware/auth');
const { uploadPDF, uploadTimeTable: uploadTimeTableImage } = require('../middleware/upload');
const {
  sendOTP,
  verifyOTP,
  register,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  uploadMaterial,
  getMaterials,
  deleteMaterial,
  uploadTimeTable: uploadTimeTableHandler,
  getTimeTables,
  deleteTimeTable,
  createEvent,
  getEvents,
  deleteEvent
} = require('../controllers/teacherController');

// Auth
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', protectTeacher, getProfile);

// Materials
router.post('/materials', protectTeacher, uploadPDF.single('file'), uploadMaterial);
router.get('/materials', protectTeacher, getMaterials);
router.delete('/materials/:id', protectTeacher, deleteMaterial);

// Timetables
router.post('/timetables', protectTeacher, uploadTimeTableImage.single('image'), uploadTimeTableHandler);
router.get('/timetables', protectTeacher, getTimeTables);
router.delete('/timetables/:id', protectTeacher, deleteTimeTable);

// Events
router.post('/events', protectTeacher, createEvent);
router.get('/events', protectTeacher, getEvents);
router.delete('/events/:id', protectTeacher, deleteEvent);

module.exports = router;
