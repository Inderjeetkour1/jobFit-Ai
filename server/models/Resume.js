const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  content: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resume', ResumeSchema);
