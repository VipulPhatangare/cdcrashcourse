const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide event title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide event description'],
    trim: true
  },
  zoomLink: {
    type: String,
    required: [true, 'Please provide Zoom meeting link'],
    trim: true
  },
  date: {
    type: String,
    required: [true, 'Please provide event date'],
    trim: true
  },
  time: {
    type: String,
    required: [true, 'Please provide event time'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Event', eventSchema);
