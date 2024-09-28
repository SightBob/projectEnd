import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, {
  timestamps: true // This will automatically add createdAt and updatedAt fields
});

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);