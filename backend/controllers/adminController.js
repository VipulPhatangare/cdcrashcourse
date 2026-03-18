const Admin = require('../models/Admin');
const Student = require('../models/Student');
const Material = require('../models/Material');
const TimeTable = require('../models/TimeTable');
const Event = require('../models/Event');
const Query = require('../models/Query');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

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

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isPasswordMatch = await admin.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

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
    const students = await Student.find().sort({ createdAt: -1 });

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

// @desc    Delete a student
// @route   DELETE /api/admin/students/:id
// @access  Private (Admin)
exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    await student.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Delete Student Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// ─── MATERIALS ────────────────────────────────────────────────────────────────

// @desc    Upload a PDF material
// @route   POST /api/admin/materials
// @access  Private (Admin)
exports.uploadMaterial = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF file'
      });
    }

    const { name, description } = req.body;

    if (!name) {
      // Delete uploaded file if validation fails
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Please provide a name for the material'
      });
    }

    const relativePath = req.file.path.replace(/\\/g, '/').split(/[\\/]/).slice(-2).join('/');
    const material = await Material.create({
      name,
      description,
      filePath: relativePath,
      originalName: req.file.originalname
    });

    res.status(201).json({
      success: true,
      message: 'Material uploaded successfully',
      data: material
    });
  } catch (error) {
    console.error('Upload Material Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Get all materials (admin)
// @route   GET /api/admin/materials
// @access  Private (Admin)
exports.getMaterials = async (req, res) => {
  try {
    const materials = await Material.find().sort({ uploadedAt: -1 });
    const materialsWithUrls = materials.map(m => ({
      ...m.toObject(),
      fileUrl: `/uploads/${m.filePath}`
    }));

    res.status(200).json({
      success: true,
      data: materialsWithUrls
    });
  } catch (error) {
    console.error('Get Materials Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Delete a material
// @route   DELETE /api/admin/materials/:id
// @access  Private (Admin)
exports.deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({
        success: false,
        message: 'Material not found'
      });
    }

    // Delete file from disk (reconstruct full path)
    const fullPath = path.join(__dirname, '..', 'uploads', material.filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    await material.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Material deleted successfully'
    });
  } catch (error) {
    console.error('Delete Material Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// ─── TIMETABLES ─────────────────────────────────────────────────────────────

// @desc    Upload a timetable image
// @route   POST /api/admin/timetables
// @access  Private (Admin)
exports.uploadTimeTable = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a timetable image'
      });
    }

    const { title, description } = req.body;

    if (!title || !title.trim()) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Please provide a timetable title'
      });
    }

    const relativePath = req.file.path.replace(/\\/g, '/').split(/[\\/]/).slice(-2).join('/');
    const timetable = await TimeTable.create({
      title: title.trim(),
      description: (description || '').trim(),
      imagePath: relativePath,
      originalName: req.file.originalname,
      uploadedBy: 'admin'
    });

    res.status(201).json({
      success: true,
      message: 'Timetable uploaded successfully',
      data: timetable
    });
  } catch (error) {
    console.error('Upload Timetable Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Get all timetables (admin)
// @route   GET /api/admin/timetables
// @access  Private (Admin)
exports.getTimeTables = async (req, res) => {
  try {
    const timetables = await TimeTable.find().sort({ uploadedAt: -1 });
    const timetablesWithUrls = timetables.map((t) => ({
      ...t.toObject(),
      imageUrl: `/uploads/${t.imagePath}`
    }));

    res.status(200).json({
      success: true,
      data: timetablesWithUrls
    });
  } catch (error) {
    console.error('Get Timetables Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Delete a timetable
// @route   DELETE /api/admin/timetables/:id
// @access  Private (Admin)
exports.deleteTimeTable = async (req, res) => {
  try {
    const timetable = await TimeTable.findById(req.params.id);

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'Timetable not found'
      });
    }

    const fullPath = path.join(__dirname, '..', 'uploads', timetable.imagePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    await timetable.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Timetable deleted successfully'
    });
  } catch (error) {
    console.error('Delete Timetable Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// ─── EVENTS ───────────────────────────────────────────────────────────────────

// @desc    Create an event
// @route   POST /api/admin/events
// @access  Private (Admin)
exports.createEvent = async (req, res) => {
  try {
    const { title, description, zoomLink, date, time } = req.body;

    if (!title || !description || !zoomLink || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, zoom link, date, and time'
      });
    }

    const event = await Event.create({ title, description, zoomLink, date, time });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event
    });
  } catch (error) {
    console.error('Create Event Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Get all events (admin)
// @route   GET /api/admin/events
// @access  Private (Admin)
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Get Events Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Delete an event
// @route   DELETE /api/admin/events/:id
// @access  Private (Admin)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Delete Event Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// ─── QUERIES ──────────────────────────────────────────────────────────────────

// @desc    Get all student queries
// @route   GET /api/admin/queries
// @access  Private (Admin)
exports.getQueries = async (req, res) => {
  try {
    const queries = await Query.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: queries
    });
  } catch (error) {
    console.error('Get Queries Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Mark a query as resolved
// @route   PATCH /api/admin/queries/:id/resolve
// @access  Private (Admin)
exports.resolveQuery = async (req, res) => {
  try {
    const query = await Query.findById(req.params.id);

    if (!query) {
      return res.status(404).json({
        success: false,
        message: 'Query not found'
      });
    }

    query.status = 'Resolved';
    await query.save();

    res.status(200).json({
      success: true,
      message: 'Query marked as resolved',
      data: query
    });
  } catch (error) {
    console.error('Resolve Query Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};
