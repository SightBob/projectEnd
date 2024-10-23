import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  title: String,
  message: String,
  isRead: Boolean,
  type: String,
  canRead: Object,
  readed: { type: [String], default: [] },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  sendEmail: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: { type: Date, default: Date.now },
  scheduledTime: { type: Date, required: true },
});

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
