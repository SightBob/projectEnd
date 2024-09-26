import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  title: String,
  message: String,
  isRead: Boolean,
  readed: { type: [String], default: [] }, // Array of userIds who have read the notification
  createdAt: { type: Date, default: Date.now },
  scheduledTime: { type: Date, required: true }, // New field for scheduling
});

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);