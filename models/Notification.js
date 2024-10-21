import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  title: String,
  message: String,
  isRead: Boolean,
  type: String,
  readed: { type: [String], default: [] }, 
  createdAt: { type: Date, default: Date.now },
  scheduledTime: { type: Date, required: true }, 
});

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);