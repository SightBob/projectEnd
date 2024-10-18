const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  reportedAt: {
    type: Date,
    default: Date.now
  }
});

// Check if the model is already compiled to avoid OverwriteModelError
module.exports = mongoose.models.Report || mongoose.model('Report', reportSchema);
