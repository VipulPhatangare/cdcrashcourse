const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  login,
  getStudents,
  approvePayment,
  rejectPayment,
  getStatistics
} = require('../controllers/adminController');

// Public route
router.post('/login', login);

// Protected routes (require authentication)
router.get('/students', protect, getStudents);
router.get('/statistics', protect, getStatistics);
router.patch('/approve/:id', protect, approvePayment);
router.patch('/reject/:id', protect, rejectPayment);

module.exports = router;
