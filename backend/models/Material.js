const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide material name'],
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Please provide material subject'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  filePath: {
    type: String,
    required: [true, 'File path is required']
  },
  originalName: {
    type: String,
    default: ''
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Material', materialSchema);
