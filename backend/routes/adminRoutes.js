const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { uploadPDF, uploadTimeTable: uploadTimeTableImage } = require('../middleware/upload');
const {
  login,
  getStudents,
  deleteStudent,
  approvePayment,
  rejectPayment,
  getStatistics,
  uploadMaterial,
  getMaterials,
  deleteMaterial,
  uploadTimeTable: uploadTimeTableHandler,
  getTimeTables,
  deleteTimeTable,
  createEvent,
  getEvents,
  deleteEvent,
  getQueries,
  resolveQuery
} = require('../controllers/adminController');

// Public route
router.post('/login', login);

// Student management
router.get('/students', protect, getStudents);
router.delete('/students/:id', protect, deleteStudent);
router.get('/statistics', protect, getStatistics);
router.patch('/approve/:id', protect, approvePayment);
router.patch('/reject/:id', protect, rejectPayment);

// Materials management
router.post('/materials', protect, uploadPDF.single('pdf'), uploadMaterial);
router.get('/materials', protect, getMaterials);
router.delete('/materials/:id', protect, deleteMaterial);

// TimeTable management
router.post('/timetables', protect, uploadTimeTableImage.single('image'), uploadTimeTableHandler);
router.get('/timetables', protect, getTimeTables);
router.delete('/timetables/:id', protect, deleteTimeTable);

// Events management
router.post('/events', protect, createEvent);
router.get('/events', protect, getEvents);
router.delete('/events/:id', protect, deleteEvent);

// Queries management
router.get('/queries', protect, getQueries);
router.patch('/queries/:id/resolve', protect, resolveQuery);

module.exports = router;
