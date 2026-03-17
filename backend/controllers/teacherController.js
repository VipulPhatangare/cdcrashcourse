const Teacher = require('../models/Teacher');
const OTP = require('../models/OTP');
const Material = require('../models/Material');
const Event = require('../models/Event');
const { sendOTPEmail } = require('../services/emailService');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Teacher registration
// @route   POST /api/teacher/register
// @access  Public
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email address'
      });
    }

    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({
        success: false,
        message: 'This email is already registered'
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.deleteMany({ email });
    await OTP.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    const emailResult = await sendOTPEmail(email, otp);
    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email'
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully to your email'
    });
  } catch (error) {
    console.error('Teacher Send OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and OTP'
      });
    }

    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    await OTP.deleteOne({ _id: otpRecord._id });

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Teacher Verify OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, subject, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email and password'
      });
    }

    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({
        success: false,
        message: 'Teacher with this email already exists'
      });
    }

    // Create teacher
    const teacher = await Teacher.create({
      name,
      email,
      password,
      subject: subject || '',
      phone: phone || ''
    });

    const token = generateToken(teacher._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        token,
        teacher: {
          id: teacher._id,
          name: teacher.name,
          email: teacher.email,
          subject: teacher.subject,
          role: teacher.role
        }
      }
    });
  } catch (error) {
    console.error('Teacher Registration Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Send teacher password reset OTP
// @route   POST /api/teacher/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email address'
      });
    }

    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email'
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.deleteMany({ email });
    await OTP.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    const emailResult = await sendOTPEmail(email, otp);
    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP email'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Password reset OTP sent to your email'
    });
  } catch (error) {
    console.error('Teacher Forgot Password Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Reset teacher password with OTP
// @route   POST /api/teacher/reset-password
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, OTP, and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    const teacher = await Teacher.findOne({ email }).select('+password');
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    teacher.password = newPassword;
    await teacher.save();
    await OTP.deleteOne({ _id: otpRecord._id });

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.'
    });
  } catch (error) {
    console.error('Teacher Reset Password Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Teacher login
// @route   POST /api/teacher/login
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

    const teacher = await Teacher.findOne({ email }).select('+password');

    if (!teacher) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isPasswordMatch = await teacher.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = generateToken(teacher._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        teacher: {
          id: teacher._id,
          name: teacher.name,
          email: teacher.email,
          subject: teacher.subject,
          role: teacher.role
        }
      }
    });
  } catch (error) {
    console.error('Teacher Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Get teacher profile
// @route   GET /api/teacher/profile
// @access  Private (Teacher)
exports.getProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.teacherId);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: 'Teacher not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        subject: teacher.subject,
        phone: teacher.phone,
        createdAt: teacher.createdAt
      }
    });
  } catch (error) {
    console.error('Get Teacher Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// ─── MATERIALS ────────────────────────────────────────────────────────────────

// @desc    Upload a PDF material (Teacher)
// @route   POST /api/teacher/materials
// @access  Private (Teacher)
exports.uploadMaterial = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF file'
      });
    }

    const { name, subject, description } = req.body;

    if (!name || !subject) {
      // Delete uploaded file if validation fails
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Please provide material name and subject'
      });
    }

    const relativePath = req.file.path.replace(/\\/g, '/').split(/[\\/]/).slice(-2).join('/');
    const material = await Material.create({
      name,
      subject,
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

// @desc    Get all materials (Teacher)
// @route   GET /api/teacher/materials
// @access  Private (Teacher)
exports.getMaterials = async (req, res) => {
  try {
    const materials = await Material.find().sort({ uploadedAt: -1 });
    const materialsWithUrls = materials.map(m => {
      // Handle both old (with uploads/) and new (without uploads/) paths
      const filePath = m.filePath.startsWith('uploads/') ? m.filePath : `uploads/${m.filePath}`;
      return {
        ...m.toObject(),
        fileUrl: `/${filePath}`
      };
    });

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

// @desc    Delete a material (Teacher)
// @route   DELETE /api/teacher/materials/:id
// @access  Private (Teacher)
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

// ─── EVENTS ───────────────────────────────────────────────────────────────────

// @desc    Create an event (Teacher)
// @route   POST /api/teacher/events
// @access  Private (Teacher)
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

// @desc    Get all events (Teacher)
// @route   GET /api/teacher/events
// @access  Private (Teacher)
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

// @desc    Delete an event (Teacher)
// @route   DELETE /api/teacher/events/:id
// @access  Private (Teacher)
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
