const Student = require('../models/Student');
const OTP = require('../models/OTP');
const Material = require('../models/Material');
const TimeTable = require('../models/TimeTable');
const Event = require('../models/Event');
const Query = require('../models/Query');
const { sendOTPEmail } = require('../services/emailService');
const crypto = require('crypto');

// @desc    Send OTP to email
// @route   POST /api/crashcourse/send-otp
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

    // Check if student already registered with this email
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'This email is already registered'
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email });

    // Save OTP to database
    await OTP.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    });

    // Send OTP via email
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
    console.error('Send OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Verify OTP
// @route   POST /api/crashcourse/verify-otp
// @access  Public
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and OTP'
      });
    }

    // Find OTP in database
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Check if OTP is expired
    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // OTP is valid - delete it
    await OTP.deleteOne({ _id: otpRecord._id });

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Register student for crash course
// @route   POST /api/crashcourse/register
// @access  Public
exports.registerStudent = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Check if email already registered
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'This email is already registered'
      });
    }

    const normalizedPaymentPath = req.file ? req.file.path.replace(/\\/g, '/') : '';

    // Create student with email verified and access active by default
    const student = await Student.create({
      name,
      email,
      phone,
      password,
      transactionId: '',
      paymentScreenshot: normalizedPaymentPath,
      emailVerified: true,
      paymentStatus: 'Approved'
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        studentId: student._id,
        name: student.name,
        email: student.email,
        courseName: student.courseName
      }
    });
  } catch (error) {
    console.error('Register Student Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Get student profile
// @route   GET /api/crashcourse/profile/:id
// @access  Public
exports.getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Get Student Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Update student profile
// @route   PATCH /api/crashcourse/profile/:id
// @access  Public
exports.updateStudentProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    // Find student
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Update allowed fields only
    if (name) student.name = name;
    if (phone) student.phone = phone;
    if (req.file) student.profilePhoto = req.file.path;

    await student.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: student
    });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Student login with email and password
// @route   POST /api/crashcourse/login
// @access  Public
exports.studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find student by email
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordMatch = await student.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        studentId: student._id,
        name: student.name,
        email: student.email,
        phone: student.phone
      }
    });
  } catch (error) {
    console.error('Student Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Send password reset OTP
// @route   POST /api/crashcourse/forgot-password
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

    // Check if student exists
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email'
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to database
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email });

    await OTP.create({
      email,
      otp,
      expiresAt
    });

    // Send OTP via email
    await sendOTPEmail(email, otp);

    res.status(200).json({
      success: true,
      message: 'Password reset OTP sent to your email'
    });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Reset password with OTP
// @route   POST /api/crashcourse/reset-password
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

    // Validate password length
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Find OTP record
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Check if OTP is expired
    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.'
      });
    }

    // Find student and update password
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Update password
    student.password = newPassword;
    await student.save();

    // Delete OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.'
    });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// ─── STUDENT: MATERIALS ───────────────────────────────────────────────────────

// @desc    Get materials (only for active students)
// @route   GET /api/crashcourse/materials/:studentId
// @access  Public (gated by access status check)
exports.getStudentMaterials = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    if (student.paymentStatus !== 'Approved') {
      return res.status(403).json({
        success: false,
        message: 'Your access is currently inactive. Please contact admin.'
      });
    }

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
    console.error('Get Student Materials Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// @desc    Get timetables (only for active students)
// @route   GET /api/crashcourse/timetables/:studentId
// @access  Public (gated by access status check)
exports.getStudentTimeTables = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    if (student.paymentStatus !== 'Approved') {
      return res.status(403).json({
        success: false,
        message: 'Your access is currently inactive. Please contact admin.'
      });
    }

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
    console.error('Get Student Timetable Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// ─── STUDENT: EVENTS ──────────────────────────────────────────────────────────

// @desc    Get all events (all logged-in students)
// @route   GET /api/crashcourse/events
// @access  Public
exports.getStudentEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Get Student Events Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// ─── STUDENT: CHANGE PASSWORD (logged-in, OTP-verified) ──────────────────────

// @desc    Send OTP to student's registered email for password change
// @route   POST /api/crashcourse/change-password-otp
// @access  Private (logged-in student)
exports.sendChangePasswordOTP = async (req, res) => {
  try {
    const { studentId, newPassword } = req.body;

    if (!studentId || !newPassword) {
      return res.status(400).json({ success: false, message: 'Student ID and new password required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const isSame = await student.comparePassword(newPassword);
    if (isSame) {
      return res.status(400).json({ success: false, message: 'New password must be different from current password' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.deleteMany({ email: student.email });
    await OTP.create({
      email: student.email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    await sendOTPEmail(student.email, otp);

    res.status(200).json({ success: true, message: 'OTP sent to your registered email' });
  } catch (error) {
    console.error('Send Change Password OTP Error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// @desc    Change password using OTP (for logged-in students)
// @route   POST /api/crashcourse/change-password
// @access  Private (logged-in student)
exports.changePassword = async (req, res) => {
  try {
    const { studentId, otp, newPassword } = req.body;

    if (!studentId || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const otpRecord = await OTP.findOne({ email: student.email, otp });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ success: false, message: 'OTP has expired. Request a new one.' });
    }

    student.password = newPassword;
    await student.save();
    await OTP.deleteOne({ _id: otpRecord._id });

    res.status(200).json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change Password Error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ─── STUDENT: SUBMIT QUERY ────────────────────────────────────────────────────

// @desc    Submit a support query
// @route   POST /api/crashcourse/queries
// @access  Public
exports.submitQuery = async (req, res) => {
  try {
    const { studentId, subject, message } = req.body;

    if (!studentId || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide studentId, subject, and message'
      });
    }

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    const query = await Query.create({
      studentId: student._id,
      studentName: student.name,
      studentEmail: student.email,
      subject,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Query submitted successfully! We will get back to you soon.',
      data: query
    });
  } catch (error) {
    console.error('Submit Query Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};
