const mongoose = require('mongoose');

const timeTableSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide timetable title'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  imagePath: {
    type: String,
    required: [true, 'Timetable image path is required']
  },
  originalName: {
    type: String,
    default: ''
  },
  uploadedBy: {
    type: String,
    enum: ['admin', 'teacher'],
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TimeTable', timeTableSchema);
