const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { uploadPDF } = require('../middleware/upload');
const {
  login,
  getStudents,
  approvePayment,
  rejectPayment,
  getStatistics,
  uploadMaterial,
  getMaterials,
  deleteMaterial,
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
router.get('/statistics', protect, getStatistics);
router.patch('/approve/:id', protect, approvePayment);
router.patch('/reject/:id', protect, rejectPayment);

// Materials management
router.post('/materials', protect, uploadPDF.single('pdf'), uploadMaterial);
router.get('/materials', protect, getMaterials);
router.delete('/materials/:id', protect, deleteMaterial);

// Events management
router.post('/events', protect, createEvent);
router.get('/events', protect, getEvents);
router.delete('/events/:id', protect, deleteEvent);

// Queries management
router.get('/queries', protect, getQueries);
router.patch('/queries/:id/resolve', protect, resolveQuery);

module.exports = router;
