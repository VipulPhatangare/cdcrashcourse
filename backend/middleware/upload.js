const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure directories exist
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// ─── Payment Screenshot Upload ────────────────────────────────────────────
const paymentStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    ensureDir('uploads/payments/');
    cb(null, 'uploads/payments/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'payment-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const imageFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
};

const upload = multer({
  storage: paymentStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter
});

// ─── Profile Photo Upload ─────────────────────────────────────────────────
const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    ensureDir('uploads/profiles/');
    cb(null, 'uploads/profiles/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadProfile = multer({
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter
});

// ─── PDF Material Upload ──────────────────────────────────────────────────
const pdfStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    ensureDir('uploads/materials/');
    cb(null, 'uploads/materials/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'material-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const pdfFilter = (req, file, cb) => {
  const extname = path.extname(file.originalname).toLowerCase() === '.pdf';
  const mimetype = file.mimetype === 'application/pdf';
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only PDF files are allowed'));
};

const uploadPDF = multer({
  storage: pdfStorage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: pdfFilter
});

// ─── TimeTable Image Upload ───────────────────────────────────────────────
const timeTableStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    ensureDir('uploads/timetables/');
    cb(null, 'uploads/timetables/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'timetable-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadTimeTable = multer({
  storage: timeTableStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: imageFilter
});

module.exports = upload;
module.exports.uploadProfile = uploadProfile;
module.exports.uploadPDF = uploadPDF;
module.exports.uploadTimeTable = uploadTimeTable;
