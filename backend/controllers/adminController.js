const Admin = require('../models/Admin');
const Student = require('../models/Student');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if admin exists
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isPasswordMatch = await admin.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        admin: {
          id: admin._id,
          email: admin.email,
          role: admin.role
        }
      }
    });
  } catch (error) {
    console.error('Admin Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Get all students with statistics
// @route   GET /api/admin/students
// @access  Private (Admin)
exports.getStudents = async (req, res) => {
  try {
    // Get all students
    const students = await Student.find().sort({ createdAt: -1 });

    // Calculate statistics
    const totalRegistrations = students.length;
    const pendingPayments = students.filter(s => s.paymentStatus === 'Pending').length;
    const approvedPayments = students.filter(s => s.paymentStatus === 'Approved').length;
    const rejectedPayments = students.filter(s => s.paymentStatus === 'Rejected').length;

    res.status(200).json({
      success: true,
      data: {
        students,
        statistics: {
          totalRegistrations,
          pendingPayments,
          approvedPayments,
          rejectedPayments
        }
      }
    });
  } catch (error) {
    console.error('Get Students Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Approve payment
// @route   PATCH /api/admin/approve/:id
// @access  Private (Admin)
exports.approvePayment = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    student.paymentStatus = 'Approved';
    await student.save();

    res.status(200).json({
      success: true,
      message: 'Payment approved successfully',
      data: student
    });
  } catch (error) {
    console.error('Approve Payment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Reject payment
// @route   PATCH /api/admin/reject/:id
// @access  Private (Admin)
exports.rejectPayment = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    student.paymentStatus = 'Rejected';
    await student.save();

    res.status(200).json({
      success: true,
      message: 'Payment rejected',
      data: student
    });
  } catch (error) {
    console.error('Reject Payment Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/statistics
// @access  Private (Admin)
exports.getStatistics = async (req, res) => {
  try {
    const totalRegistrations = await Student.countDocuments();
    const pendingPayments = await Student.countDocuments({ paymentStatus: 'Pending' });
    const approvedPayments = await Student.countDocuments({ paymentStatus: 'Approved' });
    const rejectedPayments = await Student.countDocuments({ paymentStatus: 'Rejected' });

    res.status(200).json({
      success: true,
      data: {
        totalRegistrations,
        pendingPayments,
        approvedPayments,
        rejectedPayments
      }
    });
  } catch (error) {
    console.error('Get Statistics Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};
